import { useEffect, useState } from 'react'
import profile from '../assets/collab/profile.webp'
import timetable from '../assets/collab/timetable.webp'
import office from '../assets/collab/office.webp'
import results from '../assets/collab/results.webp'
import { useDepth } from './useDepth'

// The pictures tell one story in order: a student's profile and records, the timetable
// that plans their week, the office that looks after fees and documents, and the
// results everyone celebrates.
const SCENES = [
  { src: profile, alt: 'A student and a teacher looking at a tablet, with profile, calendar and checklist cards floating above them' },
  { src: timetable, alt: 'A student and a teacher planning on a laptop, with a class timetable and reminders floating above them' },
  { src: office, alt: 'An administrator and a parent at a laptop, with fees, documents and staff cards floating above them' },
  { src: results, alt: 'A student and a teacher cheering at a laptop, with progress charts, grades and awards floating above them' },
]

const COLS = 6
const ROWS = 8
const MS_PER_SCENE = 3600
const FLIP_MS = 700
const WAVE_MS_PER_TILE = 75
const BLANK_LEAD_MS = 400 // the first wall waits for the frame to finish swinging in

// Tiles ripple outward from the middle, so the wave of flips starts at the centre.
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const distance = Math.hypot(col - (COLS - 1) / 2, row - (ROWS - 1) / 2)
  return {
    key: i,
    delay: Math.round(distance * WAVE_MS_PER_TILE),
    position: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
  }
})
const WAVE_MS = Math.max(...TILES.map((tile) => tile.delay)) + FLIP_MS + 80

// The picture is a wall of tiles. When the section scrolls into view the wall starts
// blank and the tiles flip over in a ripple from the centre to reveal the first
// picture. To change picture, the wall rips round the same way: every tile flips from
// the old picture to the new one, glowing lime on its edge as it turns. The picture
// then drifts slowly, and the frame tilts with the pointer and leans with the scroll.
// It advances on a timer, pauses on hover, on keyboard focus and when off screen, and
// a click flips to the next picture.
export function CollabShow() {
  const [{ shown, wall }, setScene] = useState({ shown: 0, wall: { from: -1, to: 0, id: 0 } })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const { ref, seen, inView } = useDepth()

  const flip = () =>
    setScene((state) => {
      const to = (state.shown + 1) % SCENES.length
      return { shown: to, wall: { from: state.shown, to, id: state.wall ? state.wall.id + 1 : 1 } }
    })

  // The wall is cleared once its flips are done; the picture under it is already the new one.
  const running = Boolean(wall) && seen
  const wallId = wall ? wall.id : -1
  const wallIsBlank = Boolean(wall) && wall.from < 0
  useEffect(() => {
    if (!running) return undefined
    const timer = setTimeout(
      () => setScene((state) => (state.wall && state.wall.id === wallId ? { ...state, wall: null } : state)),
      WAVE_MS + (wallIsBlank ? BLANK_LEAD_MS : 0),
    )
    return () => clearTimeout(timer)
  }, [running, wallId, wallIsBlank])

  const paused = hovered || focused || !inView || Boolean(wall)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setTimeout(flip, MS_PER_SCENE)
    return () => clearTimeout(timer)
  }, [shown, paused])

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      flip()
    }
  }

  return (
    <div className={`collab${seen ? ' collab--seen' : ''}`} ref={ref}>
      <div
        className="collab__scene"
        role="button"
        tabIndex={0}
        aria-label="Show the next Collab picture"
        onClick={flip}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="collab__tilt">
          <div className="collab__frame">
            <img key={`photo-${shown}`} className="collab__photo" src={SCENES[shown].src} alt={SCENES[shown].alt} width="900" height="1125" decoding="async" />
            {wall && (
              <div
                key={`wall-${wall.id}`}
                className="collab__wall"
                aria-hidden="true"
                data-blank={wallIsBlank || undefined}
                style={{
                  '--from': wall.from >= 0 ? `url(${SCENES[wall.from].src})` : 'none',
                  '--to': `url(${SCENES[wall.to].src})`,
                  '--cols': COLS,
                  '--rows': ROWS,
                  '--flip': `${FLIP_MS}ms`,
                }}
              >
                {TILES.map((tile) => (
                  <span key={tile.key} className="collab__cell">
                    <span className="collab__tile" style={{ '--delay': `${tile.delay}ms`, '--at': tile.position }}>
                      <span className="collab__side collab__side--from" />
                      <span className="collab__side collab__side--to" />
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="collab__shadow" aria-hidden="true" />
      </div>
    </div>
  )
}
