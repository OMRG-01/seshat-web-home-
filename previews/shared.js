// Shared helpers for the three design previews: the Seshat star mark and the
// small product illustrations. Colours come from CSS variables set by each page:
//   --art-line  outlines     --art-soft  quiet fills
//   --art-hi    neon accent  --art-bg    surface behind the art
const SVG_NS = 'http://www.w3.org/2000/svg'

// Seven-pointed star, the symbol Seshat wears above her head.
function starPoints(cx, cy, outer, inner, points = 7, rotation = -90) {
  const out = []
  for (let i = 0; i < points * 2; i++) {
    const angle = ((rotation + (i * 180) / points) * Math.PI) / 180
    const radius = i % 2 === 0 ? outer : inner
    out.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`)
  }
  return out.join(' ')
}

document.querySelectorAll('svg[data-star]').forEach((svg) => {
  svg.setAttribute('viewBox', '-100 -100 200 200')
  svg.setAttribute('aria-hidden', 'true')
  const poly = document.createElementNS(SVG_NS, 'polygon')
  poly.setAttribute('points', starPoints(0, 0, 92, 44))
  poly.setAttribute('class', 'star-shape')
  svg.appendChild(poly)
})

const ART = {
  tryonme: () => `
    <rect x="112" y="14" width="96" height="212" rx="18" fill="var(--art-bg)" stroke="var(--art-line)" stroke-width="2"/>
    <rect x="148" y="22" width="24" height="5" rx="2.5" fill="var(--art-line)" opacity=".35"/>
    <circle cx="160" cy="68" r="14" fill="none" stroke="var(--art-line)" stroke-width="2"/>
    <path d="M127 134 C127 102 143 90 160 90 C177 90 193 102 193 134 L189 200 L131 200 Z" fill="var(--art-hi)" stroke="var(--art-line)" stroke-width="2" stroke-linejoin="round"/>
    <g stroke="var(--art-line)" stroke-width="1.5" fill="none">
      <path d="M44 112 H125" stroke-dasharray="3 4"/><path d="M44 106 V118"/>
      <path d="M196 150 H276" stroke-dasharray="3 4"/><path d="M276 144 V156"/>
    </g>
    <rect x="22" y="96" width="46" height="20" rx="10" fill="var(--art-bg)" stroke="var(--art-line)" stroke-width="1.5"/>
    <text x="45" y="110" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--art-line)" font-family="inherit">chest</text>
    <rect x="252" y="134" width="46" height="20" rx="10" fill="var(--art-bg)" stroke="var(--art-line)" stroke-width="1.5"/>
    <text x="275" y="148" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--art-line)" font-family="inherit">waist</text>
    <rect x="140" y="206" width="40" height="14" rx="7" fill="var(--art-line)"/>
    <text x="160" y="216.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--art-bg)" font-family="inherit">Size M</text>`,

  collab: () => {
    const rows = [38, 86, 134]
      .map(
        (y, i) => `
      <rect x="36" y="${y}" width="216" height="38" rx="11" fill="var(--art-soft)" stroke="var(--art-line)" stroke-width="1.5"/>
      <circle cx="58" cy="${y + 19}" r="8" fill="${i === 0 ? 'var(--art-hi)' : 'none'}" stroke="var(--art-line)" stroke-width="1.5"/>
      ${i === 0 ? `<path d="M54 ${y + 19} l3 3 l6 -6" fill="none" stroke="var(--art-line)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      <rect x="76" y="${y + 12}" width="${[110, 84, 130][i]}" height="6" rx="3" fill="var(--art-line)" opacity=".75"/>
      <rect x="76" y="${y + 23}" width="${[60, 90, 50][i]}" height="5" rx="2.5" fill="var(--art-line)" opacity=".3"/>`,
      )
      .join('')
    return `
      ${rows}
      <g transform="translate(228 72)">
        <path d="M0 0 L0 20 L5.5 14.5 L9.5 24 L13 22.5 L9 13.5 L16.5 13.5 Z" fill="var(--art-hi)" stroke="var(--art-line)" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="14" y="22" width="28" height="18" rx="9" fill="var(--art-hi)" stroke="var(--art-line)" stroke-width="1.5"/>
        <text x="28" y="34.5" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--art-line)" font-family="inherit">Ama</text>
      </g>
      <g transform="translate(150 176)">
        <path d="M0 0 L0 20 L5.5 14.5 L9.5 24 L13 22.5 L9 13.5 L16.5 13.5 Z" fill="var(--art-line)" stroke="var(--art-bg)" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="14" y="22" width="28" height="18" rx="9" fill="var(--art-line)"/>
        <text x="28" y="34.5" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--art-bg)" font-family="inherit">Ravi</text>
      </g>
      <g stroke="var(--art-bg)" stroke-width="2">
        <circle cx="262" cy="22" r="11" fill="var(--art-hi)"/><circle cx="278" cy="22" r="11" fill="var(--art-line)"/><circle cx="294" cy="22" r="11" fill="var(--art-soft)"/>
      </g>`
  },

  pathogen: () => {
    const hot = new Set([4, 13, 14, 22, 23, 31, 32, 33])
    let cells = ''
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        const i = r * 9 + c
        cells += `<circle cx="${42 + c * 29}" cy="${36 + r * 26}" r="8.5" fill="${hot.has(i) ? 'var(--art-hi)' : 'var(--art-soft)'}" stroke="var(--art-line)" stroke-width="${hot.has(i) ? 1.6 : 1}" opacity="${hot.has(i) ? 1 : 0.85}"/>`
      }
    }
    const heights = [26, 40, 22, 52, 34, 62, 30, 46, 24, 38, 56, 28]
    const bars = heights
      .map((h, i) => `<rect x="${42 + i * 22}" y="${222 - h}" width="13" height="${h}" rx="3" fill="${i === 5 || i === 10 ? 'var(--art-hi)' : 'var(--art-line)'}" opacity="${i === 5 || i === 10 ? 1 : 0.55}"/>`)
      .join('')
    return `
      ${cells}
      <circle cx="145" cy="88" r="40" fill="none" stroke="var(--art-line)" stroke-width="2.5"/>
      <path d="M174 117 L204 147" stroke="var(--art-line)" stroke-width="5" stroke-linecap="round"/>
      <path d="M42 222 H290" stroke="var(--art-line)" stroke-width="1.5"/>
      ${bars}`
  },
}

document.querySelectorAll('svg[data-art]').forEach((svg) => {
  svg.setAttribute('viewBox', '0 0 320 240')
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-label', svg.dataset.label || '')
  svg.innerHTML = ART[svg.dataset.art]()
})
