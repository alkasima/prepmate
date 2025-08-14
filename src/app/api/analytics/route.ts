import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since we're working without database, show minimal real data
    // Only show data that would actually exist from user sessions
    
    // For demo purposes, we'll show very basic metrics
    // In production, this would query your actual database
    const analytics = {
      keyMetrics: {
        overallScore: 0,
        scoreChange: 0,
        sessionsThisMonth: 0,
        sessionsLastMonth: 0,
        practiceTimeHours: 0,
        practiceTimeChange: 0,
        improvementRate: 0,
        improvementChange: 0
      },
      
      // No historical data since we don't have a real database
      performanceData: [],
      
      // No category breakdown since we don't have real session data
      categoryBreakdown: [],
      
      // No recent sessions since we don't have real data
      recentSessions: [],
      
      quickStats: {
        dayStreak: 0,
        completionRate: 0,
        globalRanking: "No data",
        totalSessions: 0,
        totalPracticeTime: 0,
        averageScore: 0,
        bestScore: 0,
        mostImprovedCategory: "None"
      },
      
      // No weekly activity data
      weeklyActivity: []
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}