import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateInterviewQuestions } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeData, jobRole, difficulty } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data required' }, { status: 400 })
    }

    // Generate custom interview questions based on resume
    const questions = await generateInterviewQuestions(
      resumeData, 
      jobRole || 'Software Engineer',
      difficulty || 'intermediate'
    )

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}