"use client"

import { useState } from "react"
import avatarSvg from "../../assets/svg/avatar.svg"
import { Star } from "lucide-react"

interface TestimonialProps {
  content: string
  author: string
  role: string
  avatar: string
  rating?: number
}

const Testimonial = ({ content, author, role, avatar, rating = 5 }: TestimonialProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex-shrink-0 w-[300px] md:w-[350px] p-6 mx-4 bg-card rounded-xl shadow-sm border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationPlayState: isHovered ? "paused" : "running" }}
    >
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-muted-foreground mb-6">{content}</p>
      <div className="flex items-center">
        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
          <img src={avatar || avatarSvg} alt={author} className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsScroll() {
  const testimonials: TestimonialProps[] = [
    {
      content: "This platform made it so easy to launch my campaign. I reached my funding goal in just 10 days!",
      author: "Sarah Johnson",
      role: "Entrepreneur",
      avatar: avatarSvg,
      rating: 5,
    },
    {
      content: "The analytics tools helped me understand my audience and optimize my campaign strategy.",
      author: "Michael Chen",
      role: "Product Designer",
      avatar: avatarSvg,
      rating: 5,
    },
    {
      content: "I was hesitant at first, but the support team guided me through every step of the process.",
      author: "Emma Rodriguez",
      role: "Artist",
      avatar: avatarSvg,
      rating: 4,
    },
    {
      content: "The community engagement features helped me build a loyal following for my brand.",
      author: "David Kim",
      role: "Small Business Owner",
      avatar: avatarSvg,
      rating: 5,
    },
    {
      content: "I've used several crowdfunding platforms, and this one offers the best value with the lowest fees.",
      author: "Jessica Taylor",
      role: "Serial Entrepreneur",
      avatar: "../../assets/svg/avatar.svg",
      rating: 5,
    },
    {
      content: "The mobile app made it easy to manage my campaign on the go and respond to backers quickly.",
      author: "Thomas Wright",
      role: "Tech Founder",
      avatar: "../../assets/svg/avatar.svg",
      rating: 4,
    },
    {
      content: "I was able to exceed my funding goal by 200% thanks to the promotional tools provided.",
      author: "Olivia Martinez",
      role: "Fashion Designer",
      avatar: "../../assets/svg/avatar.svg",
      rating: 5,
    },
    {
      content: "The platform's reach helped me connect with backers from around the world.",
      author: "James Wilson",
      role: "Game Developer",
      avatar: "../../assets/svg/avatar.svg",
      rating: 5,
    },
  ]

  // Split testimonials into two rows
  const firstRow = testimonials.slice(0, 4)
  const secondRow = testimonials.slice(4)

  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="w-full py-2 md:py-2 lg:py-2 overflow-hidden bg-muted/30">
      <div className="w-full px-4 md:px-6 mb-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Don't just take our word for it. Here's what creators and backers have to say about our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {/* First row - scrolling right */}
        <div
          className="flex py-4 mb-8 animate-scroll-right"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          <div className="flex">
            {firstRow.map((testimonial, index) => (
              <Testimonial key={`row1-${index}`} {...testimonial} />
            ))}
            {/* Duplicate the testimonials to create a seamless loop */}
            {firstRow.map((testimonial, index) => (
              <Testimonial key={`row1-dup-${index}`} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Second row - scrolling left */}
        <div className="flex py-4 animate-scroll-left" style={{ animationPlayState: isPaused ? "paused" : "running" }}>
          <div className="flex">
            {secondRow.map((testimonial, index) => (
              <Testimonial key={`row2-${index}`} {...testimonial} />
            ))}
            {/* Duplicate the testimonials to create a seamless loop */}
            {secondRow.map((testimonial, index) => (
              <Testimonial key={`row2-dup-${index}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-300px * 4 - 2rem * 4));
          }
        }
        
        @keyframes scrollLeft {
          0% {
            transform: translateX(calc(-300px * 4 - 2rem * 4));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-right {
          animation: scrollRight 30s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scrollLeft 30s linear infinite;
        }
        
        @media (min-width: 768px) {
          @keyframes scrollRight {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-350px * 4 - 2rem * 4));
            }
          }
          
          @keyframes scrollLeft {
            0% {
              transform: translateX(calc(-350px * 4 - 2rem * 4));
            }
            100% {
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </section>
  )
}
