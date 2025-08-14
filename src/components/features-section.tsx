"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mic, 
  MessageSquare, 
  Brain, 
  BarChart3, 
  FileText, 
  Zap,
  Users,
  Shield,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Mic,
    title: "Voice-Based Practice",
    description: "Practice with realistic voice interactions using advanced speech recognition and natural language processing.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: MessageSquare,
    title: "Text-Based Sessions",
    description: "Flexible text-based interview practice for when you prefer typing or need silent practice sessions.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description: "Get intelligent analysis of your answers with personalized suggestions for improvement and confidence building.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics, scoring, and insights to identify areas for improvement.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: FileText,
    title: "Resume Integration",
    description: "Upload your resume to get tailored questions based on your experience and target role.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Instant feedback on your tone, confidence, clarity, and content relevance during practice sessions.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Role-Specific Practice",
    description: "Customized interview scenarios for different roles, industries, and experience levels.",
    gradient: "from-teal-500 to-blue-500"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is secure and private. Practice with confidence knowing your information is protected.",
    gradient: "from-slate-500 to-gray-500"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Practice anytime, anywhere. No scheduling needed - your AI interviewer is always ready.",
    gradient: "from-rose-500 to-pink-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive interview preparation tools powered by cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
              
              <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-800 group-hover:scale-105 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 shadow-lg group-hover:shadow-xl`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Decorative element */}
                  <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-full transition-all duration-500`}></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to ace your next interview?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of successful candidates who have improved their interview skills with PrepMate
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Your Free Trial
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}