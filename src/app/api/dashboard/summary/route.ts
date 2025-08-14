import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Aggregate stats
    const [countAll, scoreAgg, durationAgg, recent] = await Promise.all([
      prisma.interviewSession.count({ where: { userId } }),
      prisma.interviewSession.aggregate({ where: { userId, score: { not: null } }, _avg: { score: true }, _max: { score: true } }),
      prisma.interviewSession.aggregate({ where: { userId, duration: { not: null } }, _sum: { duration: true } }),
      prisma.interviewSession.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5 })
    ])

    // Simple achievements count: sessions with score >= 9
    const achievements = await prisma.interviewSession.count({ where: { userId, score: { gte: 9 } } })

    // Compute streak (days in a row including today with at least one session)
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const days = await prisma.interviewSession.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } })
    const daySet = new Set(days.map(d => new Date(d.createdAt.getFullYear(), d.createdAt.getMonth(), d.createdAt.getDate()).getTime()))
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 60; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      if (daySet.has(key)) streak++
      else break
    }

    // Sessions this week (last 7 days)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(startOfToday)
    sevenDaysAgo.setDate(startOfToday.getDate() - 6)

    const sessionsThisWeek = await prisma.interviewSession.count({
      where: { userId, createdAt: { gte: sevenDaysAgo } }
    })

    // Max sessions in a single day (last 60 days) for an achievement
    const last60 = new Date()
    last60.setDate(last60.getDate() - 60)
    const last60Sessions = await prisma.interviewSession.findMany({
      where: { userId, createdAt: { gte: last60 } },
      select: { createdAt: true, score: true }
    })
    const perDay: Record<string, number> = {}
    let personalBest = typeof scoreAgg._max.score === 'number' ? scoreAgg._max.score : null
    for (const s of last60Sessions) {
      const key = new Date(s.createdAt.getFullYear(), s.createdAt.getMonth(), s.createdAt.getDate()).toISOString()
      perDay[key] = (perDay[key] || 0) + 1
      if (typeof s.score === 'number') {
        personalBest = Math.max(personalBest ?? s.score, s.score)
      }
    }
    const maxSessionsInADay = Object.values(perDay).reduce((m, v) => Math.max(m, v), 0)

    // Build achievements list
    const achievementsList: Array<{ title: string; description: string; icon?: string }> = []
    if (countAll >= 1) achievementsList.push({ title: 'Getting Started', description: 'Completed your first session 🎉' })
    if (achievements > 0) achievementsList.push({ title: 'High Performer', description: 'Scored 9 or higher in a session' })
    if ((personalBest ?? 0) >= 9.5) achievementsList.push({ title: 'Personal Best', description: `Top score ${Math.round((personalBest as number) * 10) / 10}/10` })
    if (streak >= 7) achievementsList.push({ title: 'On Fire', description: `Current streak ${streak} days 🔥` })
    if (maxSessionsInADay >= 5) achievementsList.push({ title: 'Marathoner', description: 'Completed 5 sessions in a day' })

    const recentSessions = recent.map(s => ({
      id: s.id,
      type: s.category, // TECHNICAL | BEHAVIORAL | GENERAL | MIXED
      mode: s.type, // VOICE | TEXT | MOCK
      score: typeof s.score === 'number' ? Math.round(s.score * 10) / 10 : null,
      createdAt: s.createdAt,
      duration: s.duration ?? null,
      status: s.status
    }))

    return NextResponse.json({
      stats: {
        sessionsCount: countAll,
        averageScore: scoreAgg._avg.score ?? null,
        totalMinutes: durationAgg._sum.duration ?? 0,
        achievements,
        streak,
        sessionsThisWeek
      },
      goals: {
        weeklyTarget: 5,
        weeklyCompleted: sessionsThisWeek,
        scoreTarget: 9.0
      },
      achievementsList,
      recentSessions
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard summary' }, { status: 500 })
  }
}

