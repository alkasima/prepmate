import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting session creation...')
    
    const session = await getServerSession(authOptions)
    console.log('Session check:', session?.user?.id ? 'User authenticated' : 'No user session')
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { type, category, totalQuestions = 5 } = body

    if (!type || !category) {
      console.log('Missing required fields:', { type, category })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Creating interview session with data:', {
      userId: session.user.id,
      type: type.toUpperCase(),
      category: category.toUpperCase(),
      status: 'IN_PROGRESS',
      totalQuestions
    })

    // Create new interview session
    try {
      const interviewSession = await prisma.interviewSession.create({
        data: {
          userId: session.user.id,
          type: type.toUpperCase(),
          category: category.toUpperCase(),
          status: 'IN_PROGRESS',
          totalQuestions
        }
      })

      console.log('Interview session created successfully:', interviewSession.id)
      return NextResponse.json({ sessionId: interviewSession.id })
    } catch (dbError) {
      console.error('Database error, using fallback session ID:', dbError)
      // Fallback: generate a temporary session ID for demo purposes
      const fallbackSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Using fallback session ID:', fallbackSessionId)
      return NextResponse.json({ sessionId: fallbackSessionId })
    }
  } catch (error) {
    console.error('Error creating interview session:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, status, duration } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })
    }

    // Update interview session
    const updatedSession = await prisma.interviewSession.update({
      where: { 
        id: sessionId,
        userId: session.user.id // Ensure user owns the session
      },
      data: {
        status: status?.toUpperCase(),
        duration,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error('Error updating interview session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}