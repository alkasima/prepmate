import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeResume } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file content
    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer).toString('utf-8')

    // For demo purposes, we'll use a simple text extraction
    // In production, you'd use a proper PDF/DOC parser
    let resumeText = fileContent

    // If it's a PDF or DOC file, you might get binary data
    // For now, we'll use a fallback text for demo
    if (file.type.includes('pdf') || file.type.includes('doc')) {
      resumeText = `
        John Doe
        Software Engineer
        john.doe@email.com
        (555) 123-4567
        San Francisco, CA

        PROFESSIONAL SUMMARY
        Experienced Full Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies.

        EXPERIENCE
        Senior Software Engineer - TechCorp Inc. (2022 - Present)
        - Led development of microservices architecture serving 1M+ users
        - Improved system performance by 40% and reduced deployment time by 60%
        - Mentored junior developers and conducted code reviews

        Full Stack Developer - StartupXYZ (2020 - 2022)
        - Built responsive web applications using React and Node.js
        - Collaborated with design team to implement pixel-perfect UI components
        - Implemented CI/CD pipelines and automated testing

        EDUCATION
        Bachelor of Science in Computer Science
        University of California, Berkeley (2019)

        SKILLS
        JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB

        CERTIFICATIONS
        AWS Certified Solutions Architect
        Google Cloud Professional Developer
      `
    }

    // Analyze resume with Gemini AI
    const extractedData = await analyzeResume(resumeText)

    // Save resume to database
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

    // Update user profile with extracted information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: extractedData.personalInfo?.name || undefined,
        phone: extractedData.personalInfo?.phone || undefined,
        location: extractedData.personalInfo?.location || undefined,
        skills: extractedData.skills || undefined,
        // Add other fields as needed
      }
    })

    return NextResponse.json({ 
      resumeId: resume.id,
      extractedData 
    })
  } catch (error) {
    console.error('Error analyzing resume:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}