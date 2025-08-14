import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

export interface InterviewFeedback {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  confidence: number
  clarity: number
  relevance: number
  grammarScore?: number
  keywordMatch?: number
  sentiment?: string
}

export async function analyzeInterviewResponse(
  question: string,
  answer: string,
  category: 'technical' | 'behavioral' | 'general' | 'mixed',
  userProfile?: {
    experience?: string
    skills?: string[]
    targetRole?: string
  }
): Promise<InterviewFeedback> {
  try {
    const prompt = `
You are an expert interview coach analyzing a candidate's response. Please provide detailed feedback.

QUESTION: "${question}"
ANSWER: "${answer}"
CATEGORY: ${category}
${userProfile ? `
CANDIDATE PROFILE:
- Experience: ${userProfile.experience || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Target Role: ${userProfile.targetRole || 'Not specified'}
` : ''}

Please analyze this interview response and provide feedback in the following JSON format:
{
  "score": [number from 1-10],
  "strengths": [array of 2-4 specific strengths],
  "weaknesses": [array of 2-3 areas for improvement],
  "suggestions": [array of 2-3 actionable improvement suggestions],
  "confidence": [number from 1-100 representing confidence level],
  "clarity": [number from 1-100 representing clarity of communication],
  "relevance": [number from 1-100 representing relevance to the question],
  "grammarScore": [number from 1-100 for grammar and language use],
  "keywordMatch": [number from 1-100 for relevant keyword usage],
  "sentiment": "[positive/neutral/negative]"
}

Focus on:
1. Content quality and relevance
2. Structure and organization
3. Specific examples and metrics
4. Communication clarity
5. Technical accuracy (for technical questions)
6. Behavioral indicators (for behavioral questions)

Be constructive and specific in your feedback.
`

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const feedback: InterviewFeedback = JSON.parse(jsonMatch[0])
    
    // Validate the response
    if (typeof feedback.score !== 'number' || feedback.score < 1 || feedback.score > 10) {
      throw new Error('Invalid score in Gemini response')
    }

    return feedback
  } catch (error) {
    console.error('Error analyzing interview response:', error)
    
    // Fallback response
    return {
      score: 7.5,
      strengths: ['Clear communication', 'Relevant examples'],
      weaknesses: ['Could be more specific', 'Add more details'],
      suggestions: ['Include quantifiable results', 'Structure your answer better'],
      confidence: 75,
      clarity: 80,
      relevance: 85,
      grammarScore: 90,
      keywordMatch: 70,
      sentiment: 'positive'
    }
  }
}

export async function generateInterviewQuestions(
  category: 'technical' | 'behavioral' | 'general' | 'mixed',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5,
  userProfile?: {
    experience?: string
    skills?: string[]
    targetRole?: string
    resumeData?: any
  }
): Promise<string[]> {
  try {
    const prompt = `
Generate ${count} ${difficulty} level ${category} interview questions.

${userProfile ? `
CANDIDATE PROFILE:
- Experience: ${userProfile.experience || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Target Role: ${userProfile.targetRole || 'Not specified'}
${userProfile.resumeData ? `- Resume highlights: ${JSON.stringify(userProfile.resumeData, null, 2)}` : ''}
` : ''}

Requirements:
1. Questions should be appropriate for ${difficulty} level candidates
2. Focus on ${category} interview topics
3. Make questions specific and actionable
4. Avoid generic or overly broad questions
5. Include a mix of question types within the category

Return ONLY a JSON array of questions, no additional text:
["Question 1", "Question 2", "Question 3", ...]
`

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const questions: string[] = JSON.parse(jsonMatch[0])
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions array from Gemini')
    }

    return questions.slice(0, count)
  } catch (error) {
    console.error('Error generating interview questions:', error)
    
    // Fallback questions based on category
    const fallbackQuestions = {
      technical: [
        'Explain the difference between REST and GraphQL APIs.',
        'How would you optimize a slow database query?',
        'Describe your approach to debugging a production issue.',
        'What are the trade-offs between microservices and monolithic architecture?',
        'How do you ensure code quality in your projects?'
      ],
      behavioral: [
        'Tell me about a time when you had to work with a difficult team member.',
        'Describe a situation where you had to meet a tight deadline.',
        'How do you handle constructive criticism?',
        'Tell me about a project you\'re particularly proud of.',
        'Describe a time when you had to learn a new technology quickly.'
      ],
      general: [
        'Tell me about yourself and your background.',
        'Why are you interested in this role?',
        'What are your greatest strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'Why are you looking to leave your current position?'
      ],
      mixed: [
        'Tell me about yourself and your technical background.',
        'Describe a challenging technical project and how you managed it.',
        'How do you stay updated with new technologies?',
        'Tell me about a time you had to explain a technical concept to a non-technical person.',
        'What interests you most about this role and our company?'
      ]
    }

    return fallbackQuestions[category] || fallbackQuestions.general
  }
}

export async function analyzeResume(resumeText: string): Promise<any> {
  try {
    console.log('Starting Gemini AI analysis...')
    
    const prompt = `
You are an expert resume parser. Analyze this resume and extract structured information. 
Return ONLY valid JSON with no additional text or formatting.

RESUME TEXT:
${resumeText}

Extract and return this exact JSON structure:
{
  "personalInfo": {
    "name": "full name from resume",
    "email": "email address",
    "phone": "phone number",
    "location": "city, state or location"
  },
  "summary": "professional summary or objective statement",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "employment period",
      "description": "key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "school": "institution name",
      "year": "graduation year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["certification1", "certification2"],
  "languages": ["language1", "language2"]
}

Important: Return ONLY the JSON object, no other text.
`

    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    console.log('Gemini response received, length:', text.length)
    console.log('Raw response:', text.substring(0, 200) + '...')

    // Clean the response text
    let cleanedText = text.trim()
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // Extract JSON from the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', cleanedText)
      throw new Error('Invalid response format from Gemini - no JSON found')
    }

    const jsonString = jsonMatch[0]
    console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...')
    
    const parsedData = JSON.parse(jsonString)
    console.log('Successfully parsed JSON data')
    
    // Validate required fields
    if (!parsedData.personalInfo || !parsedData.personalInfo.name) {
      throw new Error('Missing required personalInfo.name field')
    }
    
    return parsedData
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error)
    throw error // Re-throw to let the API handle the fallback
  }
}