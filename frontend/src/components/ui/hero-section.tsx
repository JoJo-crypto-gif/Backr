"use client"

import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import medicalImage from "@/assets/images/medical.jpg";

export default function HeroSection() {
  const animationRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [imagePositions, setImagePositions] = useState<Array<{ x: number; y: number; vx: number; vy: number }>>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const categories = [
    { name: "Your cause", image: medicalImage, progress: 75 },
    { name: "Medical", image: medicalImage, progress: 85 },
    { name: "Emergency", image: medicalImage, progress: 60 },
    { name: "Education", image: medicalImage, progress: 45 },
    { name: "Animal", image: medicalImage, progress: 90 },
    { name: "Business", image: medicalImage, progress: 30 },
  ]

  // Initialize image positions
  useEffect(() => {
    // Initialize with positions around the rectangle
    const initialPositions = categories.map((_, index) => {
      const { x, y } = calculateRectPosition(index, categories.length, 0)
      return { x, y, vx: 0, vy: 0 }
    })
    setImagePositions(initialPositions)
  }, [])

  // Animation logic using requestAnimationFrame for smooth animation
  useEffect(() => {
    let lastTime = 0
    const speed = 0.03 // Even slower for smoother animation
    const collisionDistance = 100 // Distance at which images start to repel each other
    const repulsionStrength = 0.5 // Strength of the repulsion force
    const damping = 0.8 // Damping factor for velocity

    const animate = (time: number) => {
      if (lastTime !== 0) {
        const deltaTime = time - lastTime
        const deltaSeconds = deltaTime / 1000

        // Update progress for base path movement
        setProgress((prev) => (prev + speed * deltaSeconds) % 1)

        // Update image positions with collision detection
        setImagePositions((prevPositions) => {
          // Calculate target positions based on the rectangular path
          const targetPositions = categories.map((_, index) => {
            return calculateRectPosition(index, categories.length, progress)
          })

          // Update positions with physics and collisions
          return prevPositions.map((pos, i) => {
            // Skip physics for hovered item
            if (i === hoveredIndex) {
              return { ...pos, x: targetPositions[i].x, y: targetPositions[i].y, vx: 0, vy: 0 }
            }

            // Calculate spring force towards target position
            const targetX = targetPositions[i].x
            const targetY = targetPositions[i].y
            const springStrength = 2.0 // Strength of attraction to path

            // Spring forces
            let fx = (targetX - pos.x) * springStrength
            let fy = (targetY - pos.y) * springStrength

            // Collision forces
            prevPositions.forEach((otherPos, j) => {
              if (i !== j) {
                const dx = pos.x - otherPos.x
                const dy = pos.y - otherPos.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < collisionDistance) {
                  // Calculate repulsion force
                  const force = repulsionStrength * (1 - distance / collisionDistance)
                  const angle = Math.atan2(dy, dx)
                  fx += Math.cos(angle) * force * 10
                  fy += Math.sin(angle) * force * 10
                }
              }
            })

            // Update velocity with forces and damping
            const vx = pos.vx * damping + fx * deltaSeconds
            const vy = pos.vy * damping + fy * deltaSeconds

            // Update position
            const x = pos.x + vx * deltaSeconds
            const y = pos.y + vy * deltaSeconds

            return { x, y, vx, vy }
          })
        })
      }

      lastTime = time
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [progress, hoveredIndex])

  // Function to calculate position on a rounded rectangular path with smooth corners
  const calculateRectPosition = (itemIndex: number, totalItems: number, currentProgress: number) => {
    // Rectangle dimensions
    const rectWidth = 500
    const rectHeight = 300
    const cornerRadius = 50 // Radius for rounded corners

    // Calculate the position of each item along the perimeter with even spacing
    const itemProgress = (itemIndex / totalItems + currentProgress) % 1

    // Calculate the total perimeter length including the rounded corners
    const straightEdgesLength = 2 * (rectWidth + rectHeight - 4 * cornerRadius)
    const curvedEdgesLength = 2 * Math.PI * cornerRadius
    const perimeter = straightEdgesLength + curvedEdgesLength

    // Calculate distance along the perimeter
    const distanceAlongPerimeter = itemProgress * perimeter

    let x = 0
    let y = 0

    // Helper function for easing transitions
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    // Top edge (excluding corners)
    if (distanceAlongPerimeter < rectWidth - 2 * cornerRadius) {
      x = cornerRadius + distanceAlongPerimeter
      y = -rectHeight / 2
    }
    // Top-right corner
    else if (distanceAlongPerimeter < rectWidth - 2 * cornerRadius + curvedEdgesLength / 4) {
      const t = (distanceAlongPerimeter - (rectWidth - 2 * cornerRadius)) / (curvedEdgesLength / 4)
      const angle = easeInOutCubic(t) * (Math.PI / 2)
      x = rectWidth / 2 - cornerRadius + cornerRadius * Math.cos(angle)
      y = -rectHeight / 2 + cornerRadius - cornerRadius * Math.sin(angle)
    }
    // Right edge (excluding corners)
    else if (
      distanceAlongPerimeter <
      rectWidth - 2 * cornerRadius + curvedEdgesLength / 4 + rectHeight - 2 * cornerRadius
    ) {
      const d = distanceAlongPerimeter - (rectWidth - 2 * cornerRadius + curvedEdgesLength / 4)
      x = rectWidth / 2
      y = -rectHeight / 2 + cornerRadius + d
    }
    // Bottom-right corner
    else if (
      distanceAlongPerimeter <
      rectWidth - 2 * cornerRadius + curvedEdgesLength / 4 + rectHeight - 2 * cornerRadius + curvedEdgesLength / 4
    ) {
      const t =
        (distanceAlongPerimeter -
          (rectWidth - 2 * cornerRadius + curvedEdgesLength / 4 + rectHeight - 2 * cornerRadius)) /
        (curvedEdgesLength / 4)
      const angle = easeInOutCubic(t) * (Math.PI / 2) + Math.PI / 2
      x = rectWidth / 2 - cornerRadius + cornerRadius * Math.cos(angle)
      y = rectHeight / 2 - cornerRadius - cornerRadius * Math.sin(angle)
    }
    // Bottom edge (excluding corners)
    else if (
      distanceAlongPerimeter <
      2 * rectWidth - 4 * cornerRadius + curvedEdgesLength / 2 + rectHeight - 2 * cornerRadius
    ) {
      const d =
        distanceAlongPerimeter -
        (rectWidth - 2 * cornerRadius + curvedEdgesLength / 4 + rectHeight - 2 * cornerRadius + curvedEdgesLength / 4)
      x = rectWidth / 2 - cornerRadius - d
      y = rectHeight / 2
    }
    // Bottom-left corner
    else if (
      distanceAlongPerimeter <
      2 * rectWidth - 4 * cornerRadius + curvedEdgesLength / 2 + rectHeight - 2 * cornerRadius + curvedEdgesLength / 4
    ) {
      const t =
        (distanceAlongPerimeter -
          (2 * rectWidth - 4 * cornerRadius + curvedEdgesLength / 2 + rectHeight - 2 * cornerRadius)) /
        (curvedEdgesLength / 4)
      const angle = easeInOutCubic(t) * (Math.PI / 2) + Math.PI
      x = -rectWidth / 2 + cornerRadius + cornerRadius * Math.cos(angle)
      y = rectHeight / 2 - cornerRadius - cornerRadius * Math.sin(angle)
    }
    // Left edge (excluding corners)
    else if (
      distanceAlongPerimeter <
      2 * rectWidth -
        4 * cornerRadius +
        curvedEdgesLength / 2 +
        2 * rectHeight -
        4 * cornerRadius +
        curvedEdgesLength / 4
    ) {
      const d =
        distanceAlongPerimeter -
        (2 * rectWidth -
          4 * cornerRadius +
          curvedEdgesLength / 2 +
          rectHeight -
          2 * cornerRadius +
          curvedEdgesLength / 4)
      x = -rectWidth / 2
      y = rectHeight / 2 - cornerRadius - d
    }
    // Top-left corner
    else {
      const t =
        (distanceAlongPerimeter -
          (2 * rectWidth -
            4 * cornerRadius +
            curvedEdgesLength / 2 +
            2 * rectHeight -
            4 * cornerRadius +
            curvedEdgesLength / 4)) /
        (curvedEdgesLength / 4)
      const angle = easeInOutCubic(t) * (Math.PI / 2) + (3 * Math.PI) / 2
      x = -rectWidth / 2 + cornerRadius + cornerRadius * Math.cos(angle)
      y = -rectHeight / 2 + cornerRadius - cornerRadius * Math.sin(angle)
    }

    return { x, y }
  }

  // Function to calculate the SVG path for the circular progress
  const calculateCircularProgress = (percent: number) => {
    const radius = 42 // Adjusted to match the image size (80px) + padding
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return {
      radius,
      circumference,
      offset,
    }
  }

  // Component for the circular progress image
  const CircularProgressImage = ({ category }: { category: (typeof categories)[0] }) => {
    const { radius, circumference, offset } = calculateCircularProgress(category.progress)

    return (
      <div className="relative flex items-center justify-center">
        {/* SVG Progress Circle - positioned absolutely to center it */}
        <svg width="100" height="100" className="absolute">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Image - centered within the SVG */}
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md z-10">
        <img
  src={category.image || "/placeholder.svg"}
  alt={category.name}
  className="w-20 h-20 object-cover rounded"
/>

        </div>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white" />
      </div>

      {/* Main content with surrounding images */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Central content with rectangular path images */}
        <div className="relative mx-auto max-w-3xl">
          {/* Central text content */}
          <div className="relative z-0 text-center">
            <div className="py-16 md:py-24">
              {/* Semi-transparent background for better text readability */}
              <div className="absolute inset-0 left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 backdrop-blur-sm"></div>

              <h1 className="relative text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Successful fundraisers start here
              </h1>
              <p className="relative mt-3 text-xl font-medium text-gray-600">#1 crowdfunding platform</p>
              <div className="relative mt-8">
                <Button className="h-12 px-8 text-base font-medium">Start a GoFundMe</Button>
              </div>
            </div>
          </div>

          {/* Desktop layout - images moving in rectangular path with physics */}
          <div className="absolute inset-0 hidden md:block">
            {categories.map((category, index) => {
              // Get position from state (includes physics)
              const position = imagePositions[index] || { x: 0, y: 0 }

              return (
                <Link
                  key={category.name}
                  to="#"
                  className="absolute left-1/2 top-1/2 z-10 hover:z-20"
                  style={{
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                    transition: hoveredIndex === index ? "transform 0.2s ease-out, scale 0.2s ease-out" : "none",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="flex flex-col items-center transform transition-transform duration-200"
                    style={{
                      transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <CircularProgressImage category={category} />
                    <span className="mt-2 text-center text-sm font-medium text-gray-700 bg-white/80 px-2 rounded-full">
                      {category.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile layout - grid of circles with progress */}
        <div className="mt-8 grid grid-cols-3 gap-6 md:hidden">
          {categories.map((category) => (
            <Link key={category.name} to="#" className="flex flex-col items-center">
              <CircularProgressImage category={category} />
              <span className="mt-2 text-sm font-medium text-gray-700">{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Supporting text */}
        <div className="container mx-auto mt-16 max-w-3xl px-4 text-center">
          <p className="text-2xl font-bold text-gray-900">More than $50 million is raised every week on GoFundMe.*</p>
          <p className="mt-4 text-lg text-gray-600">
            Get started in just a few minutes — with helpful new tools, it's easier than ever to pick the perfect title,
            write a compelling story, and share it with the world.
          </p>
        </div>

        {/* Key benefits */}
        <div className="container mx-auto mt-16 px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
              <p className="text-xl font-bold text-gray-900">No fee to start fundraising</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
              <p className="text-xl font-bold text-gray-900">1 donation made every second</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
              <p className="text-xl font-bold text-gray-900">50K+ fundraisers started daily</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="container mx-auto mt-8 px-4 text-center text-xs text-gray-500">
          *Based on average weekly fundraising data from 2022.
        </div>
      </div>
    </section>
  )
}

