import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, category, totalQuestions = 5 } = await request.json()

    if (!type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new interview session
    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId: session.user.id,
        type: type.toUpperCase(),
        category: category.toUpperCase(),
        status: 'IN_PROGRESS',
        totalQuestions
      }
    })

    return NextResponse.json({ sessionId: interviewSession.id })
  } catch (error) {
    console.error('Error creating interview session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
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