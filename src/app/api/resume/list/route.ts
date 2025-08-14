import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's resumes (with error handling)
    let resumes: any[] = []
    try {
      resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          fileSize: true,
          mimeType: true,
          createdAt: true,
          extractedData: true
        }
      })
    } catch (dbError) {
      console.error('Database query failed:', dbError)
      // Return empty array if database fails
      resumes = []
    }

    return NextResponse.json({ resumes, success: true })
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}