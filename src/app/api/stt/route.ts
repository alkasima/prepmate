import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const audioBuffer = await request.arrayBuffer()
    const mimeType = request.headers.get('X-Audio-Mime') || 'audio/webm'
    
    // Try browser-based Web Speech API approach first
    // Since we can't directly use Web Speech API on server, we'll use a different approach
    
    // For now, let's use OpenAI Whisper API if available
    if (process.env.OPENAI_API_KEY) {
      try {
        const formData = new FormData()
        const audioBlob = new Blob([audioBuffer], { type: mimeType })
        formData.append('file', audioBlob, 'audio.webm')
        formData.append('model', 'whisper-1')
        formData.append('language', 'en')

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            transcript: result.text || '',
            confidence: 0.95,
            source: 'openai-whisper'
          })
        }
      } catch (whisperError) {
        console.error('OpenAI Whisper error:', whisperError)
      }
    }

    // Try Google Speech-to-Text if configured
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT_ID) {
      try {
        const speech = await import('@google-cloud/speech')
        const speechClient = new speech.SpeechClient()
        
        const audioBytes = Buffer.from(audioBuffer).toString('base64')
        
        const speechRequest = {
          audio: {
            content: audioBytes,
          },
          config: {
            encoding: mimeType.includes('webm') ? 'WEBM_OPUS' as const : 'LINEAR16' as const,
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'latest_long',
          },
        }

        const [response] = await speechClient.recognize(speechRequest)
        const transcription = response.results
          ?.map(result => result.alternatives?.[0]?.transcript)
          .join('\n') || ''

        if (transcription.trim()) {
          return NextResponse.json({ 
            transcript: transcription.trim(),
            confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0.9,
            source: 'google-speech'
          })
        }
      } catch (speechError) {
        console.error('Google Speech-to-Text error:', speechError)
      }
    }
    
    // Fallback: Return a message indicating real transcription is not available
    const audioSize = audioBuffer.byteLength
    const audioDuration = Math.max(1, Math.round(audioSize / 16000))
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return NextResponse.json({ 
      transcript: "[Real-time transcription not configured. Please set up OpenAI API key or Google Cloud Speech-to-Text to enable actual audio transcription. For now, please use text mode or manually type what you said.]",
      confidence: 0.0,
      source: 'fallback',
      duration: audioDuration,
      note: "To enable real transcription, add OPENAI_API_KEY to your environment variables."
    })
  } catch (error) {
    console.error('Speech-to-text error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}