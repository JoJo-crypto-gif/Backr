//hooks/useCurrentUser

import { useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  googleId?: string
  loading: boolean; // Notice 'loading' here
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/current_user", {
          credentials: "include",
        })
        const data = await res.json()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
