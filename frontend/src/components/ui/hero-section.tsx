import type React from "react"
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import sideimage from "@/assets/images/login.jpg";

interface StatProps {
  icon: React.ReactNode
  value: string
  label: string
}

const Stat = ({ icon, value, label }: StatProps) => (
  <div className="flex items-center gap-2">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
)

export default function Hero() {
  return (
    <section className="w-full overflow-hidden pt-0 pb-12 md:pt-0 md:pb-24 lg:pt-0 lg:pb-32 animate-fade-in">

  <div className="grid grid-cols-1 lg:grid-cols-2">
    {/* Left Side: Content */}
    <div className="px-4 md:px-6 flex flex-col justify-center space-y-4 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Fund your dreams, support others
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl pt-2 m-4">
          Our platform connects innovators with backers. Launch your campaign or discover projects that inspire you.
        </p>
      </div>
      <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
        <Button size="lg" className="gap-1">
          Start a Campaign <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="border bg-gray-50 cursor-pointer hover:shadow">
          Explore Campaigns
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-3">
        <Stat icon={<TrendingUp className="h-5 w-5" />} value="$12M+" label="Funds Raised" />
        <Stat icon={<Users className="h-5 w-5" />} value="15k+" label="Backers" />
        <Stat icon={<Award className="h-5 w-5" />} value="2.5k+" label="Successful Projects" />
      </div>
    </div>

    {/* Right Side: Bleeding Image */}
    <div className="relative">
      <img
        src={sideimage}
        alt="Crowdfunding illustration"
        className="h-full w-full object-cover"
      />
    </div>
  </div>
</section>

  )
}

