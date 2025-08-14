import { NextRequest, NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/gemini'

export async function GET() {
  try {
    // First test if Gemini API key is working
    const { geminiModel } = await import('@/lib/gemini')
    
    console.log('Testing basic Gemini connection...')
    const testResult = await geminiModel.generateContent('Say hello')
    const testResponse = testResult.response
    const testText = testResponse.text()
    
    console.log('Basic Gemini test successful:', testText)

    // Now test resume analysis
    const testResumeText = `
JANE SMITH
Software Developer
Email: jane.smith@email.com
Phone: (555) 987-6543
Location: New York, NY

PROFESSIONAL SUMMARY
Passionate Frontend Developer with 3 years of experience.

WORK EXPERIENCE
Frontend Developer | WebTech Solutions | 2021 - Present
• Developed web applications using React and TypeScript

EDUCATION
Bachelor of Science in Computer Science
New York University | 2020

SKILLS
JavaScript, React, HTML5, CSS3
    `

    console.log('Testing Gemini AI with sample resume...')
    const result = await analyzeResume(testResumeText)
    
    return NextResponse.json({ 
      success: true, 
      extractedData: result,
      basicTest: testText,
      message: 'Gemini AI analysis successful'
    })
  } catch (err) {
    const error = err as any
    console.error('Gemini test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message ?? String(error),
      stack: error?.stack,
      message: 'Gemini AI analysis failed'
    }, { status: 500 })
  }
}