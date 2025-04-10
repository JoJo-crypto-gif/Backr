import React, { useState, useRef, useEffect } from "react"
import {
  UserPlus,
  Rocket,
  MessageSquare,
  Wallet,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  image: string
}

const Step = ({ number, icon, title, description, image }: StepProps) => (
  <div className="min-w-[90%] sm:min-w-full px-4 md:px-8 snap-center transition-transform duration-300">
    <div className="overflow-hidden rounded-xl bg-card shadow">
      <div className="relative h-[250px] sm:h-[300px] md:h-[350px] w-full">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Step {number}</span>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
)

export default function HowItWorksCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const steps: StepProps[] = [
    {
      number: 1,
      icon: <UserPlus className="h-5 w-5" />,
      title: "Create an Account",
      description:
        "Sign up in minutes with your email or social media accounts to get started on your crowdfunding journey.",
      image: "https://unsplash.com/photos/black-flat-screen-computer-monitor-1Epkd54_kMA",
    },
    {
      number: 2,
      icon: <Rocket className="h-5 w-5" />,
      title: "Launch Your Campaign",
      description:
        "Use our intuitive tools to build your campaign page with images, videos, and your compelling story.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      number: 3,
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Share Your Story",
      description:
        "Spread the word through social media, email, and our community of potential backers to gain support.",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80",
    },
    {
      number: 4,
      icon: <Wallet className="h-5 w-5" />,
      title: "Receive Funding",
      description:
        "Watch your campaign grow as supporters contribute to help you reach your funding goal and bring your idea to life.",
      image: "https://images.unsplash.com/photo-1581092334601-16d3aee9b5bd?auto=format&fit=crop&w=800&q=80",
    },
    {
      number: 5,
      icon: <Users className="h-5 w-5" />,
      title: "Engage with Supporters",
      description:
        "Keep backers updated on your progress and build a community around your project for long-term success.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    },
  ]

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      })
      setCurrentSlide(index)
    }
  }

  const handlePrevious = () => {
    const newIndex = currentSlide === 0 ? steps.length - 1 : currentSlide - 1
    scrollToSlide(newIndex)
  }

  const handleNext = () => {
    const newIndex = (currentSlide + 1) % steps.length
    scrollToSlide(newIndex)
  }

  // AutoPlay Effect
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      handleNext()
    }, 2000) 

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [currentSlide])

  // Track scroll to sync indicator
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft
        const slideWidth = carouselRef.current.clientWidth
        const newIndex = Math.round(scrollPosition / slideWidth)
        if (newIndex !== currentSlide) {
          setCurrentSlide(newIndex)
        }
      }
    }

    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll)
      return () => carousel.removeEventListener("scroll", handleScroll)
    }
  }, [currentSlide])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Getting your project funded is simple with our easy-to-follow process.
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory transition-transform duration-300 ease-in-out scrollbar-hide"
          >
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 shadow-md"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentSlide ? "bg-primary" : "bg-muted"
              }`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
