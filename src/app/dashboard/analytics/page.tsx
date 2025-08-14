"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Award,
  Mic,
  MessageSquare,
  BookOpen,
  Star,
  Users,
  Zap,
  Download,
  Filter,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface AnalyticsData {
  keyMetrics: {
    overallScore: number
    scoreChange: number
    sessionsThisMonth: number
    sessionsLastMonth: number
    practiceTimeHours: number
    practiceTimeChange: number
    improvementRate: number
    improvementChange: number
  }
  performanceData: Array<{
    month: string
    voice: number
    text: number
    mock: number
  }>
  categoryBreakdown: Array<{
    category: string
    score: number
    sessions: number
    improvement: string
    totalQuestions: number
    averageTime: number
  }>
  recentSessions: Array<{
    id: string
    date: string
    type: string
    category: string
    score: number
    duration: number
    improvement: string
    questionsAnswered: number
    totalQuestions: number
  }>
  quickStats: {
    dayStreak: number
    completionRate: number
    globalRanking: string
    totalSessions: number
    totalPracticeTime: number
    averageScore: number
    bestScore: number
    mostImprovedCategory: string
  }
  weeklyActivity: Array<{
    day: string
    sessions: number
    score: number
  }>
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const data = await response.json()
      setAnalyticsData(data)
      setError(null)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VOICE': return <Mic className="w-5 h-5" />
      case 'TEXT': return <MessageSquare className="w-5 h-5" />
      case 'MOCK': return <BookOpen className="w-5 h-5" />
      default: return <MessageSquare className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VOICE': return "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
      case 'TEXT': return "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
      case 'MOCK': return "bg-green-100 dark:bg-green-900/30 text-green-600"
      default: return "bg-slate-100 dark:bg-slate-900/30 text-slate-600"
    }
  }

  const formatType = (type: string) => {
    switch (type.toUpperCase()) {
      case 'VOICE': return 'Voice Interview'
      case 'TEXT': return 'Text Interview'
      case 'MOCK': return 'Mock Interview'
      default: return type
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !analyticsData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {error || 'Failed to load analytics'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Unable to fetch your analytics data. Please try again.
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Performance Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your progress and identify areas for improvement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.keyMetrics.overallScore}</p>
                <div className="flex items-center gap-1 mt-2">
                  {analyticsData.keyMetrics.scoreChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${analyticsData.keyMetrics.scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.keyMetrics.scoreChange >= 0 ? '+' : ''}{analyticsData.keyMetrics.scoreChange} this week
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Sessions This Month</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.keyMetrics.sessionsThisMonth}</p>
                <div className="flex items-center gap-1 mt-2">
                  {analyticsData.keyMetrics.sessionsThisMonth >= analyticsData.keyMetrics.sessionsLastMonth ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${analyticsData.keyMetrics.sessionsThisMonth >= analyticsData.keyMetrics.sessionsLastMonth ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.keyMetrics.sessionsThisMonth >= analyticsData.keyMetrics.sessionsLastMonth ? '+' : ''}
                    {analyticsData.keyMetrics.sessionsThisMonth - analyticsData.keyMetrics.sessionsLastMonth} from last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Practice Time</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.keyMetrics.practiceTimeHours}h</p>
                <div className="flex items-center gap-1 mt-2">
                  {analyticsData.keyMetrics.practiceTimeChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${analyticsData.keyMetrics.practiceTimeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.keyMetrics.practiceTimeChange >= 0 ? '+' : ''}{analyticsData.keyMetrics.practiceTimeChange}h this week
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Improvement Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.keyMetrics.improvementRate}%</p>
                <div className="flex items-center gap-1 mt-2">
                  {analyticsData.keyMetrics.improvementChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${analyticsData.keyMetrics.improvementChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.keyMetrics.improvementChange >= 0 ? '+' : ''}{analyticsData.keyMetrics.improvementChange}% this month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Your score progression across different interview types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.performanceData.length > 0 ? (
                <div className="h-80 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[10, 8, 6, 4, 2, 0].map((value) => (
                      <div key={value} className="flex items-center">
                        <span className="text-xs text-slate-400 w-6">{value}</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 ml-2"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart area */}
                  <div className="absolute inset-0 ml-8 mr-4 mt-2 mb-8">
                    <svg className="w-full h-full" viewBox="0 0 600 280">
                      {/* Voice line */}
                      <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={analyticsData.performanceData.map((data, index) => 
                          `${(index * 100) + 50},${280 - (data.voice / 10) * 250}`
                        ).join(' ')}
                      />
                      
                      {/* Text line */}
                      <polyline
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={analyticsData.performanceData.map((data, index) => 
                          `${(index * 100) + 50},${280 - (data.text / 10) * 250}`
                        ).join(' ')}
                      />
                      
                      {/* Mock line */}
                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={analyticsData.performanceData.map((data, index) => 
                          `${(index * 100) + 50},${280 - (data.mock / 10) * 250}`
                        ).join(' ')}
                      />
                      
                      {/* Data points */}
                      {analyticsData.performanceData.map((data, index) => (
                        <g key={data.month}>
                          {/* Voice point */}
                          <circle
                            cx={(index * 100) + 50}
                            cy={280 - (data.voice / 10) * 250}
                            r="4"
                            fill="#3B82F6"
                            className="hover:r-6 transition-all cursor-pointer"
                          >
                            <title>Voice: {data.voice}/10</title>
                          </circle>
                          
                          {/* Text point */}
                          <circle
                            cx={(index * 100) + 50}
                            cy={280 - (data.text / 10) * 250}
                            r="4"
                            fill="#8B5CF6"
                            className="hover:r-6 transition-all cursor-pointer"
                          >
                            <title>Text: {data.text}/10</title>
                          </circle>
                          
                          {/* Mock point */}
                          <circle
                            cx={(index * 100) + 50}
                            cy={280 - (data.mock / 10) * 250}
                            r="4"
                            fill="#10B981"
                            className="hover:r-6 transition-all cursor-pointer"
                          >
                            <title>Mock: {data.mock}/10</title>
                          </circle>
                          
                          {/* Month label */}
                          <text
                            x={(index * 100) + 50}
                            y="300"
                            textAnchor="middle"
                            className="text-xs fill-slate-600 dark:fill-slate-400"
                          >
                            {data.month}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-blue-500 rounded"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Voice Interview</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {analyticsData.performanceData[analyticsData.performanceData.length - 1]?.voice}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-purple-500 rounded"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Text Interview</span>
                      <span className="text-sm font-semibold text-purple-600">
                        {analyticsData.performanceData[analyticsData.performanceData.length - 1]?.text}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-green-500 rounded"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Mock Interview</span>
                      <span className="text-sm font-semibold text-green-600">
                        {analyticsData.performanceData[analyticsData.performanceData.length - 1]?.mock}/10
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No Performance Data Yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Complete some interview sessions to see your performance trends
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Start Practicing
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.categoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.categoryBreakdown.map((category, index) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-white">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{category.score}/10</span>
                          <span className="text-xs text-green-600">{category.improvement}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(category.score / 10) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>{category.sessions} sessions</span>
                        <span>{Math.round((category.score / 10) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    No category data available yet. Complete some interviews to see your performance by category.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {analyticsData.quickStats.dayStreak}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {analyticsData.quickStats.totalSessions}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total Sessions</div>
                </div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {analyticsData.quickStats.averageScore > 0 ? `${analyticsData.quickStats.averageScore}/10` : 'No data'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Average Score</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Your latest practice sessions and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.recentSessions.length > 0 ? (
              <>
                <div className="space-y-4">
                  {analyticsData.recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(session.type)}`}>
                          {getTypeIcon(session.type)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{formatType(session.type)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {session.category} • {session.duration} min • {formatDate(session.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(session.score / 2) ? "text-yellow-400 fill-current" : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">{session.score}/10</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {session.improvement.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${session.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {session.improvement}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline">
                    View All Sessions
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No Recent Sessions
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Start practicing to see your recent interview sessions here
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Start Your First Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}