import { useEffect, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// How strongly the pointer tilts things. Raise these for a more sensitive feel.
const TILT_X_DEG = 13 // up/down tilt at full pointer travel
const TILT_Y_DEG = 18 // left/right tilt at full pointer travel
const FOLLOW = 0.15 // 0-1, how quickly the tilt catches up with the pointer
const REACH = 0.8 // pointer travel (in half-widths) that counts as full tilt; lower is more sensitive

// Gives an element three things:
//  - `seen`: true once it has scrolled into view (so an entrance can play at that moment)
//  - `inView`: whether it is on screen right now (so timers can pause off screen)
//  - live CSS variables for 3D depth, written straight to the element every frame:
//      --rx / --ry   tilt that follows the pointer (anywhere over the product panel)
//      --sx          tilt that follows the page scroll (leans back when entering, flat at centre)
//      --gx / --gy   glare position, 0-100%
// Nothing re-renders for the variables, and nothing runs while the element is off screen.
export function useDepth() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    // Listen over the whole product panel, so the tilt answers as soon as the pointer is near.
    const target = el.closest('.panel') ?? el
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const pointer = { tx: 0, ty: 0, x: 0, y: 0 }
    let raf = 0

    const onMove = (event) => {
      const box = el.getBoundingClientRect()
      const halfW = (Math.min(box.width, 700) / 2) * REACH
      const halfH = (Math.min(box.height, 600) / 2) * REACH
      pointer.tx = clamp((event.clientX - (box.left + box.width / 2)) / halfW, -1, 1)
      pointer.ty = clamp((event.clientY - (box.top + box.height / 2)) / halfH, -1, 1)
    }
    const onLeave = () => {
      pointer.tx = 0
      pointer.ty = 0
    }

    const frame = () => {
      const box = el.getBoundingClientRect()
      const fromCentre = clamp((box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight, -1, 1)
      pointer.x += (pointer.tx - pointer.x) * FOLLOW
      pointer.y += (pointer.ty - pointer.y) * FOLLOW
      el.style.setProperty('--rx', `${(-pointer.y * TILT_X_DEG).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(pointer.x * TILT_Y_DEG).toFixed(2)}deg`)
      el.style.setProperty('--sx', `${(fromCentre * 14).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(50 + pointer.x * 50).toFixed(1)}%`)
      el.style.setProperty('--gy', `${(50 + pointer.y * 50).toFixed(1)}%`)
      raf = requestAnimationFrame(frame)
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [inView])

  return { ref, seen, inView }
}
