"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  MapPin,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Zap,
  X,
  ExternalLink
} from "lucide-react"

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
  skills: string[]
  certifications: string[]
  languages: string[]
}

export default function ResumePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock resume data for demo
  const mockResumeData: ResumeData = {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA"
    },
    summary: "Experienced Full Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Passionate about creating user-centric solutions and leading development teams.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        duration: "2022 - Present",
        description: "Led development of microservices architecture serving 1M+ users. Improved system performance by 40% and reduced deployment time by 60%."
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        description: "Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components."
      },
      {
        title: "Junior Developer",
        company: "WebSolutions",
        duration: "2019 - 2020",
        description: "Developed and maintained client websites using HTML, CSS, JavaScript, and PHP. Gained experience in database design and optimization."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2019"
      }
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", 
      "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Git", "Agile"
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional Developer",
      "Certified Scrum Master"
    ],
    languages: ["English (Native)", "Spanish (Conversational)", "French (Basic)"]
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      alert('Please upload a PDF or DOC file')
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    // Create URL for file preview/download
    const url = URL.createObjectURL(file)
    setFileUrl(url)

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false)
      analyzeResume()
    }, 2000)
  }

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setResumeData(mockResumeData)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  const generateQuestions = () => {
    // This would generate custom interview questions based on resume
    alert("Custom interview questions generated based on your resume! Check the Practice section.")
  }

  const removeResume = () => {
    setUploadedFile(null)
    setResumeData(null)
    setAnalysisComplete(false)
    setShowPreview(false)
    
    // Clean up the object URL
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
      setFileUrl(null)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePreview = () => {
    if (fileUrl) {
      setShowPreview(true)
    }
  }

  const handleDownload = () => {
    if (uploadedFile && fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = uploadedFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <>
      {/* Preview Modal */}
      {showPreview && fileUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Resume Preview - {uploadedFile?.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              {uploadedFile?.type.includes('pdf') ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-full min-h-[600px] border border-slate-200 dark:border-slate-700 rounded"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Preview Not Available
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Preview is only available for PDF files. Word documents need to be downloaded to view.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Resume Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload your resume to get personalized interview questions and feedback
          </p>
        </div>
        {resumeData && (
          <Button 
            onClick={generateQuestions}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate Questions
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF or DOC format for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">
                    Drag and drop your resume here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    or click to browse files
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-4">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      onClick={removeResume}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Brain className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Analyzing with AI...</span>
                    </div>
                  )}

                  {analysisComplete && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Analysis complete!</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={handlePreview}
                      disabled={!fileUrl}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={handleDownload}
                      disabled={!fileUrl}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI-Powered Features
              </h3>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Extract key skills and experience</li>
                <li>• Generate role-specific questions</li>
                <li>• Identify improvement areas</li>
                <li>• Match with job requirements</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          {resumeData ? (
            <div className="space-y-6">
              {/* Personal Info */}
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">{resumeData.personalInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">{resumeData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">{resumeData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">{resumeData.personalInfo.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {resumeData.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{exp.title}</h3>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{exp.duration}</span>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 mb-2">{exp.company}</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-yellow-600" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-slate-900 dark:text-white">{edu.degree}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{edu.school}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certifications */}
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeData.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-slate-700 dark:text-slate-300">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-teal-600" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeData.languages.map((lang, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full" />
                          <span className="text-slate-700 dark:text-slate-300">{lang}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Strengths Identified:</h4>
                      <ul className="space-y-1 text-blue-100">
                        <li>• Strong technical leadership experience</li>
                        <li>• Proven track record with metrics</li>
                        <li>• Diverse technology stack</li>
                        <li>• Cloud certifications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Suggested Focus Areas:</h4>
                      <ul className="space-y-1 text-blue-100">
                        <li>• System design questions</li>
                        <li>• Leadership scenarios</li>
                        <li>• Performance optimization</li>
                        <li>• Team collaboration</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-400">
                    <p className="text-blue-100 text-sm">
                      💡 Based on your resume, we've identified 15 custom interview questions tailored to your experience level and skills.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No Resume Uploaded
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload your resume to see AI-powered analysis and get personalized interview questions.
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
    </>
  )
}