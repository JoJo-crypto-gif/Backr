// hooks/useUserCampaigns.ts

import { useEffect, useState } from "react"

interface Campaign {
  _id: string
  title: string
  description: string
  creatorId: string
  raisedamt: number
  status: string
  // Add any other relevant campaign properties you need
}

export function useUserCampaigns(userId: string | undefined) {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchCampaigns = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://localhost:5000/campaigns/user/${userId}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch user campaigns')
        }

        const data = await res.json()
        setCampaigns(data.campaigns)
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message)
        } else {
            setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [userId])

  return { campaigns, loading, error }
}