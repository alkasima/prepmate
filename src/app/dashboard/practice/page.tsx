"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Mic, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Play,
  Clock,
  Users,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react"
import Link from "next/link"

const practiceTypes = [
  {
    title: "Voice Interview",
    description: "Practice with AI-powered voice interaction and real-time speech analysis",
    icon: Mic,
    href: "/dashboard/practice/voice",
    gradient: "from-blue-500 to-cyan-500",
    features: ["Real-time speech analysis", "Tone & confidence feedback", "Natural conversation flow"],
    duration: "15-30 min",
    difficulty: "Intermediate"
  },
  {
    title: "Text Interview",
    description: "Written practice sessions with instant feedback on your responses",
    icon: MessageSquare,
    href: "/dashboard/practice/text",
    gradient: "from-purple-500 to-pink-500",
    features: ["Instant text analysis", "Grammar & clarity check", "Response structure tips"],
    duration: "10-20 min",
    difficulty: "Beginner"
  },
  {
    title: "Mock Interview",
    description: "Full interview simulation with role-specific questions and scenarios",
    icon: BookOpen,
    href: "/dashboard/practice/mock",
    gradient: "from-green-500 to-emerald-500",
    features: ["Role-specific questions", "Complete interview flow", "Detailed performance report"],
    duration: "30-45 min",
    difficulty: "Advanced"
  }
]

const interviewStyles = [
  { name: "Technical", icon: Brain, description: "Coding, system design, problem-solving" },
  { name: "Behavioral", icon: Users, description: "Leadership, teamwork, past experiences" },
  { name: "Mixed", icon: Zap, description: "Combination of technical and behavioral" }
]

export default function PracticePage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Practice Sessions
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Choose your preferred practice mode and start improving your interview skills
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Customize Settings
          </Button>
        </div>
      </motion.div>

      {/* Practice Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
      >
        {practiceTypes.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${type.gradient}`} />
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {type.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{type.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{type.difficulty}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={type.href}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Interview Styles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Choose Interview Style
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviewStyles.map((style, index) => (
            <motion.div
              key={style.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <style.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{style.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{style.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-blue-100">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">8.5</div>
                <div className="text-blue-100">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.2h</div>
                <div className="text-blue-100">Total Practice Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Improvement Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}