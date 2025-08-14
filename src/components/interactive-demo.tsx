"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Brain,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"

const demoSteps = [
  {
    id: 1,
    title: "Choose Interview Type",
    description: "Select from technical, behavioral, or mixed interviews",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "AI Asks Questions",
    description: "Our AI interviewer asks realistic, role-specific questions",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "You Respond",
    description: "Answer using voice or text - just like a real interview",
    icon: Mic,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Get Instant Feedback",
    description: "Receive detailed analysis and improvement suggestions",
    icon: BarChart3,
    color: "from-orange-500 to-red-500"
  }
]

const mockQuestions = [
  "Tell me about yourself and your background.",
  "What interests you most about this role?",
  "Describe a challenging project you've worked on.",
  "How do you handle working under pressure?"
]

export function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      // Simulate demo progression
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false)
            setShowFeedback(true)
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 2000)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setShowFeedback(false)
    setCurrentQuestion(0)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        {/* Floating particles */}
        <div className="particles absolute inset-0"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            See PrepMate in
            <span className="block gradient-text">Action</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Experience our AI-powered interview platform with this interactive demo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Mock Interview Screen */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white/60 text-sm font-mono">PrepMate Interview</div>
                </div>

                {/* AI Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    animate={{ 
                      scale: isPlaying ? [1, 1.1, 1] : 1,
                      rotate: isPlaying ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">AI Interviewer</h3>
                    <p className="text-blue-200 text-sm">Ready to begin your practice session</p>
                  </div>
                </div>

                {/* Question Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/5 rounded-xl p-6 mb-6"
                  >
                    <p className="text-white text-lg leading-relaxed">
                      {mockQuestions[currentQuestion]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handlePlayDemo}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? 'Pause' : 'Start Demo'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsMuted(!isMuted)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={resetDemo}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Panel */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-green-400/20 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <h3 className="text-white font-semibold text-lg">AI Feedback</h3>
                      </div>
                      <div className="space-y-3 text-white/80">
                        <p>✅ Great structure in your response</p>
                        <p>✅ Good use of specific examples</p>
                        <p>⚡ Consider adding more quantifiable results</p>
                        <p>📈 Confidence level: 85%</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ 
                  opacity: currentStep >= index ? 1 : 0.5,
                  scale: currentStep === index ? 1.05 : 0.95
                }}
                transition={{ duration: 0.3 }}
                className={`relative ${currentStep >= index ? 'z-10' : 'z-0'}`}
              >
                <Card className={`border-0 shadow-xl transition-all duration-500 ${
                  currentStep >= index 
                    ? 'bg-white/15 backdrop-blur-xl border border-white/30' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/10'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ 
                          scale: currentStep === index ? [1, 1.2, 1] : 1,
                          rotate: currentStep === index ? [0, 360] : 0
                        }}
                        transition={{ duration: 1 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${step.color} p-3 shadow-lg`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                        <p className="text-blue-100">{step.description}</p>
                      </div>
                      {currentStep >= index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400"
                        >
                          <CheckCircle className="w-6 h-6" />
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connection line */}
                {index < demoSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <motion.div
                      animate={{ 
                        opacity: currentStep > index ? 1 : 0.3,
                        scale: currentStep > index ? 1 : 0.8
                      }}
                      className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
                    ></motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link href="/auth/signup" className="inline-block">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Try Full Demo Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}