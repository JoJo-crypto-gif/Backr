// In src/hooks/useCampaignUpdates.ts (or .js)

import { useState, useEffect } from "react"
import axios from "axios"

export interface CampaignUpdate {
  _id: string
  campaignId: string
  title: string // ✅ Corrected: Expects 'title'
  content: string // ✅ Added: Expects 'content'
  image?: string
  createdAt: string
  updatedAt: string
}

export function useCampaignUpdates(campaignId: string) {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUpdates = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/updates/${campaignId}`, {
        withCredentials: true,
      })

      if (res.data.success) {
        setUpdates(res.data.updates)
        setError(null)
      } else {
        setError("Failed to load updates")
      }
    } catch (err) {
      console.error("Error fetching updates:", err)
      setError("Error loading updates")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Corrected: `postUpdate` now accepts `title` and `content`
  const postUpdate = async (title: string, content: string, imageFile?: File) => {
    if (!title.trim() || !content.trim()) return false // Basic validation

    try {
      setPosting(true)

      const formData = new FormData()
      formData.append("title", title)       // ✅ Appending 'title'
      formData.append("content", content)   // ✅ Appending 'content'
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const res = await axios.post(
        `http://localhost:5000/api/updates/${campaignId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (res.data.success && res.data.update) {
        setUpdates((prev) => [res.data.update, ...prev])
        setError(null)
        return true
      } else {
        setError(res.data.message || "Failed to post update")
        return false
      }
    } catch (err) {
      console.error("Error posting update:", err)
      setError("Error posting update")
      return false
    } finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    if (campaignId) {
      fetchUpdates()
    }
  }, [campaignId])

  return {
    updates,
    loading,
    posting,
    error,
    postUpdate, // Ensure this is exported if you plan to use it elsewhere
    refetch: fetchUpdates,
  }
}