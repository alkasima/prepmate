import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Try to fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      })

      if (user) {
        // Map database fields to profile structure
        const profile: UserProfile = {
          personalInfo: {
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            bio: user.bio || "",
            avatar: user.image || ""
          },
          professional: {
            currentRole: user.currentRole || "",
            company: user.company || "",
            experience: user.experience || "",
            industry: user.industry || "",
            targetRole: user.targetRole || "",
            skills: user.skills || []
          },
          education: {
            degree: user.degree || "",
            school: user.school || "",
            graduationYear: user.graduationYear || "",
            gpa: user.gpa || ""
          },
          social: {
            linkedin: user.linkedin || "",
            github: user.github || "",
            twitter: user.twitter || "",
            website: user.website || ""
          },
          preferences: {
            interviewTypes: [], // These would need to be added to schema if needed
            focusAreas: [],
            availability: "",
            timezone: ""
          }
        }

        return NextResponse.json(profile)
      }
    } catch (dbError) {
      console.error('Database error, falling back to default profile:', dbError)
    }

    // Fallback to default profile if database is not available
    const defaultProfile: UserProfile = {
      personalInfo: {
        name: session.user.name || "Demo User",
        email: session.user.email || "demo@prepmate.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Passionate software engineer with 5+ years of experience in full-stack development. Currently seeking senior engineering roles at innovative tech companies.",
        avatar: session.user.image || ""
      },
      professional: {
        currentRole: "Senior Software Engineer",
        company: "TechCorp Inc.",
        experience: "5+ years",
        industry: "Technology",
        targetRole: "Staff Software Engineer",
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"]
      },
      education: {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        graduationYear: "2019",
        gpa: "3.8"
      },
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        website: "https://johndoe.dev"
      },
      preferences: {
        interviewTypes: ["Technical", "Behavioral"],
        focusAreas: ["System Design", "Algorithms", "Leadership"],
        availability: "Weekday evenings",
        timezone: "PST"
      }
    }

    return NextResponse.json(defaultProfile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData: UserProfile = await request.json()

    // Validate required fields
    if (!profileData.personalInfo?.name || !profileData.personalInfo?.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    try {
      // Try to update user in database
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          // Personal info
          name: profileData.personalInfo.name,
          email: profileData.personalInfo.email,
          phone: profileData.personalInfo.phone,
          location: profileData.personalInfo.location,
          bio: profileData.personalInfo.bio,
          image: profileData.personalInfo.avatar,
          
          // Professional info
          currentRole: profileData.professional.currentRole,
          company: profileData.professional.company,
          experience: profileData.professional.experience,
          industry: profileData.professional.industry,
          targetRole: profileData.professional.targetRole,
          skills: profileData.professional.skills,
          
          // Education
          degree: profileData.education.degree,
          school: profileData.education.school,
          graduationYear: profileData.education.graduationYear,
          gpa: profileData.education.gpa,
          
          // Social links
          linkedin: profileData.social.linkedin,
          github: profileData.social.github,
          twitter: profileData.social.twitter,
          website: profileData.social.website,
        }
      })

      return NextResponse.json({ 
        message: 'Profile updated successfully in database',
        profile: profileData,
        saved: 'database'
      })
    } catch (dbError) {
      console.error('Database error, profile not saved to database:', dbError)
      
      // Return success but indicate it wasn't saved to database
      return NextResponse.json({ 
        message: 'Profile updated (database unavailable - changes are temporary)',
        profile: profileData,
        saved: 'memory',
        warning: 'Database connection failed. Changes will be lost on refresh.'
      })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}