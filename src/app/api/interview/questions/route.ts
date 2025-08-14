import { NextRequest, NextResponse } from "next/server"

const SAMPLE_QUESTIONS = {
  technical: [
    "Explain the difference between let, const, and var in JavaScript.",
    "How does React's virtual DOM work?",
    "What is the time complexity of binary search?",
    "Describe how you would implement a REST API.",
    "What are the principles of object-oriented programming?",
    "How do you handle asynchronous operations in JavaScript?",
    "Explain the concept of database normalization.",
    "What is the difference between SQL and NoSQL databases?",
    "How would you optimize a slow-performing web application?",
    "Describe the MVC architecture pattern."
  ],
  behavioral: [
    "Tell me about yourself.",
    "Describe a challenging project you worked on.",
    "How do you handle tight deadlines?",
    "Tell me about a time you had to work with a difficult team member.",
    "What motivates you in your work?",
    "Describe a situation where you had to learn something new quickly.",
    "How do you prioritize tasks when everything seems urgent?",
    "Tell me about a mistake you made and how you handled it.",
    "What are your career goals for the next 5 years?",
    "How do you handle constructive criticism?"
  ],
  general: [
    "Why are you interested in this position?",
    "What do you know about our company?",
    "What are your greatest strengths?",
    "What is your biggest weakness?",
    "Where do you see yourself in 5 years?",
    "Why are you leaving your current job?",
    "What salary range are you looking for?",
    "Do you have any questions for us?",
    "What makes you unique?",
    "How do you handle stress and pressure?"
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty, count } = await request.json()
    
    const categoryKey = category?.toLowerCase() || 'mixed'
    let questions: string[] = []
    
    if (categoryKey === 'mixed') {
      // Mix questions from all categories
      questions = [
        ...SAMPLE_QUESTIONS.technical.slice(0, 3),
        ...SAMPLE_QUESTIONS.behavioral.slice(0, 4),
        ...SAMPLE_QUESTIONS.general.slice(0, 3)
      ]
    } else {
      questions = SAMPLE_QUESTIONS[categoryKey as keyof typeof SAMPLE_QUESTIONS] || SAMPLE_QUESTIONS.general
    }
    
    // Shuffle and take requested count
    const shuffled = questions.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count || 5)
    
    return NextResponse.json({ questions: selected })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}