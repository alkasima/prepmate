import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock session data for demo purposes
    // In production, this would fetch from your database
    const mockSession = {
      id: resolvedParams.id,
      type: 'MOCK',
      category: 'MIXED',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      duration: 25,
      score: 8.2,
      questionsAnswered: 5,
      totalQuestions: 5,
      questions: [
        {
          id: '1',
          question: 'Tell me about yourself and your background.',
          answer: 'I am a software engineer with 5 years of experience in full-stack development. I have worked with technologies like React, Node.js, and Python. I am passionate about creating user-friendly applications and solving complex problems.',
          score: 8.5,
          feedback: JSON.stringify({
            strengths: ['Clear communication', 'Relevant experience mentioned', 'Good structure'],
            suggestions: ['Add more specific examples', 'Mention quantifiable achievements'],
            confidence: 85,
            clarity: 90,
            relevance: 88
          }),
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          question: 'Describe a challenging project you worked on recently.',
          answer: 'I recently worked on a microservices architecture migration project. We had to break down a monolithic application into smaller services while maintaining zero downtime. I led the backend team and implemented proper API versioning and database migration strategies.',
          score: 9.0,
          feedback: JSON.stringify({
            strengths: ['Specific technical details', 'Leadership experience', 'Problem-solving approach'],
            suggestions: ['Mention the business impact', 'Add metrics about the success'],
            confidence: 90,
            clarity: 92,
            relevance: 95
          }),
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          question: 'How do you handle tight deadlines and pressure?',
          answer: 'I prioritize tasks based on impact and urgency. I break down large tasks into smaller manageable pieces and communicate regularly with stakeholders about progress. I also make sure to maintain code quality even under pressure by using automated testing.',
          score: 7.8,
          feedback: JSON.stringify({
            strengths: ['Good prioritization strategy', 'Mentions communication', 'Quality focus'],
            suggestions: ['Provide a specific example', 'Mention stress management techniques'],
            confidence: 80,
            clarity: 85,
            relevance: 82
          }),
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          question: 'What are your greatest strengths as a developer?',
          answer: 'My greatest strengths are problem-solving and continuous learning. I enjoy debugging complex issues and finding efficient solutions. I also stay updated with the latest technologies and best practices through online courses and tech communities.',
          score: 8.0,
          feedback: JSON.stringify({
            strengths: ['Self-awareness', 'Growth mindset', 'Technical curiosity'],
            suggestions: ['Give concrete examples', 'Mention how these strengths benefit the team'],
            confidence: 82,
            clarity: 88,
            relevance: 85
          }),
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          question: 'Why are you interested in this position?',
          answer: 'I am excited about this position because it combines my passion for full-stack development with the opportunity to work on scalable systems. The company\'s focus on innovation and the collaborative team environment align perfectly with my career goals.',
          score: 7.5,
          feedback: JSON.stringify({
            strengths: ['Shows genuine interest', 'Mentions company research', 'Aligns with career goals'],
            suggestions: ['Be more specific about the role', 'Mention what you can contribute'],
            confidence: 78,
            clarity: 80,
            relevance: 85
          }),
          createdAt: new Date().toISOString()
        }
      ]
    }

    return NextResponse.json(mockSession)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}