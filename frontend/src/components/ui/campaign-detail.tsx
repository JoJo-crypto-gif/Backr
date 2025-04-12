"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Share2,
  BookmarkPlus,
  MessageSquare,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CampaignDetailProps {
  campaignId?: string
}

export default function CampaignDetail({ campaignId = "1" }: CampaignDetailProps) {
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState("")

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/campaigns/${campaignId}`)
        if (response.ok) {
          const data = await response.json()
          const raw = data.campaign

          // Format data to match UI expectation
          const formatted = {
            ...raw,
            goalAmount: raw.goalamt,
            raisedAmount: raw.raisedamt,
            creatorBio: raw.creatorId?.bio || "unknown bio",
            creatorAddress: raw.creatorId?.address || "unknown address",
            creatorName: raw.creatorId?.name || "Unknown",
            creatorAvatar: raw.creatorId?.avatar || "/placeholder.svg",
            daysLeft: Math.max(
              0,
              Math.floor(
                (new Date(raw.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          }

          setCampaign(formatted)
          setSelectedImage(formatted.images?.[0] || "/placeholder.svg")
        } else {
          console.error("Campaign not found")
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [campaignId])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 flex items-center justify-center min-h-[50vh] m-auto">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="w-full px-4 md:px-6 py-12 flex items-center justify-center min-h-[50vh] m-auto">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Button>Browse All Campaigns</Button>
        </div>
      </div>
    )
  }

  const percentFunded = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100
  )

  return (
    <div className="px-4 md:px-6 py-8 md:py-12 container m-auto">
      {/* Back button */}
      <div
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all campaigns
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Main image */}
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt={campaign.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Image gallery */}
            {campaign.images && campaign.images.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {campaign.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-md border-2 ${
                      selectedImage === img
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`${campaign.title} image ${idx + 1}`}
                      className="object-cover rounded-md h-full w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Info */}
        <div className="space-y-6 bg-gray-100 border pt-4 px-5 rounded-2xl">
          <div>
            <div className="inline-block bg-[rgba(107,114,128,0.43)] text-primary-fo text-sm px-3 py-1 rounded-full mb-3">
              {campaign.category}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{campaign.title}</h1>
            <p className="text-muted-foreground mt-2">{campaign.description}</p>
          </div>

          {/* Creator */}
          <div className="flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <img
                src={campaign.creatorAvatar}
                alt={campaign.creatorName}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-medium">{campaign.creatorName}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  ${campaign.raisedAmount.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  ${campaign.goalAmount.toLocaleString()} goal
                </span>
              </div>
              <Progress value={percentFunded} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <p className="text-2xl font-bold">
                  {campaign.backers?.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Backers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{campaign.daysLeft}</p>
                <p className="text-sm text-muted-foreground">Days left</p>
              </div>
            </div>

            <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded shadow-sm transition-all hover:shadow-md duration-300 cursor-pointer" size="lg">
              Back this campaign
            </Button>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <BookmarkPlus className="mr-1 h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="story">
          <TabsList className="w-1/3 border-b-gray-800 justify-start rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="story"
              className="rounded-none border-b-2 border-transparent text-gray-500 data-[state=active]:border-b-black data-[state=active]:bg-transparent data-[state=active]:text-black px-4 py-3"
            >
              Story
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent text-gray-500 data-[state=active]:border-b-black data-[state=active]:bg-transparent data-[state=active]:text-black px-4 py-3"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="pt-6">
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 prose max-w-none">
              <div className="whitespace-pre-line">{campaign.story}</div>
            </div>

            <div>
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="font-medium mb-3">About the creator</h3>
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={campaign.creatorAvatar}
                      alt={campaign.creatorName}
                       className="object-cover w-full h-full"
                    />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{campaign.creatorName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{campaign.creatorAddress}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.creatorBio}</p>
                  <Button variant="outline" className="w-full mt-4 bg-gray-700 hover:bg-gray-800 text-white rounded shadow-sm transition-all hover:shadow-md duration-300 cursor-pointer">
                    Contact creator
                  </Button>
                </div>
              </div>
              </div>
          </TabsContent>

          <TabsContent value="comments" className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to comment on this campaign
              </p>
              <Button>Add a comment</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}