import { useEffect, useState } from 'react'
import register from '../assets/pathogen/register.webp'
import collect from '../assets/pathogen/collect.webp'
import analyze from '../assets/pathogen/analyze.webp'
import report from '../assets/pathogen/report.webp'
import { useDepth } from './useDepth'

// The four pictures follow the path of one sample, in order: a patient checks in,
// the sample is collected and labelled, a pathologist studies it, and the signed
// report is sent back securely.
const STEPS = [
  { src: register, alt: 'A patient checking in with a clinician at the front desk' },
  { src: collect, alt: 'Blood sample tubes with barcode labels beside a scanner and a label printer' },
  { src: analyze, alt: 'A pathologist studying tissue slides under a microscope' },
  { src: report, alt: 'A signed pathology report on a laptop, with a secure confirmation sent to a phone' },
]

const MS_PER_STEP = 3800
const ARRIVAL_MS = 1900

// The four pictures are the four sides of a prism. When the section scrolls into view
// the prism swings in out of the depth and settles; after that it turns a quarter each
// time, so the next picture comes round the corner and a glint crosses it as it lands.
// The whole prism tilts with the pointer and leans with the scroll. It advances on a
// timer, pauses on hover, on keyboard focus and when off screen, and a click turns it
// to the next side.
export function PathoGenShow() {
  const [turns, setTurns] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [arrived, setArrived] = useState(false)
  const { ref, seen, inView } = useDepth()

  const active = turns % STEPS.length
  const turn = () => setTurns((count) => count + 1)

  useEffect(() => {
    if (!seen) return undefined
    const timer = setTimeout(() => setArrived(true), ARRIVAL_MS)
    return () => clearTimeout(timer)
  }, [seen])

  const paused = hovered || focused || !inView || !arrived

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setTimeout(() => setTurns((count) => count + 1), MS_PER_STEP)
    return () => clearTimeout(timer)
  }, [turns, paused])

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      turn()
    }
  }

  return (
    <div className={`patho${seen ? ' patho--seen' : ''}`} ref={ref}>
      <div
        className="patho__scene"
        role="button"
        tabIndex={0}
        aria-label="Show the next PathoGen picture"
        onClick={turn}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="patho__tilt">
          <div className="patho__pulse" data-parity={turns > 0 ? turns % 2 : undefined}>
            <div className="patho__prism" style={{ '--turns': turns }}>
              {STEPS.map((step, i) => (
                <div key={step.src} className={`patho__face${i === active ? ' is-active' : ''}`} style={{ '--side': i }}>
                  <img src={step.src} alt={step.alt} width="900" height="1144" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="patho__shadow" aria-hidden="true" />
      </div>
    </div>
  )
}
