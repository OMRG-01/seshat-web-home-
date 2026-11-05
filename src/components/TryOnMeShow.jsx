import { useEffect, useState } from 'react'
import floralDress from '../assets/tryonme/floral-dress.webp'
import oliveShirt from '../assets/tryonme/olive-shirt.webp'
import burgundyTop from '../assets/tryonme/burgundy-top.webp'
import creamHoodie from '../assets/tryonme/cream-hoodie.webp'
import { useDepth } from './useDepth'

const LOOKS = [
  { src: floralDress, name: 'Floral dress', alt: 'Illustrated model wearing a tiered floral dress' },
  { src: oliveShirt, name: 'Olive shirt', alt: 'Illustrated model wearing an olive shirt and cargo trousers' },
  { src: burgundyTop, name: 'Burgundy top', alt: 'Illustrated model wearing a burgundy knit top and wide trousers' },
  { src: creamHoodie, name: 'Cream hoodie', alt: 'Illustrated model wearing a cream hoodie and dark cargo trousers' },
]

const MS_PER_LOOK = 3000
const ARRIVAL_MS = 2000

// Which card lands first when the section scrolls into view, by rank: the back card
// drops in first and the front card lands last.
const ARRIVAL_ORDER = [3, 2, 0, 1]

// A fan of photo cards in real 3D. When the section scrolls into view the cards fly in
// from behind and land in the fan one by one, then a shine crosses the front card.
// After that the front card lifts toward you, swings behind the others, and the next
// card comes forward. The whole fan tilts with the pointer and leans with the scroll.
// A card's place comes from its rank (0 front, then right, back, left); CSS turns that
// into a position, a tilt and a depth. Clicking a card brings it to the front.
export function TryOnMeShow() {
  const [{ active, prev }, setLook] = useState({ active: 0, prev: null })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [arrived, setArrived] = useState(false)
  const { ref, seen, inView } = useDepth()

  const go = (index) => setLook((state) => (state.active === index ? state : { active: index, prev: state.active }))

  useEffect(() => {
    if (!seen) return undefined
    const timer = setTimeout(() => setArrived(true), ARRIVAL_MS)
    return () => clearTimeout(timer)
  }, [seen])

  const paused = hovered || focused || !inView || !arrived

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setTimeout(() => setLook((state) => ({ active: (state.active + 1) % LOOKS.length, prev: state.active })), MS_PER_LOOK)
    return () => clearTimeout(timer)
  }, [active, paused])

  return (
    <div
      className={`tryon${seen ? ' tryon--seen' : ''}${seen && !arrived ? ' tryon--arriving' : ''}`}
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="tryon__scene">
        <div className="tryon__stack">
          {LOOKS.map((item, i) => {
            const rank = (i - active + LOOKS.length) % LOOKS.length
            return (
              <button
                key={item.name}
                type="button"
                className={`tryon__card${i === prev ? ' is-leaving' : ''}`}
                data-rank={rank}
                style={{ '--order': ARRIVAL_ORDER[rank] }}
                aria-label={`Show ${item.name}`}
                aria-current={rank === 0}
                onClick={() => go(i)}
              >
                <img src={item.src} alt={item.alt} width="468" height="765" decoding="async" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
