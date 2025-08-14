import { useState, useCallback } from 'react'

interface InterviewSession {
  sessionId: string | null
  isLoading: boolean
  error: string | null
}

export function useInterviewSession() {
  const [session, setSession] = useState<InterviewSession>({
    sessionId: null,
    isLoading: false,
    error: null
  })

  const startSession = useCallback(async (type: string, category: string, totalQuestions: number = 5) => {
    setSession(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, category, totalQuestions })
      })

      if (!response.ok) {
        throw new Error('Failed to start session')
      }

      const data = await response.json()
      setSession({
        sessionId: data.sessionId,
        isLoading: false,
        error: null
      })

      return data.sessionId
    } catch (error) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
      throw error
    }
  }, [])

  const endSession = useCallback(async (sessionId: string, duration: number) => {
    try {
      await fetch('/api/interview/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          status: 'completed',
          duration 
        })
      })

      setSession({
        sessionId: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }, [])

  const analyzeResponse = useCallback(async (
    question: string, 
    answer: string, 
    category: string,
    sessionId?: string
  ) => {
    try {
      const response = await fetch('/api/interview/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, category, sessionId })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze response')
      }

      const data = await response.json()
      return data.feedback
    } catch (error) {
      console.error('Error analyzing response:', error)
      throw error
    }
  }, [])

  const generateQuestions = useCallback(async (
    category: string,
    difficulty: string,
    count: number = 5
  ) => {
    try {
      const response = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, count })
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      return data.questions
    } catch (error) {
      console.error('Error generating questions:', error)
      throw error
    }
  }, [])

  return {
    session,
    startSession,
    endSession,
    analyzeResponse,
    generateQuestions
  }
}