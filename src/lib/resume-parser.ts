// Simple text-based resume parser as fallback
export function parseResumeText(text: string): any {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const result: any = {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  }

  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/)
  if (emailMatch) {
    result.personalInfo.email = emailMatch[0]
  }

  // Extract phone
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/)
  if (phoneMatch) {
    result.personalInfo.phone = phoneMatch[0]
  }

  // Extract name (usually first line or line before email)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i]
    if (line.length > 2 && line.length < 50 && 
        !line.includes('@') && 
        !line.includes('(') && 
        !line.includes('http') &&
        /^[A-Za-z\s]+$/.test(line)) {
      result.personalInfo.name = line
      break
    }
  }

  // Extract location (look for city, state patterns)
  const locationMatch = text.match(/([A-Za-z\s]+),\s*([A-Z]{2})/g)
  if (locationMatch && locationMatch.length > 0) {
    result.personalInfo.location = locationMatch[0]
  }

  // Extract skills (look for common skill keywords)
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'Linux', 'Windows', 'MacOS', 'Agile',
    'Scrum', 'REST', 'API', 'GraphQL', 'Redux', 'Vue.js', 'Angular',
    'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'PHP', 'Ruby',
    'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Flutter', 'React Native'
  ]

  const foundSkills: string[] = []
  for (const skill of skillKeywords) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  }
  result.skills = foundSkills.slice(0, 15) // Limit to 15 skills

  // Extract experience (look for job titles and companies)
  const experiencePatterns = [
    /([A-Za-z\s]+)\s*\|\s*([A-Za-z\s&.,]+)\s*\|\s*([0-9]{4}[\s\-]*(?:Present|[0-9]{4}))/g,
    /([A-Za-z\s]+)\s*at\s*([A-Za-z\s&.,]+)\s*\(([0-9]{4}[\s\-]*(?:Present|[0-9]{4}))\)/g
  ]

  for (const pattern of experiencePatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      result.experience.push({
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
        description: "Experience details extracted from resume"
      })
    }
  }

  // Extract education
  const educationKeywords = ['Bachelor', 'Master', 'PhD', 'University', 'College', 'Institute']
  for (const line of lines) {
    for (const keyword of educationKeywords) {
      if (line.includes(keyword)) {
        const yearMatch = line.match(/[0-9]{4}/)
        result.education.push({
          degree: line,
          school: line.includes('University') ? line.split('University')[0] + 'University' : 'Educational Institution',
          year: yearMatch ? yearMatch[0] : 'N/A'
        })
        break
      }
    }
  }

  // Extract summary (look for summary/objective sections)
  const summaryKeywords = ['SUMMARY', 'OBJECTIVE', 'PROFILE', 'ABOUT']
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase()
    if (summaryKeywords.some(keyword => line.includes(keyword))) {
      // Get next few lines as summary
      const summaryLines = []
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].length > 20 && !lines[j].toUpperCase().includes('EXPERIENCE') && 
            !lines[j].toUpperCase().includes('EDUCATION')) {
          summaryLines.push(lines[j])
        }
      }
      if (summaryLines.length > 0) {
        result.summary = summaryLines.join(' ')
        break
      }
    }
  }

  // If no summary found, create a generic one
  if (!result.summary && result.skills.length > 0) {
    result.summary = `Professional with experience in ${result.skills.slice(0, 3).join(', ')} and other technologies.`
  }

  // Extract certifications
  const certificationKeywords = ['Certified', 'Certification', 'AWS', 'Google Cloud', 'Microsoft', 'Oracle']
  for (const line of lines) {
    if (certificationKeywords.some(keyword => line.includes(keyword)) && line.length < 100) {
      result.certifications.push(line)
    }
  }

  return result
}