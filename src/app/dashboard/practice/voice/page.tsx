"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square,
  Volume2,
  Settings,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Brain,
  Clock,
  Zap
} from "lucide-react"
import Link from "next/link"
import { isProUser, hasReachedLimit, getRemainingUsage, incrementUsage } from "@/lib/usage"
import { UpgradeModal } from "@/components/UpgradeModal"

interface Question {
  id: number
  text: string
  category: "technical" | "behavioral" | "general"
  difficulty: "easy" | "medium" | "hard"
  expectedDuration: number
}

// TODO: Replace with API-driven questions later
const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and your background in software development.",
    category: "general",
    difficulty: "easy",
    expectedDuration: 120
  },
  {
    id: 2,
    text: "Describe a challenging project you worked on and how you overcame the obstacles.",
    category: "behavioral",
    difficulty: "medium",
    expectedDuration: 180
  },
  {
    id: 3,
    text: "How would you design a scalable system to handle millions of users?",
    category: "technical",
    difficulty: "hard",
    expectedDuration: 300
  }
]

const DEFAULT_CATEGORY = 'GENERAL'
const DEFAULT_DIFFICULTY = 'INTERMEDIATE'
const DEFAULT_COUNT = 5

export default function VoiceInterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [questionSource, setQuestionSource] = useState<'AI' | 'Fallback'>('Fallback')
  const [sttError, setSttError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [remainingSessions, setRemainingSessions] = useState(0)

  // Playback of user's recorded audio
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Auto behaviors
  const [autoSpeakFeedback] = useState(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsPro(isProUser())
    setRemainingSessions(getRemainingUsage())
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
      const mediaRecorder = new MediaRecorder(stream, { mimeType: mime })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const mime = mediaRecorderRef.current?.mimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: mime })
        const url = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(url)
        // Do not autoplay user's recording; keep controls for manual playback.
        processAudioResponse(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setSttError(null)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const processAudioResponse = async (audioBlob: Blob) => {
    setIsAnalyzing(true)

    try {
      // Send audio to our STT API
      const arrayBuffer = await audioBlob.arrayBuffer()
      const res = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Audio-Mime': audioBlob.type || 'audio/webm',
        },
        body: arrayBuffer,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('STT error:', data)
        const msg = data?.error || 'Transcription failed'
        const detail = data?.detail ? `: ${data.detail}` : ''
        const hint = data?.hint ? `\nHint: ${data.hint}` : ''
        setSttError(`${msg}${detail}${hint}`)
        setIsAnalyzing(false)
        return
      }

      const { transcript } = await res.json()
      setAnswers(prev => [...prev, transcript])

      // Send transcript to analysis API (saves to DB, updates score)
      const analyze = await fetch('/api/interview/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestion]?.text,
          answer: transcript,
          category: DEFAULT_CATEGORY,
          sessionId,
        }),
      })

      const analyzeData = await analyze.json().catch(() => ({}))
      if (!analyze.ok) {
        console.error('Analyze error:', analyzeData)
        setSttError(analyzeData?.error || 'Analysis failed')
        setIsAnalyzing(false)
        return
      }

      setFeedback(analyzeData.feedback)
      // Auto-read feedback
      if (autoSpeakFeedback) {
        setTimeout(() => speakFeedback(), 300)
      }
    } catch (err: any) {
      console.error('processAudioResponse error:', err)
      setSttError(typeof err?.message === 'string' ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const playQuestion = () => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        // Fallback: just show playing state briefly
        setIsPlaying(true)
        setTimeout(() => setIsPlaying(false), 2000)
        return
      }
      if (!question?.text) return
      const utter = new SpeechSynthesisUtterance(question.text)
      utter.rate = 1
      utter.pitch = 1
      utter.onend = () => setIsPlaying(false)
      utter.onerror = () => setIsPlaying(false)
      setIsPlaying(true)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } catch (e) {
      console.error('TTS question error:', e)
      setIsPlaying(false)
    }
  }

  const buildFeedbackText = (): string => {
    if (!feedback) return ''
    const parts: string[] = []
    if (typeof feedback.score === 'number') parts.push(`Overall score ${feedback.score} out of 10.`)
    const s = (feedback.strengths ?? []) as string[]
    if (s.length) parts.push(`Strengths: ${s.join(', ')}.`)
    const imps = (feedback.suggestions ?? feedback.weaknesses ?? feedback.improvements ?? []) as string[]
    if (imps.length) parts.push(`Improvements: ${imps.join(', ')}.`)
    return parts.join(' ')
  }

  const speakFeedback = () => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      const text = buildFeedbackText()
      if (!text) return
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = 1
      utter.pitch = 1
      utter.onend = () => setIsSpeaking(false)
      utter.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } catch (e) {
      console.error('TTS feedback error:', e)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsPlaying(false)
  }

  const nextQuestion = () => {
    const total = questions.length || sampleQuestions.length
    if (currentQuestion < total - 1) {
      setCurrentQuestion(prev => prev + 1)
      setFeedback(null)
      setRecordingTime(0)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setFeedback(null)
      setRecordingTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const question = questions[currentQuestion]

  const startSession = async () => {
    // Check usage limit for free users
    if (!isPro && hasReachedLimit()) {
      setShowUpgradeModal(true)
      return
    }
    
    try {
      const res = await fetch('/api/interview/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'VOICE', category: DEFAULT_CATEGORY, totalQuestions: DEFAULT_COUNT })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Failed to start session:', data)
        alert(data?.error || 'Please sign in to start a session.')
        return
      }
      const { sessionId } = await res.json()
      if (!sessionId) {
        console.error('No sessionId returned from server')
        alert('Could not start session. Please try again.')
        return
      }
      setSessionId(sessionId)

      // Load questions from API
      const qRes = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: DEFAULT_CATEGORY, difficulty: DEFAULT_DIFFICULTY, count: DEFAULT_COUNT })
      })

      if (qRes.ok) {
        const data = await qRes.json().catch(() => ({}))
        const qTexts: string[] = Array.isArray(data?.questions) ? data.questions : []
        if (qTexts.length > 0) {
          const mapped: Question[] = qTexts.map((text, idx) => ({
            id: idx + 1,
            text,
            category: 'general',
            difficulty: 'medium',
            expectedDuration: 180,
          }))
          setQuestions(mapped)
          setQuestionSource('AI')
        } else {
          console.warn('Questions API returned empty; falling back to sample questions')
          setQuestions(sampleQuestions)
          setQuestionSource('Fallback')
        }
      } else {
        console.error('Failed to load questions from API')
        setQuestions(sampleQuestions)
        setQuestionSource('Fallback')
      }

      // Increment usage for free users
      if (!isPro) {
        incrementUsage()
        setRemainingSessions(getRemainingUsage())
      }

      setSessionStarted(true)
    } catch (e) {
      console.error('Error starting session:', e)
      alert('Could not start session. Please try again.')
    }
  }

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
              Voice Interview Practice
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Practice with AI-powered voice interaction and get real-time feedback
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Voice Recognition</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Advanced speech-to-text processing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Analysis</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Intelligent feedback on content & delivery</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-time Feedback</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Instant insights and improvements</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Session Overview:</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {sampleQuestions.length} carefully selected questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Real-time speech analysis and feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detailed performance report at the end
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Estimated duration: 15-20 minutes
                  </li>
                </ul>
              </div>

              {/* Usage Display for Free Users */}
              {!isPro && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">Free Plan</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {remainingSessions} sessions remaining
                      </p>
                    </div>
                    {remainingSessions === 0 && (
                      <Button 
                        onClick={() => setShowUpgradeModal(true)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <Link href="/dashboard/practice">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Practice
                  </Button>
                </Link>
                <Button
                  onClick={startSession}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Voice Interview
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
              Voice Interview Session
            </h1>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <p>
                Question {currentQuestion + 1} of {questions.length || sampleQuestions.length}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${questionSource === 'AI' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                {questionSource === 'AI' ? 'AI-generated' : 'Fallback' }
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Recording Time</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                {formatTime(recordingTime)}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
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
                      onClick={playQuestion}
                      disabled={isPlaying || !(typeof window !== 'undefined' && 'speechSynthesis' in window)}
                      variant="outline"
                      size="sm"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    {question.text}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Expected: {Math.floor(question.expectedDuration / 60)}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="capitalize">{question.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recording Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
                <CardContent className="p-8">
                  {sttError && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 text-sm">
                      {sttError}
                    </div>
                  )}
                  <div className="text-center">
                    <div className="mb-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isAnalyzing}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                            : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isAnalyzing ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : isRecording ? (
                          <Square className="w-8 h-8 text-white" />
                        ) : (
                          <Mic className="w-8 h-8 text-white" />
                        )}
                      </motion.button>
                    </div>
                    
                    <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      {isAnalyzing ? 'Analyzing your response...' :
                       isRecording ? 'Recording your answer' : 'Click to start recording'}
                    </p>

                    {/* Recorded audio playback */}
                    {recordedAudioUrl && (
                      <div className="mb-3">
                        <audio ref={audioRef} controls src={recordedAudioUrl} className="w-full" />
                      </div>
                    )}

                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2 text-red-500"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                      </motion.div>
                    )}
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
                {(questions.length ? questions : sampleQuestions).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentQuestion 
                        ? 'bg-blue-500' 
                        : index < currentQuestion 
                          ? 'bg-green-500' 
                          : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextQuestion}
                disabled={currentQuestion === (questions.length ? questions.length : sampleQuestions.length) - 1}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
                      AI Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={speakFeedback}
                        disabled={!feedback || isSpeaking || !(typeof window !== 'undefined' && 'speechSynthesis' in window)}
                      >
                        <Volume2 className="w-4 h-4 mr-2" /> {isSpeaking ? 'Speaking...' : 'Listen to feedback'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={stopSpeaking} disabled={!isSpeaking && !isPlaying}>
                        <Square className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {typeof feedback?.score === 'number' ? `${Math.min(10, Math.max(1, Math.round(feedback.score)))}/10` : '-'}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                    </div>
                    {feedback?.error && (
                      <div className="rounded-md border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 text-sm">
                        {feedback.error}
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Strengths:</h4>
                      <ul className="space-y-1">
                        {(feedback?.strengths ?? []).map((strength: string, index: number) => (
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
                        {(feedback?.suggestions ?? feedback?.weaknesses ?? feedback?.improvements ?? []).map((item: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-3 h-3 text-yellow-500" />
                            <span className="text-slate-600 dark:text-slate-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {feedback.confidence}%
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {feedback.fillerWords}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Filler Words</div>
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
                      <span className="font-medium">{currentQuestion + 1}/{questions.length || sampleQuestions.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / (questions.length || sampleQuestions.length)) * 100}%` }}
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
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </DashboardLayout>
  )
}