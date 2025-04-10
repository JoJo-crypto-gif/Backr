import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { useAnimationFrame } from 'framer-motion'

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.04, // lower = snappier, higher = smoother
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Ensure framer-motion updates along with Lenis
  useAnimationFrame((time) => {
    lenisRef.current?.raf(time)
  })

  return lenisRef
}
