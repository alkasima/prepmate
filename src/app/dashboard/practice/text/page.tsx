"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  Brain,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  FileText,
  Zap,
  Target,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  text: string
  category: "technical" | "behavioral" | "general"
  difficulty: "easy" | "medium" | "hard"
  hints: string[]
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and why you're interested in this role.",
    category: "general",
    difficulty: "easy",
    hints: [
      "Start with your current role and experience",
      "Mention relevant skills and achievements",
      "Connect your background to the role"
    ]
  },
  {
    id: 2,
    text: "Describe a time when you had to work with a difficult team member. How did you handle the situation?",
    category: "behavioral",
    difficulty: "medium",
    hints: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your actions and communication",
      "Show what you learned from the experience"
    ]
  },
  {
    id: 3,
    text: "How would you approach debugging a performance issue in a web application?",
    category: "technical",
    difficulty: "hard",
    hints: [
      "Mention profiling tools and techniques",
      "Discuss systematic debugging approach",
      "Include monitoring and prevention strategies"
    ]
  }
]

export default function TextInterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionStarted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionStarted])

  const submitAnswer = async () => {
    if (!answer.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockFeedback = {
        score: Math.floor(Math.random() * 3) + 7, // 7-10 range
        wordCount: answer.split(' ').length,
        readabilityScore: 85,
        strengths: [
          "Clear structure and organization",
          "Good use of specific examples",
          "Professional tone throughout"
        ],
        improvements: [
          "Could provide more quantifiable results",
          "Consider adding more technical details",
          "Expand on lessons learned"
        ],
        keywordMatch: 78,
        sentiment: "Positive",
        grammarScore: 92
      }
      
      setFeedback(mockFeedback)
      setAnswers(prev => [...prev, answer])
      setIsAnalyzing(false)
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setAnswer("")
      setFeedback(null)
      setShowHints(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setAnswer("")
      setFeedback(null)
      setShowHints(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const question = sampleQuestions[currentQuestion]

  if (!sessionStarted) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Text Interview Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Practice with written responses and get detailed AI feedback
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Text Analysis</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Advanced NLP processing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Smart Feedback</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Grammar, structure & content analysis</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Progress Tracking</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detailed performance metrics</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Comprehensive grammar and readability analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Content structure and organization feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Keyword matching and relevance scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Personalized improvement suggestions
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Link href="/dashboard/practice">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Practice
                  </Button>
                </Link>
                <Button 
                  onClick={() => setSessionStarted(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Text Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Text Interview Session
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Session Time</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                {formatTime(timeSpent)}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        question.difficulty === 'easy' ? 'bg-green-500' :
                        question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <CardTitle className="text-lg">
                        {question.category.charAt(0).toUpperCase() + question.category.slice(1)} Question
                      </CardTitle>
                    </div>
                    <Button
                      onClick={() => setShowHints(!showHints)}
                      variant="outline"
                      size="sm"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      {showHints ? 'Hide' : 'Show'} Hints
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {question.text}
                  </p>
                  
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Hints:</h4>
                      <ul className="space-y-1">
                        {question.hints.map((hint, index) => (
                          <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Answer Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Your Answer
                  </CardTitle>
                  <CardDescription>
                    Take your time to craft a thoughtful response
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="answer" className="sr-only">Your answer</Label>
                      <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-40 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        disabled={isAnalyzing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {answer.split(' ').filter(word => word.length > 0).length} words
                      </div>
                      <Button
                        onClick={submitAnswer}
                        disabled={!answer.trim() || isAnalyzing}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {sampleQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentQuestion 
                        ? 'bg-purple-500' 
                        : index < currentQuestion 
                          ? 'bg-green-500' 
                          : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextQuestion}
                disabled={currentQuestion === sampleQuestions.length - 1}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Feedback Sidebar */}
          <div className="space-y-6">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {feedback.score}/10
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {feedback.wordCount}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Words</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {feedback.grammarScore}%
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Grammar</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Strengths:</h4>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-slate-600 dark:text-slate-400">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Improvements:</h4>
                      <ul className="space-y-1">
                        {feedback.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-3 h-3 text-yellow-500" />
                            <span className="text-slate-600 dark:text-slate-400">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Keyword Match</span>
                        <span className="text-sm font-medium">{feedback.keywordMatch}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${feedback.keywordMatch}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Session Progress */}
            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Questions</span>
                      <span className="font-medium">{currentQuestion + 1}/{sampleQuestions.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-purple-100">
                  <li>• Use specific examples and metrics</li>
                  <li>• Structure your answer clearly</li>
                  <li>• Keep responses concise but complete</li>
                  <li>• Proofread before submitting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}