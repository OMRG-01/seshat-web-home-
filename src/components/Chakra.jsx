import { useEffect, useRef } from 'react'
import { starPath } from '../star'

// The hero emblem: a small mechanism built around Seshat's star.
//
// Five layers turn at different speeds and in alternating directions, like gears
// in one wheel. All of them share one angular "momentum": scrolling the page gives
// the wheel a push, and friction brings it back to a steady turn. A fixed pointer at
// the top lets you read the rotation, the way a dial needle does.

const TICKS = 84
const SPOKES = 14

const STAR = starPath(0, 0, 82, 40)
const ECHO = starPath(0, 0, 64, 31, 7, -90 + 180 / 7)
const CORE = starPath(0, 0, 13, 6.2)

// Degrees per second once the wheel is up to speed.
const CRUISE = { dial: 5, star: 12, echo: -7, wheel: -22, core: 36 }
// How strongly each layer picks up a scroll push (same sign as its cruise direction).
const GRIP = { dial: 0.35, star: 1, echo: -0.6, wheel: -1.4, core: 2.2 }

const SPIN_UP_SECONDS = 3.4
const FRICTION = 1.7 // higher stops the extra push sooner
const MAX_PUSH = 200 // degrees per second

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)]
}

const tickLines = Array.from({ length: TICKS }, (_, i) => {
  const deg = (i * 360) / TICKS
  const long = i % 7 === 0
  const [x1, y1] = polar(97, deg)
  const [x2, y2] = polar(long ? 88.5 : 93, deg)
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={long ? 'chakra__tick chakra__tick--long' : 'chakra__tick'} />
})

const spokeLines = Array.from({ length: SPOKES }, (_, i) => {
  const deg = (i * 360) / SPOKES
  const [x1, y1] = polar(18, deg)
  const [x2, y2] = polar(30, deg)
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="chakra__spoke" />
})

export function Chakra() {
  const dial = useRef(null)
  const star = useRef(null)
  const echo = useRef(null)
  const wheel = useRef(null)
  const core = useRef(null)
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const layers = [
      { key: 'dial', el: dial.current },
      { key: 'star', el: star.current },
      { key: 'echo', el: echo.current },
      { key: 'wheel', el: wheel.current },
      { key: 'core', el: core.current },
    ].map((layer) => ({ ...layer, angle: 0 }))

    let push = 0
    let spin = 0
    let last = performance.now()
    let lastY = window.scrollY
    let visible = true
    let raf = 0

    const onScroll = () => {
      const y = window.scrollY
      push = Math.max(-MAX_PUSH, Math.min(MAX_PUSH, push + (y - lastY) * 1.1))
      lastY = y
    }

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (visible) {
        // Smoothstep: the wheel eases up from a standstill instead of starting at full speed.
        spin = Math.min(1, spin + dt / SPIN_UP_SECONDS)
        const eased = spin * spin * (3 - 2 * spin)
        push *= Math.exp(-dt * FRICTION)
        for (const layer of layers) {
          layer.angle = (layer.angle + (CRUISE[layer.key] * eased + push * GRIP[layer.key]) * dt) % 360
          layer.el.setAttribute('transform', `rotate(${layer.angle.toFixed(3)})`)
        }
      }
      raf = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(root.current)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="emblem" aria-hidden="true" ref={root}>
      <svg className="chakra" viewBox="-106 -106 212 212" shapeRendering="geometricPrecision">
        <circle className="chakra__ring chakra__ring--outer" r="98.5" />

        <g ref={dial} className="chakra__layer chakra__dial">
          {tickLines}
        </g>

        <g ref={echo} className="chakra__layer">
          <path className="chakra__echo" d={ECHO} />
        </g>

        <g ref={star} className="chakra__layer">
          <path className="chakra__body" d={STAR} />
          <path className="chakra__edge" d={STAR} pathLength="1" />
        </g>

        <g ref={wheel} className="chakra__layer chakra__wheel">
          <circle className="chakra__ring" r="30" />
          <circle className="chakra__ring" r="18" />
          {spokeLines}
        </g>

        <g ref={core} className="chakra__layer">
          <path className="chakra__core" d={CORE} />
        </g>

        <circle className="chakra__hub" r="2.6" />
        <path className="chakra__pointer" d="M0 -97.2 L-3.4 -105 L3.4 -105 Z" />
      </svg>
    </div>
  )
}
