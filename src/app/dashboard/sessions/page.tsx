"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Calendar,
  Clock,
  Star,
  Mic,
  MessageSquare,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  Play,
  BarChart3,
  Award,
  Target,
  Brain,
  Volume2,
  FileText,
  ChevronRight,
  RefreshCw,
  Trash2
} from "lucide-react"

interface Session {
  id: string
  date: string
  time: string
  type: "voice" | "text" | "mock"
  category: "technical" | "behavioral" | "general" | "mixed"
  duration: string
  score: number
  questionsAnswered: number
  totalQuestions: number
  status: "completed" | "in-progress" | "abandoned"
  improvement: string
  strengths: string[]
  weaknesses: string[]
  transcript?: string
  audioUrl?: string
}

const mockSessions: Session[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:30",
    type: "voice",
    category: "technical",
    duration: "25 min",
    score: 9.2,
    questionsAnswered: 5,
    totalQuestions: 5,
    status: "completed",
    improvement: "+0.3",
    strengths: ["Clear articulation", "Technical depth", "Problem-solving approach"],
    weaknesses: ["Could be more concise", "Add more examples"],
    transcript: "This is a sample transcript of the voice interview session...",
    audioUrl: "#"
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "10:15",
    type: "text",
    category: "behavioral",
    duration: "18 min",
    score: 8.7,
    questionsAnswered: 4,
    totalQuestions: 4,
    status: "completed",
    improvement: "+0.1",
    strengths: ["Good structure", "Relevant examples", "Professional tone"],
    weaknesses: ["More specific metrics needed", "Expand on outcomes"]
  },
  {
    id: "3",
    date: "2024-01-13",
    time: "16:45",
    type: "mock",
    category: "mixed",
    duration: "35 min",
    score: 8.9,
    questionsAnswered: 8,
    totalQuestions: 10,
    status: "completed",
    improvement: "+0.5",
    strengths: ["Comprehensive answers", "Good pace", "Confident delivery"],
    weaknesses: ["Time management", "Some questions incomplete"]
  },
  {
    id: "4",
    date: "2024-01-12",
    time: "09:30",
    type: "voice",
    category: "general",
    duration: "12 min",
    score: 7.8,
    questionsAnswered: 2,
    totalQuestions: 5,
    status: "abandoned",
    improvement: "-0.2",
    strengths: ["Good start", "Clear voice"],
    weaknesses: ["Session incomplete", "Need to finish practice"]
  },
  {
    id: "5",
    date: "2024-01-11",
    time: "11:20",
    type: "text",
    category: "technical",
    duration: "22 min",
    score: 8.4,
    questionsAnswered: 6,
    totalQuestions: 6,
    status: "completed",
    improvement: "+0.2",
    strengths: ["Technical accuracy", "Well structured", "Good examples"],
    weaknesses: ["Could be more detailed", "Add more context"]
  }
]

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showDetails, setShowDetails] = useState(false)

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || session.type === filterType
    const matchesCategory = filterCategory === "all" || session.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "voice": return Mic
      case "text": return MessageSquare
      case "mock": return BookOpen
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "voice": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
      case "text": return "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
      case "mock": return "text-green-600 bg-green-100 dark:bg-green-900/30"
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-900/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 dark:bg-green-900/30"
      case "in-progress": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
      case "abandoned": return "text-red-600 bg-red-100 dark:bg-red-900/30"
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-900/30"
    }
  }

  const viewSessionDetails = (session: Session) => {
    setSelectedSession(session)
    setShowDetails(true)
  }

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const exportSession = (session: Session) => {
    // Create a simple text report
    const report = `
Interview Session Report
========================
Date: ${session.date} at ${session.time}
Type: ${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Interview
Category: ${session.category.charAt(0).toUpperCase() + session.category.slice(1)}
Duration: ${session.duration}
Score: ${session.score}/10
Questions: ${session.questionsAnswered}/${session.totalQuestions}
Status: ${session.status}

Strengths:
${session.strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${session.weaknesses.map(w => `- ${w}`).join('\n')}

${session.transcript ? `Transcript:\n${session.transcript}` : ''}
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `interview-session-${session.date}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Session Details Modal */}
      {showDetails && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Session Details
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedSession.date} at {selectedSession.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportSession(selectedSession)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Session Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedSession.score}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Overall Score</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedSession.questionsAnswered}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Questions Answered</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedSession.duration}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Duration</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-slate-50 dark:bg-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedSession.improvement}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Improvement</div>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Award className="w-5 h-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedSession.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                      <Target className="w-5 h-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedSession.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="text-slate-700 dark:text-slate-300">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Transcript/Audio */}
              {selectedSession.transcript && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Session Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedSession.transcript}
                      </p>
                    </div>
                    {selectedSession.audioUrl && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Play Audio Recording
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
              Interview Sessions
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review your interview history and track your progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="voice">Voice</option>
              <option value="text">Text</option>
              <option value="mock">Mock</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="general">General</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </motion.div>

        {/* Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredSessions.map((session, index) => {
            const TypeIcon = getTypeIcon(session.type)
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(session.type)}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                              {session.type} Interview
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{session.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{session.duration}</span>
                            </div>
                            <span className="capitalize">{session.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
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
                          <div className="flex items-center gap-1">
                            {session.improvement.startsWith('+') ? (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-xs ${
                              session.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {session.improvement}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewSessionDetails(session)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportSession(session)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <span>Questions Answered</span>
                        <span>{session.questionsAnswered}/{session.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(session.questionsAnswered / session.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filterType !== "all" || filterCategory !== "all" 
                ? "Try adjusting your search or filters"
                : "Start your first interview practice session to see it here"
              }
            </p>
          </motion.div>
        )}
      </DashboardLayout>
    </>
  )
}