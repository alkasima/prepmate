"use client"

import { useState, useEffect } from "react"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import {
  Play,
  BarChart3,
  Clock,
  Trophy,
  Mic,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  BookOpen,
  ArrowRight,
  Zap,
  Star,
  Users,
  Award
} from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/summary')
        if (!res.ok) throw new Error('Failed to load summary')
        const data = await res.json()
        setSummary(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = [
    {
      title: "Practice Sessions",
      value: summary?.stats?.sessionsCount ?? '-',
      change: '',
      icon: Play,
      color: "text-blue-600"
    },
    {
      title: "Average Score",
      value: summary?.stats?.averageScore ? `${(Math.round(summary.stats.averageScore * 10) / 10).toFixed(1)}/10` : '-/10',
      change: '',
      icon: BarChart3,
      color: "text-green-600"
    },
    {
      title: "Total Time",
      value: summary?.stats?.totalMinutes ? `${Math.round(summary.stats.totalMinutes / 60 * 10) / 10}h` : '0h',
      change: '',
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Achievements",
      value: summary?.stats?.achievements ?? 0,
      change: '',
      icon: Trophy,
      color: "text-yellow-600"
    }
  ]

  const recentSessions = (summary?.recentSessions ?? []).map((s: any) => ({
    type: `${s.type?.toLowerCase?.().charAt(0).toUpperCase()}${s.type?.toLowerCase?.().slice(1)} Interview`,
    mode: s.mode?.toLowerCase?.().charAt(0).toUpperCase() + s.mode?.toLowerCase?.().slice(1),
    score: s.score ?? 0,
    date: new Date(s.createdAt).toLocaleDateString(),
    duration: s.duration ? `${s.duration} min` : '—'
  }))

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Ready to continue your interview preparation journey?
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Streak</p>
              <p className="text-2xl font-bold text-orange-500">{summary?.stats?.streak ?? 0} days 🔥</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Voice Interview</h3>
                <p className="text-blue-100 mb-4">AI-powered voice practice</p>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <Mic className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Text Interview</h3>
                <p className="text-purple-100 mb-4">Written practice sessions</p>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <MessageSquare className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Mock Interview</h3>
                <p className="text-green-100 mb-4">Full interview simulation</p>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <BookOpen className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                    stat.title === "Practice Sessions" ? "from-blue-500 to-blue-600" :
                    stat.title === "Average Score" ? "from-green-500 to-green-600" :
                    stat.title === "Total Time" ? "from-purple-500 to-purple-600" :
                    "from-yellow-500 to-yellow-600"
                  } flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Sessions
              </CardTitle>
              <CardDescription>
                Your latest interview practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        session.mode === "Voice" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                      }`}>
                        {session.mode === "Voice" ? <Mic className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{session.type}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{session.mode} • {session.duration}</p>
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
                      <p className="text-sm text-slate-600 dark:text-slate-400">{session.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                <Calendar className="w-4 h-4 mr-2" />
                View All Sessions
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Goals Progress */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Practice Sessions</span>
                    <span className="text-sm font-medium">{summary?.stats?.sessionsThisWeek ?? 0}/{summary?.goals?.weeklyTarget ?? 5}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round(((summary?.stats?.sessionsThisWeek ?? 0) / (summary?.goals?.weeklyTarget ?? 5)) * 100))}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Score Target</span>
                    <span className="text-sm font-medium">{summary?.stats?.averageScore ? `${(Math.round(summary.stats.averageScore * 10) / 10).toFixed(1)}` : '-'} / {summary?.goals?.scoreTarget ?? 9.0}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round(((summary?.stats?.averageScore ?? 0) / (summary?.goals?.scoreTarget ?? 9.0)) * 100))}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(summary?.achievementsList ?? []).length === 0 && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">No achievements yet. Keep practicing!</p>
                )}
                {(summary?.achievementsList ?? []).map((a: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{a.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Practice
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}