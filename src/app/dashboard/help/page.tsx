"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Mic,
  BookOpen,
  BarChart3,
  User,
  Settings,
  FileText,
  Zap,
  Shield,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb
} from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

const faqs: FAQ[] = [
  // Getting Started
  {
    id: "getting-started-1",
    question: "How do I get started with PrepMate?",
    answer: "Getting started is easy! First, create your account and complete your profile with your current role, experience, and target position. Then choose from our three practice modes: Voice Interview for real-time speech practice, Text Interview for written responses, or Mock Interview for full simulation. We recommend starting with a few practice sessions to get familiar with the platform.",
    category: "Getting Started",
    tags: ["setup", "beginner", "first-time"]
  },
  {
    id: "getting-started-2",
    question: "What's the difference between Voice, Text, and Mock interviews?",
    answer: "Voice Interview uses real-time speech recognition to practice your verbal communication skills and provides feedback on tone and confidence. Text Interview focuses on written responses with grammar and clarity analysis. Mock Interview is a complete simulation with role-specific questions, timed responses, and comprehensive performance reports - perfect for final preparation.",
    category: "Getting Started",
    tags: ["interview-types", "voice", "text", "mock"]
  },
  {
    id: "getting-started-3",
    question: "Do I need any special equipment to use PrepMate?",
    answer: "For most features, you just need a computer or mobile device with internet access. For Voice Interviews, you'll need a microphone (built-in or external). We recommend using headphones for better audio quality during voice practice sessions.",
    category: "Getting Started",
    tags: ["equipment", "microphone", "requirements"]
  },

  // Practice Sessions
  {
    id: "practice-1",
    question: "How does the AI feedback system work?",
    answer: "Our AI uses Google's Gemini AI to analyze your responses across multiple dimensions: content relevance, communication clarity, structure, specific examples, and technical accuracy. It provides personalized feedback based on your profile, experience level, and target role, giving you actionable suggestions for improvement.",
    category: "Practice Sessions",
    tags: ["ai", "feedback", "analysis", "scoring"]
  },
  {
    id: "practice-2",
    question: "Can I practice for specific job roles or companies?",
    answer: "Yes! Update your profile with your target role and industry, and our AI will tailor questions and feedback accordingly. While we don't have company-specific questions, you can practice with technical, behavioral, or general categories that match your target position's requirements.",
    category: "Practice Sessions",
    tags: ["customization", "job-roles", "targeting"]
  },
  {
    id: "practice-3",
    question: "How accurate is the speech-to-text transcription?",
    answer: "We use advanced speech recognition technology that works well with clear speech. For best results, speak clearly, use a good microphone, and practice in a quiet environment. If transcription isn't working well, you can always switch to text mode for the same questions.",
    category: "Practice Sessions",
    tags: ["speech-recognition", "transcription", "voice"]
  },
  {
    id: "practice-4",
    question: "How long should my answers be?",
    answer: "For behavioral questions, aim for 1-2 minutes (150-300 words) using the STAR method. Technical questions can vary - brief explanations for concepts, longer for system design. Our AI provides feedback if your answers are too short or too long for the question type.",
    category: "Practice Sessions",
    tags: ["answer-length", "timing", "best-practices"]
  },

  // Technical Issues
  {
    id: "technical-1",
    question: "My microphone isn't working. What should I do?",
    answer: "First, check your browser permissions - click the microphone icon in your address bar and allow access. Ensure your microphone is connected and working in other applications. Try refreshing the page or switching browsers. Chrome and Edge typically have the best compatibility with our voice features.",
    category: "Technical Issues",
    tags: ["microphone", "permissions", "browser", "troubleshooting"]
  },
  {
    id: "technical-2",
    question: "Why is my session not saving?",
    answer: "Sessions are automatically saved when you complete them. If you're experiencing issues, check your internet connection and try refreshing the page. Your progress is saved locally, so you won't lose your work. Contact support if the problem persists.",
    category: "Technical Issues",
    tags: ["saving", "sessions", "data-loss", "connectivity"]
  },
  {
    id: "technical-3",
    question: "The application is running slowly. How can I improve performance?",
    answer: "Close other browser tabs and applications to free up memory. Ensure you have a stable internet connection. Clear your browser cache and cookies. We recommend using Chrome or Edge for the best performance. If issues persist, try using the application during off-peak hours.",
    category: "Technical Issues",
    tags: ["performance", "speed", "optimization", "browser"]
  },

  // Account & Profile
  {
    id: "account-1",
    question: "How do I update my profile information?",
    answer: "Go to the Profile section in your dashboard. Click 'Edit Profile' to modify your personal information, professional details, education, and social links. Don't forget to click 'Save Changes' when you're done. Your updated information helps our AI provide more personalized feedback.",
    category: "Account & Profile",
    tags: ["profile", "editing", "personal-info", "customization"]
  },
  {
    id: "account-2",
    question: "Can I change my target role after setting up my profile?",
    answer: "Absolutely! Your career goals can evolve, and so can your profile. Simply go to the Profile section, click Edit, and update your target role in the Professional tab. This will help tailor future interview questions and feedback to your new goals.",
    category: "Account & Profile",
    tags: ["target-role", "career-change", "profile-update"]
  },
  {
    id: "account-3",
    question: "Is my personal information secure?",
    answer: "Yes, we take your privacy seriously. Your personal information is encrypted and stored securely. We don't share your data with third parties. Your interview responses are used only to provide you with personalized feedback and improve our AI models anonymously.",
    category: "Account & Profile",
    tags: ["privacy", "security", "data-protection"]
  },

  // Analytics & Progress
  {
    id: "analytics-1",
    question: "How do I track my progress over time?",
    answer: "Visit the Analytics section to see your performance trends, category breakdowns, and improvement metrics. You can view your scores over time, identify strengths and areas for improvement, and track your practice consistency. The more you practice, the more detailed insights you'll receive.",
    category: "Analytics & Progress",
    tags: ["progress", "analytics", "tracking", "improvement"]
  },
  {
    id: "analytics-2",
    question: "What do the different scores mean?",
    answer: "Scores are rated 1-10: 8-10 is excellent, 6-7 is good, 4-5 needs improvement, and below 4 requires significant work. We evaluate content relevance, clarity, structure, examples, and technical accuracy. Each category (Technical, Behavioral, General) may have different scoring criteria.",
    category: "Analytics & Progress",
    tags: ["scoring", "ratings", "evaluation", "metrics"]
  },
  {
    id: "analytics-3",
    question: "Why don't I see any analytics data?",
    answer: "Analytics data appears after you complete practice sessions. You need to finish at least a few sessions to see meaningful trends and insights. If you've completed sessions but don't see data, try refreshing the page or contact support.",
    category: "Analytics & Progress",
    tags: ["analytics", "data", "empty-state", "sessions"]
  },

  // Subscription & Billing
  {
    id: "billing-1",
    question: "What's included in the free version?",
    answer: "The free version includes limited practice sessions, basic feedback, and access to general interview questions. You can try all three interview modes with some restrictions on the number of sessions per month.",
    category: "Subscription & Billing",
    tags: ["free", "limitations", "trial", "features"]
  },
  {
    id: "billing-2",
    question: "What additional features do I get with Pro?",
    answer: "Pro members get unlimited practice sessions, detailed AI feedback, advanced analytics, priority support, and access to specialized question sets for different industries and roles. You also get export capabilities for your session reports.",
    category: "Subscription & Billing",
    tags: ["pro", "premium", "features", "unlimited"]
  },

  // Best Practices
  {
    id: "best-practices-1",
    question: "How often should I practice?",
    answer: "We recommend practicing 3-4 times per week for best results. Consistency is more important than intensity. Start with 15-20 minute sessions and gradually increase. Focus on different question types and categories to build well-rounded interview skills.",
    category: "Best Practices",
    tags: ["frequency", "consistency", "schedule", "improvement"]
  },
  {
    id: "best-practices-2",
    question: "What's the best way to prepare for a real interview?",
    answer: "Start with general questions to build confidence, then focus on your target role's specific requirements. Practice both technical and behavioral questions. Use the Mock Interview mode for final preparation. Review your feedback and work on identified weak areas. Practice your elevator pitch and common questions until they feel natural.",
    category: "Best Practices",
    tags: ["preparation", "strategy", "real-interview", "tips"]
  },
  {
    id: "best-practices-3",
    question: "How can I improve my interview confidence?",
    answer: "Regular practice is key! Start with easier questions and gradually increase difficulty. Record yourself (outside the app) to see your body language. Practice power poses before sessions. Focus on your achievements and prepare specific examples. Remember, the more you practice, the more confident you'll become.",
    category: "Best Practices",
    tags: ["confidence", "anxiety", "preparation", "mindset"]
  }
]

const categories = [
  "All",
  "Getting Started",
  "Practice Sessions", 
  "Technical Issues",
  "Account & Profile",
  "Analytics & Progress",
  "Subscription & Billing",
  "Best Practices"
]

const quickLinks = [
  {
    title: "Start Your First Practice",
    description: "Jump right into a practice session",
    href: "/dashboard/practice",
    icon: Zap,
    color: "text-blue-600"
  },
  {
    title: "Update Your Profile",
    description: "Personalize your experience",
    href: "/dashboard/profile", 
    icon: User,
    color: "text-green-600"
  },
  {
    title: "View Analytics",
    description: "Track your progress",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "text-purple-600"
  },
  {
    title: "Upload Resume",
    description: "Get personalized questions",
    href: "/dashboard/resume",
    icon: FileText,
    color: "text-orange-600"
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Help & Support
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions, learn best practices, and get the most out of PrepMate
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700 dark:text-slate-300">support@prepmate.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-slate-700 dark:text-slate-300">Live Chat (9 AM - 6 PM PST)</span>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search terms or browse different categories
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {faq.category}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {faq.question}
                            </h3>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {faq.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="mb-6 opacity-90">
                  Our support team is here to help you succeed. Get personalized assistance with your interview preparation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" className="bg-white text-blue-600 hover:bg-slate-50">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" className="bg-white text-blue-600 hover:bg-slate-50">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Help Center
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}