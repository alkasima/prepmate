"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/dashboard/layout'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Award,
  MessageSquare,
  Lightbulb,
  Star,
  Download,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react'

function titleCase(s: string | null | undefined) {
  if (!s) return ''
  return s.toLowerCase().replace(/(^|_)([a-z])/g, (_, p1, p2) => (p1 ? ' ' : '') + p2.toUpperCase())
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleString()
  } catch {
    return ''
  }
}

interface SessionData {
  id: string
  type: string
  category: string
  status: string
  createdAt: string
  duration: number | null
  score: number | null
  questionsAnswered: number
  totalQuestions: number
  questions: Array<{
    id: string
    question: string
    answer: string
    score: number | null
    feedback: string | null
    createdAt: string
  }>
}

export default function SessionRecapPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Unwrap params using React.use()
  const resolvedParams = React.use(params)

  useEffect(() => {
    setSessionId(resolvedParams.id)
  }, [resolvedParams.id])

  useEffect(() => {
    if (session && sessionId) {
      fetchSessionData()
    }
  }, [session, sessionId])

  const fetchSessionData = async () => {
    if (!sessionId) return
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Session not found')
          return
        }
        throw new Error('Failed to fetch session data')
      }
      const data = await response.json()
      setSessionData(data)
    } catch (err) {
      setError('Failed to load session data')
      console.error('Error fetching session:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !session) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading session data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !sessionData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {error || 'Session not found'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The session you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link href="/dashboard/sessions">
              <Button>Back to Sessions</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Process data only when sessionData is available
  const qa = sessionData?.questions?.map((q) => {
    let parsed: any = null
    try { parsed = q.feedback ? JSON.parse(q.feedback) : null } catch {}
    return {
      id: q.id,
      question: q.question,
      answer: q.answer,
      score: typeof q.score === 'number' ? Math.round(q.score * 10) / 10 : null,
      strengths: (parsed?.strengths as string[]) || [],
      suggestions: (parsed?.suggestions as string[]) || parsed?.weaknesses || [],
      confidence: parsed?.confidence || null,
      clarity: parsed?.clarity || null,
      relevance: parsed?.relevance || null,
      createdAt: q.createdAt,
    }
  }) || []

  const avgScore = typeof sessionData?.score === 'number' ? Math.round(sessionData.score * 10) / 10 : null
  const totalStrengths = qa?.reduce((sum, q) => sum + q.strengths.length, 0) || 0
  const totalSuggestions = qa?.reduce((sum, q) => sum + q.suggestions.length, 0) || 0
  const avgConfidence = qa && qa.length > 0 ? Math.round(qa.reduce((sum, q) => sum + (q.confidence || 0), 0) / qa.length) : null
  const avgClarity = qa && qa.length > 0 ? Math.round(qa.reduce((sum, q) => sum + (q.clarity || 0), 0) / qa.length) : null

  // Button handlers
  const handleExport = async () => {
    setExportLoading(true)
    try {
      // Generate PDF report
      if (!sessionData) return

      const reportData = {
        session: sessionData,
        questions: qa,
        metrics: {
          avgScore,
          avgConfidence,
          avgClarity,
          totalStrengths,
          totalSuggestions
        }
      }

      // Create a formatted text report
      let report = `INTERVIEW SESSION REPORT\n`
      report += `========================\n\n`
      report += `Session Details:\n`
      report += `- Type: ${titleCase(sessionData.type)}\n`
      report += `- Category: ${titleCase(sessionData.category)}\n`
      report += `- Date: ${fmtDate(new Date(sessionData.createdAt))}\n`
      report += `- Duration: ${sessionData.duration ? `${sessionData.duration} minutes` : 'Not recorded'}\n`
      report += `- Status: ${titleCase(sessionData.status)}\n`
      report += `- Questions Answered: ${sessionData.questionsAnswered}/${sessionData.totalQuestions}\n`
      report += `- Overall Score: ${avgScore ? `${avgScore}/10` : 'Not scored'}\n\n`

      if (avgConfidence || avgClarity) {
        report += `Performance Metrics:\n`
        if (avgConfidence) report += `- Average Confidence: ${avgConfidence}%\n`
        if (avgClarity) report += `- Average Clarity: ${avgClarity}%\n`
        report += `- Completion Rate: ${Math.round((sessionData.questionsAnswered / sessionData.totalQuestions) * 100)}%\n\n`
      }

      report += `QUESTIONS & FEEDBACK:\n`
      report += `=====================\n\n`

      qa.forEach((item, idx) => {
        report += `Question ${idx + 1}:\n`
        report += `${item.question}\n\n`
        report += `Your Answer:\n`
        report += `${item.answer || 'No answer recorded'}\n\n`
        report += `Score: ${item.score ? `${item.score}/10` : 'Not scored'}\n\n`
        
        if (item.strengths.length > 0) {
          report += `Strengths:\n`
          item.strengths.forEach(strength => report += `• ${strength}\n`)
          report += `\n`
        }
        
        if (item.suggestions.length > 0) {
          report += `Areas for Improvement:\n`
          item.suggestions.forEach(suggestion => report += `• ${suggestion}\n`)
          report += `\n`
        }
        
        report += `---\n\n`
      })

      // Download as text file
      const blob = new Blob([report], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interview-session-${sessionData.id}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export session. Please try again.')
    } finally {
      setExportLoading(false)
    }
  }

  const handleShare = async () => {
    if (!sessionData) return
    
    setShareLoading(true)
    try {
      const shareUrl = `${window.location.origin}/dashboard/sessions/${sessionData.id}`
      const shareText = `Check out my interview session results! Overall score: ${avgScore ? `${avgScore}/10` : 'In progress'}`

      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: 'Interview Session Results',
          text: shareText,
          url: shareUrl,
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        alert('Session link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share failed:', error)
      // Fallback: copy to clipboard
      try {
        const shareUrl = `${window.location.origin}/dashboard/sessions/${sessionData.id}`
        await navigator.clipboard.writeText(shareUrl)
        alert('Session link copied to clipboard!')
      } catch (clipboardError) {
        alert('Unable to share. Please copy the URL manually.')
      }
    } finally {
      setShareLoading(false)
    }
  }

  const handlePracticeAgain = () => {
    if (!sessionData) return
    
    // Navigate to practice page with same settings
    const practiceUrl = `/dashboard/practice/mock?category=${sessionData.category.toLowerCase()}&type=${sessionData.type.toLowerCase()}`
    router.push(practiceUrl)
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-slate-400'
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number | null) => {
    if (!score) return 'bg-slate-100 dark:bg-slate-700'
    if (score >= 8) return 'bg-green-50 dark:bg-green-900/20'
    if (score >= 6) return 'bg-yellow-50 dark:bg-yellow-900/20'
    return 'bg-red-50 dark:bg-red-900/20'
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/sessions"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Session Recap
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {titleCase(sessionData.type)} Interview • {titleCase(sessionData.category)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="border-slate-300 dark:border-slate-600"
              onClick={handleExport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {exportLoading ? 'Exporting...' : 'Export'}
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-300 dark:border-slate-600"
              onClick={handleShare}
              disabled={shareLoading}
            >
              {shareLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2"></div>
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {shareLoading ? 'Sharing...' : 'Share'}
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handlePracticeAgain}
            >
              <Target className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className={`border-0 shadow-lg ${getScoreBg(avgScore)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>
                  {avgScore !== null ? `${avgScore}/10` : '—'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${avgScore && avgScore >= 8 ? 'bg-green-500' : avgScore && avgScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'} flex items-center justify-center`}>
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Questions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {sessionData.questionsAnswered}/{sessionData.totalQuestions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Duration</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {sessionData.duration ? `${sessionData.duration}m` : '—'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {titleCase(sessionData.status)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                sessionData.status === 'COMPLETED' ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {sessionData.status === 'COMPLETED' ? 
                  <CheckCircle className="w-6 h-6 text-white" /> : 
                  <AlertCircle className="w-6 h-6 text-white" />
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {(avgConfidence || avgClarity) && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {avgConfidence && (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${avgConfidence}, 100`}
                        className="text-blue-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{avgConfidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Confidence</p>
                </div>
              )}
              
              {avgClarity && (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${avgClarity}, 100`}
                        className="text-green-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{avgClarity}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Clarity</p>
                </div>
              )}
              
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${Math.round((sessionData.questionsAnswered / sessionData.totalQuestions) * 100)}, 100`}
                      className="text-purple-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {Math.round((sessionData.questionsAnswered / sessionData.totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Details */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Started</p>
              <p className="font-medium text-slate-900 dark:text-white">{fmtDate(new Date(sessionData.createdAt))}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Type</p>
              <p className="font-medium text-slate-900 dark:text-white">{titleCase(sessionData.type)}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Category</p>
              <p className="font-medium text-slate-900 dark:text-white">{titleCase(sessionData.category)}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Insights</p>
              <p className="font-medium text-slate-900 dark:text-white">{totalStrengths + totalSuggestions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions & Feedback */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Questions & AI Feedback
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Detailed analysis of your interview responses
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {qa.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No questions recorded for this session.</p>
              </div>
            )}
            
            {qa.map((item, idx) => (
              <div key={item.id} className="relative">
                {/* Question Card */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Question {idx + 1} • {fmtDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(item.score)} ${getScoreColor(item.score)}`}>
                      {item.score !== null ? `${item.score}/10` : 'No Score'}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 leading-relaxed">
                    {item.question}
                  </h3>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Response</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {item.answer || 'No response recorded'}
                    </p>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300">Strengths</h4>
                    </div>
                    {item.strengths.length === 0 ? (
                      <p className="text-green-600 dark:text-green-400 text-sm">No specific strengths identified</p>
                    ) : (
                      <ul className="space-y-2">
                        {item.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                              {strength}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Improvements */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-300">Areas for Improvement</h4>
                    </div>
                    {item.suggestions.length === 0 ? (
                      <p className="text-orange-600 dark:text-orange-400 text-sm">No specific improvements suggested</p>
                    ) : (
                      <ul className="space-y-2">
                        {item.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">
                              {suggestion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Separator */}
                {idx < qa.length - 1 && (
                  <div className="mt-8 border-b border-slate-200 dark:border-slate-700"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

