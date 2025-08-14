"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard/layout"
import { 
  Settings,
  Bell,
  Shield,
  Palette,
  Volume2,
  Globe,
  Download,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Mic,
  Camera,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  CreditCard,
  Crown,
  Zap
} from "lucide-react"

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    sessionReminders: boolean
    achievementAlerts: boolean
    weeklyReports: boolean
    marketingEmails: boolean
  }
  privacy: {
    profileVisibility: "public" | "private" | "friends"
    showAchievements: boolean
    showProgress: boolean
    allowAnalytics: boolean
    shareData: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    language: string
    timezone: string
    dateFormat: string
    compactMode: boolean
  }
  audio: {
    microphoneEnabled: boolean
    speakerEnabled: boolean
    noiseReduction: boolean
    autoGainControl: boolean
    echoCancellation: boolean
    volume: number
  }
  interview: {
    defaultType: "voice" | "text" | "mock"
    sessionLength: number
    difficultyLevel: "beginner" | "intermediate" | "advanced"
    autoSave: boolean
    pauseOnBlur: boolean
    showHints: boolean
  }
  account: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    loginAlerts: boolean
    dataRetention: number
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      sessionReminders: true,
      achievementAlerts: true,
      weeklyReports: false,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: "public",
      showAchievements: true,
      showProgress: true,
      allowAnalytics: true,
      shareData: false
    },
    appearance: {
      theme: "system",
      language: "en",
      timezone: "PST",
      dateFormat: "MM/DD/YYYY",
      compactMode: false
    },
    audio: {
      microphoneEnabled: true,
      speakerEnabled: true,
      noiseReduction: true,
      autoGainControl: true,
      echoCancellation: true,
      volume: 75
    },
    interview: {
      defaultType: "voice",
      sessionLength: 30,
      difficultyLevel: "intermediate",
      autoSave: true,
      pauseOnBlur: false,
      showHints: true
    },
    account: {
      twoFactorEnabled: false,
      sessionTimeout: 60,
      loginAlerts: true,
      dataRetention: 365
    }
  })

  const tabs = [
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "audio", name: "Audio", icon: Volume2 },
    { id: "interview", name: "Interview", icon: MessageSquare },
    { id: "account", name: "Account", icon: Key },
    { id: "billing", name: "Billing", icon: CreditCard }
  ]

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    // Save settings to backend
    console.log("Saving settings:", settings)
  }

  const handleReset = () => {
    // Reset to default settings
    console.log("Resetting settings")
  }

  const handleExportData = () => {
    // Export user data
    console.log("Exporting data")
  }

  const handleDeleteAccount = () => {
    // Delete account with confirmation
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account")
    }
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
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Customize your PrepMate experience and manage your account
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Receive push notifications on your device</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Session Reminders</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Get reminded about scheduled practice sessions</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.sessionReminders}
                            onChange={(e) => updateSetting('notifications', 'sessionReminders', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Achievement Alerts</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Get notified when you unlock achievements</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.achievementAlerts}
                            onChange={(e) => updateSetting('notifications', 'achievementAlerts', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Privacy Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <select
                          id="profileVisibility"
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                          className="mt-1 w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="public">Public - Anyone can see your profile</option>
                          <option value="private">Private - Only you can see your profile</option>
                          <option value="friends">Friends - Only friends can see your profile</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Show Achievements</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Display your achievements on your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showAchievements}
                            onChange={(e) => updateSetting('privacy', 'showAchievements', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Allow Analytics</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Help us improve by sharing anonymous usage data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.allowAnalytics}
                            onChange={(e) => updateSetting('privacy', 'allowAnalytics', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appearance Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <Label>Theme</Label>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Monitor }
                          ].map((theme) => {
                            const Icon = theme.icon
                            return (
                              <button
                                key={theme.value}
                                onClick={() => updateSetting('appearance', 'theme', theme.value)}
                                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                                  settings.appearance.theme === theme.value
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{theme.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="language">Language</Label>
                          <select
                            id="language"
                            value={settings.appearance.language}
                            onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                            className="mt-1 w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="timezone">Timezone</Label>
                          <select
                            id="timezone"
                            value={settings.appearance.timezone}
                            onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                            className="mt-1 w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="PST">Pacific (PST)</option>
                            <option value="MST">Mountain (MST)</option>
                            <option value="CST">Central (CST)</option>
                            <option value="EST">Eastern (EST)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Compact Mode</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Use a more compact layout to fit more content</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.appearance.compactMode}
                            onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "audio" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Audio Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="volume">Volume</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Volume2 className="w-4 h-4 text-slate-600" />
                          <input
                            type="range"
                            id="volume"
                            min="0"
                            max="100"
                            value={settings.audio.volume}
                            onChange={(e) => updateSetting('audio', 'volume', parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{settings.audio.volume}%</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mic className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Microphone</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Enable microphone for voice interviews</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.audio.microphoneEnabled}
                              onChange={(e) => updateSetting('audio', 'microphoneEnabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Noise Reduction</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Reduce background noise during recording</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.audio.noiseReduction}
                              onChange={(e) => updateSetting('audio', 'noiseReduction', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Echo Cancellation</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Cancel echo and feedback</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.audio.echoCancellation}
                              onChange={(e) => updateSetting('audio', 'echoCancellation', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "interview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Interview Settings</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="defaultType">Default Interview Type</Label>
                          <select
                            id="defaultType"
                            value={settings.interview.defaultType}
                            onChange={(e) => updateSetting('interview', 'defaultType', e.target.value)}
                            className="mt-1 w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="voice">Voice Interview</option>
                            <option value="text">Text Interview</option>
                            <option value="mock">Mock Interview</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="difficultyLevel">Default Difficulty</Label>
                          <select
                            id="difficultyLevel"
                            value={settings.interview.difficultyLevel}
                            onChange={(e) => updateSetting('interview', 'difficultyLevel', e.target.value)}
                            className="mt-1 w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sessionLength">Default Session Length (minutes)</Label>
                        <Input
                          id="sessionLength"
                          type="number"
                          min="10"
                          max="120"
                          value={settings.interview.sessionLength}
                          onChange={(e) => updateSetting('interview', 'sessionLength', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Auto-save Progress</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Automatically save your progress during sessions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.interview.autoSave}
                              onChange={(e) => updateSetting('interview', 'autoSave', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Show Hints</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Display helpful hints during interviews</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.interview.showHints}
                              onChange={(e) => updateSetting('interview', 'showHints', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Security</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <Button
                          variant={settings.account.twoFactorEnabled ? "outline" : "default"}
                          size="sm"
                          onClick={() => updateSetting('account', 'twoFactorEnabled', !settings.account.twoFactorEnabled)}
                        >
                          {settings.account.twoFactorEnabled ? "Disable" : "Enable"}
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          min="15"
                          max="480"
                          value={settings.account.sessionTimeout}
                          onChange={(e) => updateSetting('account', 'sessionTimeout', parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Login Alerts</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Get notified of new login attempts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.account.loginAlerts}
                            onChange={(e) => updateSetting('account', 'loginAlerts', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data Management</h4>
                    <div className="space-y-4">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDeleteAccount}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Billing & Subscription</h3>
                    
                    {/* Current Plan */}
                    <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Crown className="w-8 h-8 text-yellow-500" />
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Pro Plan</h4>
                              <p className="text-slate-600 dark:text-slate-400">Unlimited practice sessions and advanced features</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">$19/month</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Next billing: Jan 15, 2024</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Update Payment Method
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoices
                      </Button>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Cancel Subscription</h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            You can cancel your subscription at any time. You'll continue to have access until your current billing period ends.
                          </p>
                          <Button variant="outline" size="sm" className="mt-3 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                            Cancel Subscription
                          </Button>
                        </div>
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