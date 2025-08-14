"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Trophy,
  Award,
  Star,
  Crown,
  Zap,
  Target,
  Calendar,
  Clock,
  Mic,
  MessageSquare,
  BookOpen,
  Brain,
  TrendingUp,
  Users,
  Shield,
  Flame,
  Medal,
  Gift,
  Lock,
  CheckCircle,
  BarChart3,
  Sparkles,
  Rocket,
  Diamond,
  Heart,
  Coffee
} from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: "practice" | "performance" | "streak" | "milestone" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  unlocked: boolean
  unlockedDate?: string
  progress?: {
    current: number
    target: number
  }
  requirements: string
}

const achievements: Achievement[] = [
  // Practice Achievements
  {
    id: "first_session",
    title: "Getting Started",
    description: "Complete your first interview practice session",
    icon: Rocket,
    category: "practice",
    rarity: "common",
    points: 10,
    unlocked: true,
    unlockedDate: "2024-01-10",
    requirements: "Complete 1 practice session"
  },
  {
    id: "voice_master",
    title: "Voice Master",
    description: "Complete 10 voice interview sessions",
    icon: Mic,
    category: "practice",
    rarity: "rare",
    points: 50,
    unlocked: true,
    unlockedDate: "2024-01-14",
    requirements: "Complete 10 voice interviews"
  },
  {
    id: "text_warrior",
    title: "Text Warrior",
    description: "Complete 15 text interview sessions",
    icon: MessageSquare,
    category: "practice",
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: { current: 8, target: 15 },
    requirements: "Complete 15 text interviews"
  },
  {
    id: "mock_champion",
    title: "Mock Champion",
    description: "Complete 5 full mock interview sessions",
    icon: BookOpen,
    category: "practice",
    rarity: "epic",
    points: 100,
    unlocked: false,
    progress: { current: 2, target: 5 },
    requirements: "Complete 5 mock interviews"
  },

  // Performance Achievements
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Achieve a perfect 10/10 score in any interview",
    icon: Star,
    category: "performance",
    rarity: "epic",
    points: 100,
    unlocked: true,
    unlockedDate: "2024-01-15",
    requirements: "Score 10/10 in any interview"
  },
  {
    id: "consistent_performer",
    title: "Consistent Performer",
    description: "Maintain an average score of 8.5+ over 10 sessions",
    icon: BarChart3,
    category: "performance",
    rarity: "rare",
    points: 75,
    unlocked: true,
    unlockedDate: "2024-01-13",
    requirements: "Average 8.5+ over 10 sessions"
  },
  {
    id: "improvement_king",
    title: "Improvement King",
    description: "Improve your score by 2+ points in a single session",
    icon: TrendingUp,
    category: "performance",
    rarity: "rare",
    points: 60,
    unlocked: false,
    progress: { current: 1.5, target: 2.0 },
    requirements: "Improve by 2+ points in one session"
  },
  {
    id: "technical_expert",
    title: "Technical Expert",
    description: "Score 9+ on 5 technical interviews",
    icon: Brain,
    category: "performance",
    rarity: "epic",
    points: 120,
    unlocked: false,
    progress: { current: 3, target: 5 },
    requirements: "Score 9+ on 5 technical interviews"
  },

  // Streak Achievements
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Practice for 7 consecutive days",
    icon: Flame,
    category: "streak",
    rarity: "common",
    points: 25,
    unlocked: true,
    unlockedDate: "2024-01-12",
    requirements: "7-day practice streak"
  },
  {
    id: "dedication_master",
    title: "Dedication Master",
    description: "Practice for 30 consecutive days",
    icon: Calendar,
    category: "streak",
    rarity: "legendary",
    points: 200,
    unlocked: false,
    progress: { current: 15, target: 30 },
    requirements: "30-day practice streak"
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Complete 5 sessions in a single day",
    icon: Zap,
    category: "streak",
    rarity: "rare",
    points: 80,
    unlocked: true,
    unlockedDate: "2024-01-11",
    requirements: "5 sessions in one day"
  },

  // Milestone Achievements
  {
    id: "century_club",
    title: "Century Club",
    description: "Complete 100 total practice sessions",
    icon: Trophy,
    category: "milestone",
    rarity: "legendary",
    points: 300,
    unlocked: false,
    progress: { current: 35, target: 100 },
    requirements: "Complete 100 sessions"
  },
  {
    id: "time_master",
    title: "Time Master",
    description: "Accumulate 50 hours of practice time",
    icon: Clock,
    category: "milestone",
    rarity: "epic",
    points: 150,
    unlocked: false,
    progress: { current: 14.2, target: 50 },
    requirements: "50 hours of practice"
  },
  {
    id: "question_crusher",
    title: "Question Crusher",
    description: "Answer 500 interview questions",
    icon: Target,
    category: "milestone",
    rarity: "epic",
    points: 180,
    unlocked: false,
    progress: { current: 156, target: 500 },
    requirements: "Answer 500 questions"
  },

  // Special Achievements
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete a session before 8 AM",
    icon: Coffee,
    category: "special",
    rarity: "common",
    points: 15,
    unlocked: false,
    requirements: "Practice before 8 AM"
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete a session after 10 PM",
    icon: Shield,
    category: "special",
    rarity: "common",
    points: 15,
    unlocked: true,
    unlockedDate: "2024-01-09",
    requirements: "Practice after 10 PM"
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    description: "Share your achievement on social media",
    icon: Users,
    category: "special",
    rarity: "rare",
    points: 40,
    unlocked: false,
    requirements: "Share achievement on social media"
  },
  {
    id: "diamond_member",
    title: "Diamond Member",
    description: "Reach the top 1% of all users",
    icon: Diamond,
    category: "special",
    rarity: "legendary",
    points: 500,
    unlocked: false,
    requirements: "Top 1% global ranking"
  }
]

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRarity, setSelectedRarity] = useState<string>("all")

  const categories = [
    { id: "all", name: "All", icon: Trophy },
    { id: "practice", name: "Practice", icon: Rocket },
    { id: "performance", name: "Performance", icon: Star },
    { id: "streak", name: "Streaks", icon: Flame },
    { id: "milestone", name: "Milestones", icon: Crown },
    { id: "special", name: "Special", icon: Gift }
  ]

  const rarities = [
    { id: "all", name: "All Rarities", color: "text-slate-600" },
    { id: "common", name: "Common", color: "text-gray-600" },
    { id: "rare", name: "Rare", color: "text-blue-600" },
    { id: "epic", name: "Epic", color: "text-purple-600" },
    { id: "legendary", name: "Legendary", color: "text-yellow-600" }
  ]

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === "all" || achievement.category === selectedCategory
    const matchesRarity = selectedRarity === "all" || achievement.rarity === selectedRarity
    return matchesCategory && matchesRarity
  })

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-400 bg-gray-50 dark:bg-gray-900/20"
      case "rare": return "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
      case "epic": return "border-purple-400 bg-purple-50 dark:bg-purple-900/20"
      case "legendary": return "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
      default: return "border-slate-400 bg-slate-50 dark:bg-slate-900/20"
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-600 dark:text-gray-400"
      case "rare": return "text-blue-600 dark:text-blue-400"
      case "epic": return "text-purple-600 dark:text-purple-400"
      case "legendary": return "text-yellow-600 dark:text-yellow-400"
      default: return "text-slate-600 dark:text-slate-400"
    }
  }

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
              Achievements
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your progress and unlock rewards as you improve your interview skills
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Points</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <div className="text-blue-100">Unlocked</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-green-100">Completion</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-yellow-100">Points</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">Gold</div>
            <div className="text-purple-100">Rank</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          {rarities.map((rarity) => (
            <option key={rarity.id} value={rarity.id}>
              {rarity.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAchievements.map((achievement, index) => {
          const Icon = achievement.icon
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className={`border-2 ${getRarityColor(achievement.rarity)} ${
                achievement.unlocked ? 'shadow-lg hover:shadow-xl' : 'opacity-75'
              } transition-all duration-300 relative overflow-hidden`}>
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                {!achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${getRarityTextColor(achievement.rarity)}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)} ${getRarityTextColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-blue-600">
                        {achievement.points} pts
                      </span>
                    </div>
                  </div>

                  {achievement.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress.current}/{achievement.progress.target}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress.current / achievement.progress.target) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="text-center">
                      <div className="text-xs text-green-600 font-medium">
                        Unlocked on {achievement.unlockedDate}
                      </div>
                    </div>
                  )}

                  {!achievement.unlocked && (
                    <div className="text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.requirements}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Upcoming Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Keep Going!</h3>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                You're making great progress! Complete more practice sessions to unlock new achievements and climb the leaderboard.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {achievements.filter(a => a.progress && a.progress.current / a.progress.target > 0.7).length}
                  </div>
                  <div className="text-indigo-200 text-sm">Almost There</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {achievements.filter(a => a.rarity === "legendary" && !a.unlocked).length}
                  </div>
                  <div className="text-indigo-200 text-sm">Legendary Left</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {achievements.filter(a => !a.unlocked).reduce((sum, a) => sum + a.points, 0)}
                  </div>
                  <div className="text-indigo-200 text-sm">Points Available</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}