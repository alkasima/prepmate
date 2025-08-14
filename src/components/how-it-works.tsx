"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  UserPlus, 
  Settings, 
  Play, 
  BarChart3, 
  ArrowRight,
  Upload,
  Mic,
  Brain
} from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and tell us about your target role, experience level, and industry preferences.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: "02", 
    title: "Upload Resume (Optional)",
    description: "Upload your resume to get personalized questions tailored to your background and experience.",
    icon: Upload,
    color: "from-purple-500 to-pink-500"
  },
  {
    step: "03",
    title: "Choose Interview Type",
    description: "Select from technical, behavioral, or mixed interviews. Choose voice or text-based practice.",
    icon: Settings,
    color: "from-green-500 to-emerald-500"
  },
  {
    step: "04",
    title: "Start Practice Session",
    description: "Begin your AI-powered mock interview with realistic questions and natural conversation flow.",
    icon: Play,
    color: "from-orange-500 to-red-500"
  },
  {
    step: "05",
    title: "Get Real-Time Feedback",
    description: "Receive instant analysis on your answers, tone, confidence, and areas for improvement.",
    icon: Brain,
    color: "from-indigo-500 to-purple-500"
  },
  {
    step: "06",
    title: "Track Your Progress",
    description: "Review detailed analytics, scores, and improvement suggestions to master your interview skills.",
    icon: BarChart3,
    color: "from-teal-500 to-blue-500"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white mb-3">
            How PrepMate
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Get interview-ready in 6 simple steps with our AI-powered platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 group-hover:scale-105">
                <CardContent className="p-8">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">
                      {step.step}
                    </span>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for connection (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <Mic className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h3 className="text-3xl font-bold mb-4">Experience the Future of Interview Prep</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                See how our AI technology provides personalized feedback and helps you improve with every practice session
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signup" className="inline-block">
                  <Button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-lg shadow-lg">
                    Try Interactive Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}