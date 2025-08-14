# 🚀 PrepMate Setup Guide - Real Database & AI Integration

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Neon account** (free tier works)
3. **Google AI Studio account** for Gemini API
4. **Google Cloud Console** (optional, for OAuth)

## 🗄️ Step 1: Database Setup (Neon)

### 1.1 Create Neon Project
1. Go to [neon.tech](https://neon.tech)
2. Click "Start your project"
3. Create a new project
4. Wait for setup to complete

### 1.2 Get Database Credentials (Neon)
1. Go to Project Settings → Database
2. Copy the connection string
3. Go to Project Settings → API
4. Copy the Project URL and anon key

### 1.3 Update Environment Variables
```bash
# .env (Neon)
DATABASE_URL=postgresql://<user>:<password>@<your-neon-host>/<database>?sslmode=require
```
Example (pooler):
```bash
DATABASE_URL=postgresql://neondb_owner:***@ep-xxxxxxx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

## 🤖 Step 2: Gemini AI Setup

### 2.1 Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### 2.2 Update Environment Variables
```bash
# Add to .env.local
GEMINI_API_KEY=your-gemini-api-key
```


## 🗣️ Google Cloud Speech-to-Text (Voice)

Use Google Cloud Speech-to-Text for real voice transcription in the Voice Interview flow.

### Enable API and credentials
1. In Google Cloud Console, enable the "Speech-to-Text API" for your project
2. Create a Service Account and grant it the role: "Cloud Speech Client"
3. Create a JSON key and download it locally

### Set credentials as an environment variable
- Windows (PowerShell):
```powershell
setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\your-service-account.json"
```
- macOS/Linux (bash/zsh):
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/your-service-account.json"
```
Restart your terminal after setting this.

### Install dependency (if not already installed)
```bash
npm i @google-cloud/speech
```

### How it works in this repo
- API route: `POST /api/stt`
  - Accepts raw audio bytes (`application/octet-stream`)
  - Reads `X-Audio-Mime` header to infer encoding (prefers `audio/webm;codecs=opus` → `WEBM_OPUS`)
  - Returns `{ transcript }`
- Voice UI records with MediaRecorder and sends the audio to `/api/stt`
- Transcript is then sent to `/api/interview/analyze` to save results and update session score in Neon

### Tips
- Use Chrome for best MediaRecorder support (webm/opus)
- Ensure your mic permissions are granted
- If you see `{ error: "No transcript detected" }`, try speaking longer and louder, or verify credentials and API enablement
- Common errors:
  - `STT error: ... permission denied` → Wrong or missing `GOOGLE_APPLICATION_CREDENTIALS`
  - Prisma engine errors on Windows → stop dev server, delete `node_modules/.prisma/client`, run `npx prisma generate`

## 🔧 Step 3: Install & Setup

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with achievements
npx prisma db seed
```

### 3.3 Run Development Server
```bash
npm run dev
```

## 🎯 Step 4: Test the Application

### 4.1 Demo Login
- Email: `demo@prepmate.com`
- Password: `password123`

### 4.2 Test Features
1. **Voice Interview**: Record audio, get AI feedback
2. **Text Interview**: Type responses, get analysis
3. **Resume Upload**: Upload PDF/DOC, get AI parsing
4. **Analytics**: View real performance data
5. **Achievements**: Unlock real achievements

## 🔐 Step 5: Google OAuth (Optional)

### 5.1 Setup Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`

### 5.2 Update Environment Variables
```bash
# Add to .env.local
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🎨 Step 6: Seed Database (Optional)

Create a seed file to populate achievements:

```bash
# Create prisma/seed.ts
npx prisma db seed
```

## 🚀 Step 7: Deploy (Optional)

### 7.1 Vercel Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### 7.2 Environment Variables for Production
```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-neon-connection-string
GEMINI_API_KEY=your-gemini-key
```

## 🎯 Features Now Working

✅ **Real Database Storage**
- User profiles and sessions
- Interview history and analytics
- Achievement tracking
- Resume storage

✅ **AI-Powered Analysis**
- Gemini AI feedback on responses
- Personalized question generation
- Resume parsing and analysis
- Performance insights

✅ **Authentication**
- Database-backed user accounts
- Google OAuth integration
- Session management

✅ **File Upload**
- Resume upload and processing
- AI-powered content extraction
- File storage integration ready

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio
```

### API Issues
- Check environment variables
- Verify API keys are correct
- Check network connectivity

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎉 You're Ready!

Your PrepMate application now has:
- ✅ Real database with Neon
- ✅ AI integration with Gemini
- ✅ Production-ready architecture
- ✅ Scalable and maintainable code

**Demo the real features and wow the judges!** 🏆