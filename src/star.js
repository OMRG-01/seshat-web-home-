// Geometry for Seshat's seven-pointed star. Every star on the site comes from here,
// so the logo, the favicon and the hero emblem always match.
export function starPoints(cx, cy, outer, inner, points = 7, rotation = -90) {
  const out = []
  for (let i = 0; i < points * 2; i++) {
    const angle = ((rotation + (i * 180) / points) * Math.PI) / 180
    const radius = i % 2 === 0 ? outer : inner
    out.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`)
  }
  return out.join(' ')
}

export const starPath = (...args) => `M${starPoints(...args)}Z`
