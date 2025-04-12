"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import axios from "axios"

interface CampaignProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  raisedAmount: number;
  goalAmount: number;
  backers: number;
  daysLeft: string;
  creatorName: string;
  creatorAvatar: string;
}

const CampaignCard = ({ campaign }: { campaign: CampaignProps }) => {
  const percentFunded = Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100)

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-gray-50 text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
      <img
        src={
        campaign.images[0]?.startsWith("http")
         ? campaign.images[0]
          : `http://localhost:5000${campaign.images[0]}`
       }
         alt={campaign.title}
         className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
      <div className="absolute top-2 left-2 bg-[rgba(107,114,128,0.43)] text-black text-xs px-2 py-1 rounded-full font-semibold">
        {campaign.category}
      </div>
      </div>
      <div className="flex flex-col space-y-3 p-4">
        <h3 className="font-bold text-lg line-clamp-1">{campaign.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{campaign.description}</p>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">${campaign.raisedAmount.toLocaleString()}</span>
            <span className="text-muted-foreground">${campaign.goalAmount.toLocaleString()} goal</span>
          </div>
          <Progress value={percentFunded} className="h-2" />
          <div className="flex justify-between text-sm pt-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{campaign.backers.toLocaleString()} backers</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{campaign.daysLeft}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center pt-3 border-t">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <img
              src={campaign.creatorAvatar || "/placeholder.svg"}
              alt={campaign.creatorName}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            by <span className="font-medium text-foreground">{campaign.creatorName}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CampaignGrid() {
  const [visibleCampaigns, setVisibleCampaigns] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<CampaignProps[]>([])

  const baseURL = "http://localhost:5000"

  useEffect(() => {
    axios.get(`${baseURL}/campaigns/all`)
      .then((response) => {
        const rawData = response.data.campaigns

        if (!Array.isArray(rawData)) {
          console.error("Error: Response is not an array", response.data)
          return
        }

        const updatedCampaigns = rawData.map((campaign: any) => {
          const goalAmount = campaign.goalamt || 0

          let daysLeft = 'Ongoing'
          if (campaign.deadline) {
            const deadlineDate = new Date(campaign.deadline)
            const currentDate = new Date()

            if (!isNaN(deadlineDate.getTime())) {
              const timeDiff = deadlineDate.getTime() - currentDate.getTime()
              if (timeDiff > 0) {
                const days = Math.ceil(timeDiff / (1000 * 3600 * 24))
                daysLeft = `${days} days left`
              } else {
                daysLeft = 'Campaign ended'
              }
            } else {
              daysLeft = 'Invalid deadline'
            }
          }

          return {
            id: campaign.campaignId,
            title: campaign.title,
            description: campaign.description,
            images: campaign.images || [],
            category: campaign.category,
            raisedAmount: campaign.raisedamt || 0,
            goalAmount,
            backers: campaign.backers || 0,
            daysLeft,
            creatorName: campaign.creatorId?.name || "Unknown",
            creatorAvatar: campaign.creatorId?.avatar
              ? `${baseURL}${campaign.creatorId.avatar}`
              : "/placeholder.svg"
          }
        })

        setCampaigns(updatedCampaigns)
      })
      .catch((error) => {
        console.error('Error fetching campaigns:', error)
      })
  }, [])

  const loadMoreCampaigns = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCampaigns((prev) => Math.min(prev + 4, campaigns.length))
      setIsLoading(false)
    }, 800)
  }

  const hasMoreCampaigns = visibleCampaigns < campaigns.length

  return (
    <section className="container py-12 m-auto">
      <div className="px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Discover Campaigns</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore innovative projects from creators around the world and help bring their ideas to life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.slice(0, visibleCampaigns).map((campaign) => (
            <Link
              to={`/campaigns/${campaign.id}`}
              key={campaign.id}
              className="transition-transform hover:-translate-y-1 duration-300"
            >
              <CampaignCard campaign={campaign} />
            </Link>
          ))}
        </div>

        {hasMoreCampaigns && (
          <div className="flex justify-center mt-12">
        <Button
          onClick={loadMoreCampaigns}
          disabled={isLoading}
          className="min-w-[200px] cursor-pointer bg-gray-50 shadow-sm transition-all hover:shadow-md hover:scale-105  duration-500" // Added cursor-pointer class
          variant="outline"
          size="lg"
        >
          {isLoading ? "Loading..." : "View More Campaigns"}
        </Button>
          </div>
        )}
      </div>
    </section>
  )
}
