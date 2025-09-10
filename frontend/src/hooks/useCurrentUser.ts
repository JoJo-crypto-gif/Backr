// hooks/useCurrentUser.tsx

import { useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  googleId?: string
  address?: string
  bio?: string
  balance: number
  loading: boolean;
  // Add the new verification fields here
  isVerified?: boolean
  verificationStatus?: 'not applied' | 'pending' | 'approved' | 'denied'
  ghanaCardNumber?: string
  ghanaCardImage?: string
  verificationReason?: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/current_user", {
        credentials: "include",
      })
      const data = await res.json()
      // Create a new user object that includes the loading state
      setUser({ ...data.user, loading: false })
    } catch (error) {
      console.error("Error fetching current user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return { user, loading, refetchUser }
}