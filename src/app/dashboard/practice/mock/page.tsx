"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard/layout"
import { UpgradeModal } from "@/components/UpgradeModal"
import { Mic, Square, Clock, Play, Pause, RotateCcw, ArrowLeft, AlertTriangle } from "lucide-react"
import { isProUser, hasReachedLimit, getRemainingUsage, incrementUsage } from "@/lib/usage"

// Types
type Category = "TECHNICAL" | "BEHAVIORAL" | "GENERAL" | "MIXED"
type Difficulty = "beginner" | "intermediate" | "advanced"

interface Question {
  id: number
  text: string
}

export default function MockInterviewPage() {
  // Config
  const [category, setCategory] = useState<Category>("MIXED")
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate")
  const [count, setCount] = useState(5)
  const [mode, setMode] = useState<"voice" | "text">("voice")

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCategory = urlParams.get('category')
    const urlType = urlParams.get('type')
    
    if (urlCategory) {
      setCategory(urlCategory.toUpperCase() as Category)
    }
    if (urlType === 'voice' || urlType === 'text') {
      setMode(urlType)
    }
  }, [])

  // Session state
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Answer state
  const [textAnswer, setTextAnswer] = useState("")
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  // Recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)

  // Duration & timers
  const sessionStartRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<"idle" | "prep" | "answer" | "review">("idle")
  const PREP_SECONDS = 30
  const ANSWER_SECONDS = 120
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS)
  const [answerLeft, setAnswerLeft] = useState(ANSWER_SECONDS)
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [pendingAutoSubmit, setPendingAutoSubmit] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [usageChecked, setUsageChecked] = useState(false)

  // Helpers
  const currentQuestion = questions[current]
  const isPro = isProUser()
  const remainingUsage = getRemainingUsage()

  const startSession = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check usage limits for free users
      if (!isPro && hasReachedLimit()) {
        setShowUpgradeModal(true)
        setLoading(false)
        return
      }

      // Increment usage for free users
      if (!isPro) {
        incrementUsage()
      }

      // 1) Create session (MOCK)
      const res = await fetch("/api/interview/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "MOCK", category, totalQuestions: count })
      })
      if (!res.ok) throw new Error("Failed to create session")
      const { sessionId } = await res.json()
      setSessionId(sessionId)
      sessionStartRef.current = Date.now()

      // 2) Load questions
      const qRes = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.toLowerCase(), difficulty, count })
      })
      if (!qRes.ok) throw new Error("Failed to load questions")
      const data = await qRes.json()
      const qTexts: string[] = Array.isArray(data?.questions) ? data.questions : []
      const mapped: Question[] = (qTexts.length ? qTexts : [
        "Tell me about yourself.",
        "Describe a challenging project.",
        "How do you handle tight deadlines?",
        "Explain a technical concept you like.",
        "What motivates you?",
      ]).slice(0, count).map((text: string, i: number) => ({ id: i + 1, text }))
      setQuestions(mapped)
      // Start prep phase for first question
      setPhase("prep")
      setPrepLeft(PREP_SECONDS)
      if (prepTimerRef.current) clearInterval(prepTimerRef.current)
      prepTimerRef.current = setInterval(() => {
        setPrepLeft(prev => {
          if (prev <= 1) {
            if (prepTimerRef.current) clearInterval(prepTimerRef.current)
            beginAnswerPhase()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (e: any) {
      setError(e?.message || "Could not start mock interview")
    } finally {
      setLoading(false)
    }
  }

  const endSession = async () => {
    if (!sessionId) return
    try {
      const minutes = sessionStartRef.current ? Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000)) : undefined
      await fetch("/api/interview/session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "COMPLETED", duration: minutes })
      })
    } catch {}
  }

  // Voice recording
  const beginAnswerPhase = async () => {
    setPhase("answer")
    setAnswerLeft(ANSWER_SECONDS)
    if (answerTimerRef.current) clearInterval(answerTimerRef.current)
    answerTimerRef.current = setInterval(() => {
      setAnswerLeft(prev => {
        if (prev <= 1) {
          if (answerTimerRef.current) clearInterval(answerTimerRef.current)
          // Auto-finish
          if (mode === 'voice' && isRecording) stopRecording()
          if (mode === 'text') setPendingAutoSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    if (mode === "voice") await startRecording()
  }

  const startRecording = async () => {
    try {
      setError(null)
      setTranscript("") // Clear previous transcript
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm"
      const rec = new MediaRecorder(stream, { mimeType: mime })
      mediaRecorderRef.current = rec
      audioChunksRef.current = []

      // Start real-time transcription if available
      let recognition: any = null
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        let finalTranscript = ''
        
        recognition.onresult = (event: any) => {
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }
          
          // Update transcript in real-time
          setTranscript((finalTranscript + interimTranscript).trim())
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error !== 'no-speech') {
            setError(`Speech recognition error: ${event.error}`)
          }
        }
        
        recognition.start()
      }

      rec.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      rec.onstop = async () => {
        // Stop speech recognition
        if (recognition) {
          recognition.stop()
        }
        
        const blob = new Blob(audioChunksRef.current, { type: rec.mimeType || "audio/webm" })
        const url = URL.createObjectURL(blob)
        setRecordedUrl(url)
        
        // If we don't have a transcript from real-time recognition, try server transcription
        if (!transcript.trim()) {
          await transcribe(blob)
        }
        
        if (pendingAutoSubmit) {
          setPendingAutoSubmit(false)
          await submitAnswer()
        }
      }

      rec.start()
      setIsRecording(true)
    } catch (e: any) {
      setError(e?.message || "Microphone access denied")
    }
  }

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop()
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop())
    } finally {
      setIsRecording(false)
    }
  }

  const transcribe = async (blob: Blob) => {
    try {
      setSubmitting(true)
      
      // Try browser Web Speech API first (real-time transcription)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          // Create audio URL for playback during recognition
          const audioUrl = URL.createObjectURL(blob)
          const audio = new Audio(audioUrl)
          
          // Use Web Speech API for real transcription
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          const recognition = new SpeechRecognition()
          
          recognition.continuous = true
          recognition.interimResults = false
          recognition.lang = 'en-US'
          
          const transcriptionPromise = new Promise<string>((resolve, reject) => {
            let finalTranscript = ''
            
            recognition.onresult = (event: any) => {
              for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript + ' '
                }
              }
            }
            
            recognition.onend = () => {
              resolve(finalTranscript.trim())
            }
            
            recognition.onerror = (event: any) => {
              reject(new Error(`Speech recognition error: ${event.error}`))
            }
            
            // Play audio and start recognition
            audio.play()
            recognition.start()
            
            // Stop recognition when audio ends
            audio.onended = () => {
              setTimeout(() => recognition.stop(), 500)
            }
          })
          
          const transcript = await transcriptionPromise
          URL.revokeObjectURL(audioUrl)
          
          if (transcript.trim()) {
            setTranscript(transcript.trim())
            return
          }
        } catch (speechError) {
          console.error('Web Speech API error:', speechError)
          // Fall through to server-side transcription
        }
      }
      
      // Fallback to server-side transcription
      const buf = await blob.arrayBuffer()
      const res = await fetch("/api/stt", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream", "X-Audio-Mime": blob.type || "audio/webm" },
        body: buf
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Transcription failed")
      
      if (data.source === 'fallback') {
        setError("Real transcription not available. Please add OPENAI_API_KEY to enable actual speech-to-text.")
      }
      
      setTranscript(data.transcript || "")
    } catch (e: any) {
      setError(e?.message || "Transcription failed")
    } finally {
      setSubmitting(false)
    }
  }

  const submitAnswer = async () => {
    if (!currentQuestion) return
    try {
      setSubmitting(true)
      setFeedback(null)
      const answer = mode === "voice" ? transcript : textAnswer
      if (!answer || answer.trim().length === 0) {
        setError("Please provide an answer before submitting")
        setSubmitting(false)
        return
      }

      const res = await fetch("/api/interview/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer,
          category: category.toLowerCase(),
          sessionId: sessionId || undefined
        })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to analyze answer")
      setFeedback(data.feedback)
    } catch (e: any) {
      setError(e?.message || "Failed to analyze answer")
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current)
    if (answerTimerRef.current) clearInterval(answerTimerRef.current)
    setFeedback(null)
    setTranscript("")
    setTextAnswer("")
    setRecordedUrl(null)
    setPhase("prep")
    setPrepLeft(PREP_SECONDS)
    setCurrent((i) => {
      const next = Math.min(i + 1, (questions.length || 1) - 1)
      // Start next prep timer
      if (next !== i) {
        if (prepTimerRef.current) clearInterval(prepTimerRef.current)
        prepTimerRef.current = setInterval(() => {
          setPrepLeft(prev => {
            if (prev <= 1) {
              if (prepTimerRef.current) clearInterval(prepTimerRef.current)
              beginAnswerPhase()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
      return next
    })
  }

  const isLast = current >= (questions.length || 1) - 1

  useEffect(() => {
    // Auto-submit for text when timer ends
    if (pendingAutoSubmit && phase === 'answer' && mode === 'text') {
      submitAnswer()
      setPendingAutoSubmit(false)
    }
  }, [pendingAutoSubmit, phase, mode])

  useEffect(() => {
    return () => {
      // Cleanup tracks & timers
      try { mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop()) } catch {}
      if (prepTimerRef.current) clearInterval(prepTimerRef.current)
      if (answerTimerRef.current) clearInterval(answerTimerRef.current)
    }
  }, [])

  return (
    <>
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/practice"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mock Interview</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Full interview simulation with AI-powered feedback
              </p>
            </div>
          </div>
          {sessionId && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">Session Progress</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {current + 1} of {questions.length}
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${((current + 1) / questions.length) * 100}, 100`}
                    className="text-blue-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {Math.round(((current + 1) / questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {!sessionId ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Interview Setup
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Configure your mock interview session preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Interview Category
                  </label>
                  <select 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    <option value="TECHNICAL">Technical Questions</option>
                    <option value="BEHAVIORAL">Behavioral Questions</option>
                    <option value="GENERAL">General Questions</option>
                    <option value="MIXED">Mixed Questions</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Difficulty Level
                  </label>
                  <select 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Number of Questions
                  </label>
                  <input 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    type="number" 
                    min={1} 
                    max={10} 
                    value={count} 
                    onChange={(e) => setCount(Number(e.target.value))} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Response Mode
                  </label>
                  <select 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value as any)}
                  >
                    <option value="voice">Voice Recording</option>
                    <option value="text">Text Input</option>
                  </select>
                </div>
              </div>
              
              {/* Usage Warning for Free Users */}
              {!isPro && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        Free Plan: {remainingUsage} sessions remaining
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Upgrade to Pro for unlimited practice sessions
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  onClick={startSession} 
                  disabled={loading || (!isPro && hasReachedLimit())} 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Starting Interview...</span>
                    </div>
                  ) : (!isPro && hasReachedLimit()) ? (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Upgrade to Continue</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Start Mock Interview</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Question {current + 1} of {questions.length}
                </CardTitle>
                {phase !== "idle" && (
                  <div className="flex items-center space-x-4">
                    {phase === "prep" && (
                      <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-sm">Prep: {prepLeft}s</span>
                      </div>
                    )}
                    {phase === "answer" && (
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-sm">Answer: {answerLeft}s</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                </motion.div>
              )}
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-lg text-slate-900 dark:text-white font-medium leading-relaxed">
                  {currentQuestion?.text}
                </p>
              </div>

              {phase === "prep" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Preparation Time</span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                    Use this time to think about your answer. The recording will start automatically when prep time ends.
                  </p>
                </motion.div>
              )}

              {mode === "voice" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      onClick={isRecording ? stopRecording : startRecording} 
                      disabled={submitting || phase === "prep"}
                      className={`h-16 px-8 ${isRecording 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-5 h-5 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          {phase === "prep" ? "Recording will start automatically" : "Start Recording"}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 dark:text-red-300 font-medium">Recording in progress...</span>
                    </motion.div>
                  )}
                  
                  {recordedUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 dark:text-green-300 font-medium">Recording completed</span>
                        </div>
                        <audio controls className="w-full" src={recordedUrl} />
                      </div>
                    </motion.div>
                  )}
                  
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Transcript</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{transcript}</p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Answer
                  </label>
                  <Textarea 
                    value={textAnswer} 
                    onChange={(e) => setTextAnswer(e.target.value)} 
                    placeholder="Type your answer here..." 
                    rows={8}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                    {textAnswer.length} characters
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={submitAnswer} 
                    disabled={submitting || (!transcript && !textAnswer)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      "Submit Answer"
                    )}
                  </Button>
                  
                  {!isLast && (
                    <Button 
                      variant="outline" 
                      onClick={nextQuestion} 
                      disabled={submitting}
                      className="border-slate-300 dark:border-slate-600"
                    >
                      Skip Question
                    </Button>
                  )}
                </div>
                
                {isLast && (
                  <Button 
                    onClick={async()=>{await endSession(); router.push(`/dashboard/sessions/${sessionId}`)}} 
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Finish Interview
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!feedback && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Submit your answer to receive detailed AI feedback and scoring
                  </p>
                </div>
              )}
              
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {typeof feedback?.score === 'number' ? `${Math.min(10, Math.max(1, Math.round(feedback.score)))}/10` : '-'}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {(feedback?.strengths ?? []).map((s: string, i: number) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-green-200 dark:border-green-800">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {(feedback?.suggestions ?? feedback?.weaknesses ?? []).map((s: string, i: number) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </DashboardLayout>
    
    <UpgradeModal 
      isOpen={showUpgradeModal} 
      onClose={() => setShowUpgradeModal(false)}
      remainingUsage={remainingUsage}
    />
  </>
)
}

