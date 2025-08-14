Project Description

PrepMate is a Next.js-powered AI platform that helps job seekers prepare for interviews through simulated mock sessions.
The app supports voice-based and text-based interviews, giving real-time or post-session feedback on answers, tone, confidence, and clarity using Google Cloud STT + Gemini AI.

Flow Overview
1. User Registration & Profile Setup

Auth: NextAuth.js for Google Sign-in & email/password.

Profile: Store user info (role, skills, years of experience, industry) in a database (Supabase or Firebase for speed, PostgreSQL for production).

Resume Upload (optional): Use a file upload route to process and store on Cloudinary. Gemini extracts job-related info for custom interview questions.

2. Selecting Interview Type

Step 1: Choose:

Mock Interview for specific role

General Interview Practice

Step 2: Choose style:

Technical

Behavioral

Mixed

Step 3: Choose mode:

Voice-based (real-time speech)

Text-based (chat)

3. Mock Interview Session
Voice-based flow

Gemini generates and displays the first question.

Google TTS API converts text to speech and plays in browser.

User speaks answer into microphone.

Browser sends audio blob to /api/stt.

/api/stt calls Google Cloud Speech-to-Text → returns transcript.

Transcript sent to /api/gemini-analyze for feedback.

Gemini returns analysis:

Content relevance

Confidence level (text patterns, filler words)

Completeness of answer

Feedback displayed after each question or at the end.

Text-based flow

Gemini sends question in text.

User types answer.

Gemini analyzes and returns text feedback.

4. AI Feedback & Scoring

Feedback includes:

Score per question (e.g., 8/10)

Strengths & weaknesses

Suggested improvements

Highlighted keywords to add

Tone analysis (voice mode only — speed, pauses, filler words)

Option to retry a question for better score.

5. Session Summary & History

At the end:

Overall score

Category breakdown (technical, behavioral, communication)

PDF export of Q&A + feedback (via /api/pdf-export)

Store session history in DB so users can track progress.

6. Monetization

Free tier: Limited to 5 questions/day.

Pro tier (Stripe Checkout):

Unlimited questions

PDF downloads

Advanced AI insights

Real-time voice feedback