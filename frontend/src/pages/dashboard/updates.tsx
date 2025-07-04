// In src/pages/CampaignUpdatesPage.tsx

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { DashboardShell } from "@/components/ui/dashboard/shell"
import { DashboardHeader } from "@/components/ui/dashboard/header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useCampaignUpdates } from "@/hooks/useCampaignUpdates" // ✅ Import the hook
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card" // Assuming you have a Card component for display
import { format } from "date-fns"

export default function CampaignUpdatesPage() {
  const [searchParams] = useSearchParams()
  const campaignId = searchParams.get("campaignId")

  // ✅ Use the hook here
  const { updates, loading: updatesLoading, error: updatesError, refetch: refetchUpdates } = useCampaignUpdates(campaignId || ""); // Provide a default empty string if campaignId is null

  const [campaignTitle, setCampaignTitle] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [posting, setPosting] = useState(false) // Renamed from 'loading' to 'posting' to avoid conflict
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return

      try {
        const res = await fetch(`http://localhost:5000/campaigns/${campaignId}`)
        const data = await res.json()
        if (data.success) {
          setCampaignTitle(data.campaign.title)
        } else {
          setMessage("Failed to fetch campaign")
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
        setMessage("Error loading campaign")
      }
    }

    fetchCampaign()
  }, [campaignId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImage(file || null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !campaignId) {
      setMessage("❌ Title and content are required.")
      return
    }

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("content", content.trim())
    if (image) formData.append("image", image)

    setPosting(true) // ✅ Using 'posting' state
    try {
      const res = await fetch(`http://localhost:5000/api/updates/${campaignId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setMessage("✅ Update posted successfully.")
        setTitle("")
        setContent("")
        setImage(null)
        setImagePreview(null)
        refetchUpdates(); // ✅ Refetch updates after a successful post
      } else {
        setMessage(data.message || "❌ Failed to post update")
      }
    } catch (err) {
      console.error("Error posting update:", err)
      setMessage("❌ An error occurred while posting update.")
    } finally {
      setPosting(false) // ✅ Using 'posting' state
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={campaignTitle ? `Updates for: ${campaignTitle}` : "Campaign Updates"}
        text="Share the latest news with your supporters."
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full space-y-6 mx-auto mt-10 bg-white p-6 shadow-lg rounded-md"
      >
        <Input
          type="text"
          placeholder="Update title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="What's the latest with your campaign?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />
        <div>
          <label className="block mb-2 text-sm font-medium">Upload image (optional)</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full h-auto rounded border"
            />
          )}
        </div>
        <Button type="submit" disabled={posting}> {/* ✅ Use 'posting' state */}
          {posting ? "Posting..." : "Post Update"} {/* ✅ Use 'posting' state */}
        </Button>
        {message && <p className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </form>

      {/* --- Display Previous Updates Section --- */}
      <div className="max-w-xl w-full space-y-6 mx-auto mt-10">
        <h2 className="text-2xl font-bold">Previous Updates</h2>
        {updatesLoading ? (
          <p>Loading updates...</p>
        ) : updatesError ? (
          <p className="text-red-500">Error fetching updates: {updatesError}</p>
        ) : updates.length === 0 ? (
          <p>No updates yet. Be the first to post one!</p>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update._id}>
                <CardHeader>
                  <CardTitle>{update.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Posted on {format(new Date(update.createdAt), "PPP at p")} {/* Formats date */}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{update.content}</p> {/* preserve whitespace */}
                  {update.image && (
                    <img
                      src={update.image}
                      alt={update.title}
                      className="mt-4 max-w-full h-auto rounded-md"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}