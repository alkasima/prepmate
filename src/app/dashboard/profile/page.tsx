"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Award,
  Target,
  TrendingUp,
  Clock,
  Star,
  Trophy,
  Crown,
  Shield,
  Zap,
  Heart,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Link as LinkIcon
} from "lucide-react"

interface UserProfile {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    bio: string
    avatar: string
  }
  professional: {
    currentRole: string
    company: string
    experience: string
    industry: string
    targetRole: string
    skills: string[]
  }
  education: {
    degree: string
    school: string
    graduationYear: string
    gpa: string
  }
  social: {
    linkedin: string
    github: string
    twitter: string
    website: string
  }
  preferences: {
    interviewTypes: string[]
    focusAreas: string[]
    availability: string
    timezone: string
  }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<UserProfile>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      avatar: ""
    },
    professional: {
      currentRole: "",
      company: "",
      experience: "",
      industry: "",
      targetRole: "",
      skills: []
    },
    education: {
      degree: "",
      school: "",
      graduationYear: "",
      gpa: ""
    },
    social: {
      linkedin: "",
      github: "",
      twitter: "",
      website: ""
    },
    preferences: {
      interviewTypes: [],
      focusAreas: [],
      availability: "",
      timezone: ""
    }
  })

  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const profileData = await response.json()
      setProfile(profileData)
      setOriginalProfile(profileData)
      setError(null)
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "professional", name: "Professional", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "social", name: "Social Links", icon: Globe }
  ]



  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const result = await response.json()
      setOriginalProfile(profile)
      setIsEditing(false)
      
      // Show appropriate message based on where data was saved
      if (result.saved === 'database') {
        setSuccessMessage('Profile saved to database successfully!')
      } else if (result.saved === 'memory') {
        setSuccessMessage(result.message)
        setError(result.warning)
      } else {
        setSuccessMessage('Profile updated successfully!')
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
        if (result.saved === 'memory') {
          setError(null)
        }
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile)
    }
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  const updateProfile = (section: keyof UserProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    // Clear any existing messages when user starts editing
    setError(null)
    setSuccessMessage(null)
  }

  const updatePreferenceArray = (field: 'interviewTypes' | 'focusAreas', value: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: checked 
          ? [...prev.preferences[field], value]
          : prev.preferences[field].filter(item => item !== value)
      }
    }))
    setError(null)
    setSuccessMessage(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
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
            Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your personal information and interview preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      {(successMessage || error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-700 dark:text-green-300">{successMessage}</span>
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 mb-6">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  {profile.personalInfo.avatar ? (
                    <img
                      src={profile.personalInfo.avatar}
                      alt={profile.personalInfo.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {profile.personalInfo.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                {profile.professional.currentRole}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                {profile.personalInfo.location}
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">Pro Member</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.personalInfo.bio}
              </p>
            </CardContent>
          </Card>


        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </Button>
              )
            })}
          </div>

          {/* Tab Content */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.personalInfo.name}
                        onChange={(e) => updateProfile('personalInfo', 'name', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.personalInfo.email}
                        onChange={(e) => updateProfile('personalInfo', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.personalInfo.phone}
                        onChange={(e) => updateProfile('personalInfo', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.personalInfo.location}
                        onChange={(e) => updateProfile('personalInfo', 'location', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profile.personalInfo.bio}
                      onChange={(e) => updateProfile('personalInfo', 'bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="mt-1 w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentRole">Current Role</Label>
                      <Input
                        id="currentRole"
                        value={profile.professional.currentRole}
                        onChange={(e) => updateProfile('professional', 'currentRole', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.professional.company}
                        onChange={(e) => updateProfile('professional', 'company', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        value={profile.professional.experience}
                        onChange={(e) => updateProfile('professional', 'experience', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={profile.professional.industry}
                        onChange={(e) => updateProfile('professional', 'industry', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="targetRole">Target Role</Label>
                      <Input
                        id="targetRole"
                        value={profile.professional.targetRole}
                        onChange={(e) => updateProfile('professional', 'targetRole', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Skills</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.professional.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={profile.education.degree}
                        onChange={(e) => updateProfile('education', 'degree', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="school">School/University</Label>
                      <Input
                        id="school"
                        value={profile.education.school}
                        onChange={(e) => updateProfile('education', 'school', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        value={profile.education.graduationYear}
                        onChange={(e) => updateProfile('education', 'graduationYear', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA (Optional)</Label>
                      <Input
                        id="gpa"
                        value={profile.education.gpa}
                        onChange={(e) => updateProfile('education', 'gpa', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profile.social.linkedin}
                          onChange={(e) => updateProfile('social', 'linkedin', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      <div className="flex-1">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={profile.social.github}
                          onChange={(e) => updateProfile('social', 'github', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={profile.social.twitter}
                          onChange={(e) => updateProfile('social', 'twitter', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <Label htmlFor="website">Personal Website</Label>
                        <Input
                          id="website"
                          value={profile.social.website}
                          onChange={(e) => updateProfile('social', 'website', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}