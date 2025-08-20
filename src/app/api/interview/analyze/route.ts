import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeInterviewResponse } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question, answer, category, sessionId } = await request.json()

    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user profile for personalized feedback
    let user = null
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          experience: true,
          skills: true,
          targetRole: true
        }
      })
    } catch (dbError) {
      console.error('Database error fetching user profile:', dbError)
      // Continue without user profile - feedback will still work
    }

    // Analyze the response with Gemini AI
    const feedback = await analyzeInterviewResponse(
      question,
      answer,
      category,
      user ? {
        experience: user.experience || undefined,
        skills: user.skills || undefined,
        targetRole: user.targetRole || undefined
      } : undefined
    )

    // Save the question and feedback to database
    if (sessionId && !sessionId.startsWith('temp_')) {
      try {
        await prisma.interviewQuestion.create({
          data: {
            sessionId,
            question,
            answer,
            score: feedback.score,
            feedback: JSON.stringify(feedback)
          }
        })

        // Update session score (average of all questions)
        const sessionQuestions = await prisma.interviewQuestion.findMany({
          where: { sessionId },
          select: { score: true }
        })

        const averageScore = sessionQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / sessionQuestions.length

        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            score: averageScore,
            questionsAnswered: sessionQuestions.length
          }
        })
      } catch (dbError) {
        console.error('Database error saving interview data:', dbError)
        // Continue without saving to database - the feedback will still work
      }
    } else if (sessionId?.startsWith('temp_')) {
      console.log('Skipping database save for temporary session:', sessionId)
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error analyzing interview response:', error)
    return NextResponse.json(
      { error: 'Failed to analyze response' },
      { status: 500 }
    )
  }
}