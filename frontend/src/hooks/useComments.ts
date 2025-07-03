"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface User {
  _id: string
  name: string
  avatar?: string
}

interface Comment {
  _id: string
  campaignId: string
  userId: User
  text: string
  createdAt: string
  updatedAt: string
}

export function useComments(campaignId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/comments/${campaignId}`, { withCredentials: true })
      if (response.data.success) {
        setComments(response.data.comments)
        setError(null)
      } else {
        setError("Failed to load comments")
      }
    } catch (err: any) {
      setError("Error loading comments")
      console.error("Error fetching comments:", err)
    } finally {
      setLoading(false)
    }
  }

  const postComment = async (text: string) => {
    if (!text.trim()) return false

    try {
      setPosting(true)
      const response = await axios.post(
        `http://localhost:5000/api/comments/${campaignId}`,
        { text: text.trim() },
        { withCredentials: true }
      )

      if (response.data.success && response.data.comment) {
        setComments((prev) => [response.data.comment, ...prev])
        setError(null)
        return true
      } else {
        setError(response.data.message || "Failed to post comment")
        return false
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Please log in to post a comment")
      } else {
        setError("Error posting comment")
      }
      return false
    } finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    if (campaignId) {
      fetchComments()
    }
  }, [campaignId])

  return {
    comments,
    loading,
    posting,
    error,
    postComment,
    refetch: fetchComments,
  }
}
