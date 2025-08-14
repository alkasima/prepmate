"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { isProUser, getUserUsage, getRemainingUsage, FREE_LIMIT_COUNT } from "@/lib/usage"
import { 
  Home, 
  Play, 
  BarChart3, 
  Settings, 
  User, 
  BookOpen, 
  Trophy, 
  Calendar,
  Mic,
  MessageSquare,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Crown
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: Play,
    description: "Start interview sessions",
    submenu: [
      { title: "Voice Interview", href: "/dashboard/practice/voice", icon: Mic },
      { title: "Text Interview", href: "/dashboard/practice/text", icon: MessageSquare },
      { title: "Mock Interview", href: "/dashboard/practice/mock", icon: BookOpen }
    ]
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Performance insights"
  },
  {
    title: "Resume",
    href: "/dashboard/resume",
    icon: FileText,
    description: "Upload and manage resume"
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Account settings"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "App preferences"
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Support and guides"
  }
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [usage, setUsage] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const updatePlanStatus = () => {
      const proStatus = isProUser()
      const currentUsage = getUserUsage()
      const remainingUsage = getRemainingUsage()
      
      setIsPro(proStatus)
      setUsage(currentUsage)
      setRemaining(remainingUsage)
    }

    updatePlanStatus()
    
    // Update plan status when localStorage changes
    const handleStorageChange = () => {
      updatePlanStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(updatePlanStatus, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const toggleSubmenu = (href: string) => {
    setExpandedItem(expandedItem === href ? null : href)
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PrepMate
            </span>
          )}
        </motion.div>
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedItem === item.href

            return (
              <div key={item.href}>
                <motion.div
                  whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">{item.title}</span>
                          <ChevronRight 
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </Link>
                  )}
                </motion.div>

                {/* Submenu */}
                {hasSubmenu && isExpanded && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-1 space-y-1"
                  >
                    {item.submenu?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === subItem.href
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="ml-2">{subItem.title}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-slate-200 dark:border-slate-800"
        >
          <div className={cn(
            "rounded-lg p-3",
            isPro 
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
              : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          )}>
            <div className="flex items-center space-x-2 mb-2">
              {isPro ? (
                <Crown className="w-4 h-4 text-yellow-500" />
              ) : (
                <Trophy className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isPro ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {isPro ? "Unlimited practice sessions" : `${remaining} sessions remaining`}
            </p>
            {!isPro && (
              <>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(usage / FREE_LIMIT_COUNT) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {usage} of {FREE_LIMIT_COUNT} sessions used
                </p>
              </>
            )}
            {isPro && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All features unlocked
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}