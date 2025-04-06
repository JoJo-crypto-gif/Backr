import React, { useEffect, useRef, useState } from "react"
import {
  Rocket,
  Shield,
  BarChart3,
  Users,
  Smartphone,
  CreditCard,
} from "lucide-react"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md mx-4">
    <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

export default function Features() {
  const features = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Easy Campaign Creation",
      description:
        "Launch your campaign in minutes with our intuitive campaign builder and customizable templates.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description:
        "Rest easy with our bank-level security and transparent payment processing system.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Campaign Analytics",
      description:
        "Track your campaign's performance with real-time analytics and actionable insights.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Engagement",
      description:
        "Build relationships with backers through updates, comments, and direct messaging.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Optimized",
      description:
        "Manage your campaign on the go with our fully responsive mobile experience.",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Low Platform Fees",
      description:
        "Keep more of what you raise with our competitive and transparent fee structure.",
    },
  ]

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`w-full py-5 md:py-24 lg:py-32 bg-muted/50 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <div className="w-full px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Why Choose Our Platform
            </h2>
            <p className="mx-auto w-full text-muted-foreground md:text-xl">
              We provide all the tools you need to successfully fund your
              project and connect with supporters.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
