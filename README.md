# 🎯 PrepMate - AI-Powered Interview Preparation Platform

> **AI-Powered Interview Preparation for Everyone**

PrepMate is a comprehensive interview preparation platform that uses AI to provide personalized feedback, real-time analysis, and adaptive learning to help job seekers ace their interviews.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**PrepMate** democratizes interview preparation by making professional coaching accessible to everyone through AI voice analysis. Using cutting-edge AI technology, we're solving the $4B interview preparation market gap where quality coaching is expensive and inaccessible to most job seekers.

## �� **Key Features**

### 🎤 **Voice Interview Practice**
- **Real-time speech recognition** with Google Cloud STT
- **AI-powered feedback** on tone, confidence, and clarity
- **Natural conversation flow** with adaptive questioning
- **Instant transcription** and analysis

### 📝 **Text Interview Practice**
- **Advanced NLP** for content analysis
- **Grammar, structure, and keyword optimization**
- **Instant feedback** and improvement suggestions
- **Personalized coaching** based on user profile

### 🤖 **AI-Powered Resume Analysis**
- **Intelligent resume parsing** and skill extraction
- **Custom question generation** based on experience
- **Role-specific interview preparation**
- **PDF/DOC support** with AI-powered parsing

### 📊 **Advanced Analytics**
- **Performance tracking** and trend analysis
- **Category-wise skill assessment**
- **Progress visualization** and insights
- **Detailed session history** and improvement metrics

### 🏆 **Gamification System**
- **18+ achievement badges** across 5 categories
- **Point-based reward system** with rankings
- **Streak tracking** and milestone celebrations
- **Motivational progress tracking**

## �� **Technology Stack**

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Authentication** | NextAuth.js with Google OAuth |
| **AI Services** | Google Cloud Speech-to-Text, Gemini AI |
| **Database** | Prisma with PostgreSQL |
| **Deployment** | Vercel, Fly.io |
| **Payments** | Stripe integration |
| **File Processing** | PDF parsing, Cloudinary |

## �� **Demo Credentials**

```bash
Email: demo@prepmate.com
Password: password123
```

## 🏃‍♂️ **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud account (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prepmate.git
cd prepmate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:3000` and use the demo credentials above.

### Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI Services
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Database
DATABASE_URL=your-database-url

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## �� **Screenshots**

<details>
<summary>�� **Landing Page**</summary>

![Landing Page](screenshots/landing.png)

*Modern, responsive landing page with animated elements and clear value proposition*
</details>

<details>
<summary>📊 **Dashboard**</summary>

![Dashboard](screenshots/dashboard.png)

*Comprehensive dashboard with performance metrics, recent sessions, and quick actions*
</details>

<details>
<summary>🎤 **Voice Interview**</summary>

![Voice Interview](screenshots/voice-interview.png)

*Real-time voice interview practice with AI feedback and transcription*
</details>

<details>
<summary>📈 **Analytics**</summary>

![Analytics](screenshots/analytics.png)

*Detailed analytics dashboard with performance tracking and insights*
</details>

## 🏆 **Competition Highlights**

### **Innovation** 🚀
- **First-of-its-kind** voice analysis for interview preparation
- **AI-powered resume-to-questions** generation
- **Comprehensive gamification** system with achievements
- **Real-time speech recognition** with instant feedback

### **Technical Excellence** ⚡
- **Modern React 19** with Next.js 15
- **Professional UI/UX** with smooth animations
- **Scalable architecture** ready for production
- **Type-safe development** with TypeScript

### **User Experience** 💫
- **Intuitive interface** with guided workflows
- **Real-time feedback** and progress tracking
- **Mobile-responsive design** for all devices
- **Accessibility-focused** voice interface

### **Social Impact** 🌍
- **Democratizes access** to professional coaching
- **Addresses $4B** interview preparation market
- **Scalable SaaS model** with clear monetization
- **Ready for enterprise** deployment

## 🔮 **Future Roadmap**

### **Phase 1: Enhanced AI** 🤖
- [ ] **Emotion detection** and body language analysis
- [ ] **Advanced personalization** with machine learning
- [ ] **Multi-language support** for global accessibility

### **Phase 2: Mobile & Enterprise** 📱
- [ ] **React Native mobile app** for iOS and Android
- [ ] **Enterprise features** with team management
- [ ] **Advanced analytics** for corporate clients

### **Phase 3: Ecosystem** 🌐
- [ ] **ATS integrations** with major job platforms
- [ ] **Job board connections** for seamless application
- [ ] **Educational partnerships** with universities

## 📊 **Project Statistics**

![GitHub stars](https://img.shields.io/github/stars/yourusername/prepmate?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/prepmate?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/prepmate)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/prepmate)

## �� **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/prepmate.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Google Cloud** for Speech-to-Text and Gemini AI
- **Vercel** for hosting and deployment
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for smooth animations

## 📞 **Contact**

- **Project Link**: [https://github.com/alkasima/prepmate](https://github.com/alkasima/prepmate)
- **Live Demo**: [https://preepmat.netlify.app/](https://preepmat.netlify.app/)
- **Email**: alkasima@gmail.com

---

<div align="center">

**PrepMate** - *Master your next interview with AI* ��

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/yourusername/prepmate)

</div>