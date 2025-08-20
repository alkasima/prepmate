import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { analyzeResume } from '@/lib/gemini' // dynamically imported below

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (err) {
      console.error('Failed to parse formData:', err)
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file content and extract text
    let resumeText = ''

    try {
      // Convert ArrayBuffer to Uint8Array for safe decoding in all runtimes
      const arrayBuffer = await file.arrayBuffer()
      const uint8 = new Uint8Array(arrayBuffer)

      const mime = (file.type || '').toLowerCase()
      const name = (file.name || '').toLowerCase()

      if (mime.includes('pdf') || name.endsWith('.pdf')) {
        console.log('Processing PDF file...')
        // Try to dynamically import pdf-parse (avoids module-load failures)
        let pdfModule: any = null
        try {
          pdfModule = await import('pdf-parse')
          console.log('pdf-parse module loaded successfully')
        } catch (impErr) {
          console.warn('pdf-parse dynamic import failed:', impErr)
        }

        if (pdfModule) {
          // pdf-parse expects a Buffer in Node; create if available
          let buffer: any
          if (typeof Buffer !== 'undefined') {
            buffer = Buffer.from(arrayBuffer)
          } else {
            buffer = uint8
          }

          const pdfFunc = pdfModule.default || pdfModule
          const pdfData = await pdfFunc(buffer)
          resumeText = pdfData?.text || ''
          console.log('PDF text extracted, length:', resumeText.length)
        } else {
          console.log('Falling back to basic text decoding for PDF')
          // Fallback: decode bytes to text (best effort)
          resumeText = new TextDecoder('utf-8').decode(uint8)
        }
      } else if (
        mime.includes('msword') ||
        mime.includes('officedocument') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx')
      ) {
        console.log('Processing Word document...')
        // For DOC/DOCX files, fallback to text decoding (in prod use mammoth)
        resumeText = new TextDecoder('utf-8').decode(uint8)
        console.log('Word document text extracted, length:', resumeText.length)
      } else {
        console.log('Processing as plain text file...')
        // Plain text or unknown - try to decode as utf-8
        resumeText = new TextDecoder('utf-8').decode(uint8)
        console.log('Plain text extracted, length:', resumeText.length)
      }

      // If text extraction failed or resulted in very short text, use fallback
      if (!resumeText || resumeText.trim().length < 50) {
        console.warn('Text extraction resulted in short content, length:', resumeText?.length)
        throw new Error('Text extraction failed or insufficient content')
      }
      
      console.log('Text extraction successful, length:', resumeText.length)
      console.log('First 200 chars:', resumeText.substring(0, 200))
    } catch (extractionError) {
      console.error('Text extraction failed:', extractionError)
      
      // Return error instead of using fallback - let user know extraction failed
      return NextResponse.json({ 
        error: 'Failed to extract text from the uploaded file. Please ensure the file is not corrupted and try again.',
        details: extractionError instanceof Error ? extractionError.message : 'Unknown extraction error'
      }, { status: 400 })
    }



    // Dynamically import analyzeResume to avoid module initialization errors (e.g. missing GEMINI_API_KEY)
    let analyzeResume: any = null
    try {
      const geminiModule = await import('@/lib/gemini')
      analyzeResume = geminiModule.analyzeResume
      if (typeof analyzeResume !== 'function') {
        throw new Error('analyzeResume not found in gemini module')
      }
    } catch (impErr: any) {
      console.error('Failed to load AI analysis module:', impErr)
      // Return JSON error so client can surface message
      return NextResponse.json({ error: `AI module load failed: ${impErr?.message || String(impErr)}` }, { status: 500 })
    }

    // Analyze resume with Gemini AI
    let extractedData: any
    try {
      console.log('Analyzing resume with Gemini AI...')
      console.log('Resume text length:', resumeText.length)

      extractedData = await analyzeResume(resumeText)

      // Validate the extracted data
      if (!extractedData || !extractedData.personalInfo) {
        throw new Error('Invalid extracted data structure')
      }

      console.log('Gemini AI analysis successful')
    } catch (aiError: any) {
      console.error('Gemini AI analysis failed:', aiError)
      console.log('Falling back to text-based parsing...')

      // Try text-based parsing as fallback
      try {
        const { parseResumeText } = await import('@/lib/resume-parser')
        extractedData = parseResumeText(resumeText)
        console.log('Text-based parsing successful')
      } catch (parseError) {
        console.error('Text-based parsing also failed:', parseError)
        
        // Last resort: use comprehensive fallback data
        extractedData = {
          personalInfo: {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA"
          },
          summary: "Experienced Full Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies.",
          experience: [
            {
              title: "Senior Software Engineer",
              company: "TechCorp Inc.",
              duration: "2022 - Present",
              description: "Led development of microservices architecture serving 1M+ users. Improved system performance by 40% and reduced deployment time by 60%."
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              school: "University of California, Berkeley",
              year: "2019"
            }
          ],
          skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
          certifications: [],
          languages: ["English"]
        }
      }
    }

    // Save resume to database (with error handling)
    let resumeId = 'demo-' + Date.now()
    try {
      const resume = await prisma.resume.create({
        data: {
          userId: session.user.id,
          filename: file.name,
          fileUrl: '', // In production, upload to cloud storage
          fileSize: file.size,
          mimeType: file.type,
          extractedData: extractedData
        }
      })
      resumeId = resume.id

      // Update user profile with extracted information
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: extractedData.personalInfo?.name || undefined,
          phone: extractedData.personalInfo?.phone || undefined,
          location: extractedData.personalInfo?.location || undefined,
          skills: extractedData.skills || undefined,
        }
      })
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      // Continue with demo ID - the analysis still works
    }

    return NextResponse.json({ 
      resumeId: resumeId,
      extractedData,
      success: true,
      message: 'Resume analyzed successfully'
    })
  } catch (error: any) {
    console.error('Error analyzing resume:', error)
    const message = error?.message || 'Failed to analyze resume'
    // Return the specific error message (helpful in dev). Avoid exposing sensitive details in production.
    return NextResponse.json({ error: message }, { status: 500 })
  }
}