// Usage tracking for free users
const FREE_LIMIT = 5 // Free users get 5 practice sessions

export function getUserUsage(): number {
  if (typeof window === 'undefined') return 0
  const usage = localStorage.getItem('userUsage')
  return usage ? parseInt(usage, 10) : 0
}

export function incrementUsage(): number {
  if (typeof window === 'undefined') return 0
  const currentUsage = getUserUsage()
  const newUsage = currentUsage + 1
  localStorage.setItem('userUsage', newUsage.toString())
  return newUsage
}

export function decrementUsage(): number {
  if (typeof window === 'undefined') return 0
  const currentUsage = getUserUsage()
  const newUsage = Math.max(0, currentUsage - 1) // Don't go below 0
  localStorage.setItem('userUsage', newUsage.toString())
  return newUsage
}

export function resetUsage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('userUsage')
}

export function hasReachedLimit(): boolean {
  return getUserUsage() >= FREE_LIMIT
}

export function getRemainingUsage(): number {
  return Math.max(0, FREE_LIMIT - getUserUsage())
}

export function isProUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('userSubscription') === 'pro'
}

export function setProUser(isPro: boolean): void {
  if (typeof window === 'undefined') return
  if (isPro) {
    localStorage.setItem('userSubscription', 'pro')
  } else {
    localStorage.removeItem('userSubscription')
  }
}

export const FREE_LIMIT_COUNT = FREE_LIMIT