// hooks/useLenis.ts
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Super smooth
      smoothWheel: true,
      // smoothTouch: true,
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

  return lenisRef
}
