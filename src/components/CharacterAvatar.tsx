import greenGirlImg from '../assets/characters/green-girl.png'
import coachImg from '../assets/characters/coach.png'

export type CharacterVariant = 'green' | 'alert' | 'gold'
export type CharacterMood = 'idle' | 'great' | 'okay'

const PALETTE: Record<CharacterVariant, { body: string; accent: string; cheek: string }> = {
  green: { body: '#4ADE80', accent: '#16A34A', cheek: '#FCA5A5' },
  alert: { body: '#F87171', accent: '#B91C1C', cheek: '#FED7AA' },
  gold: { body: '#FBBF24', accent: '#B45309', cheek: '#FCA5A5' },
}

// Real illustrated character art (provided by the teacher) replaces the SVG
// for these two roles. 'alert' has no matching artwork yet, so it still
// falls back to the geometric SVG mascot below. Imported as modules (rather
// than referenced by a raw "/characters/..." path) so Vite bundles them and
// rewrites the URL correctly under the app's base path in both dev and the
// production GitHub Pages build.
const IMAGE_SRC: Partial<Record<CharacterVariant, string>> = {
  green: greenGirlImg,
  gold: coachImg,
}

export function CharacterAvatar({
  variant = 'green',
  mood = 'idle',
  size = 56,
}: {
  variant?: CharacterVariant
  mood?: CharacterMood
  size?: number
}) {
  const imageSrc = IMAGE_SRC[variant]
  if (imageSrc) {
    // Note: the illustrated art is a single fixed pose/expression, so `mood`
    // has no visual effect here (unlike the SVG fallback below).
    return (
      <img
        src={imageSrc}
        alt={variant === 'green' ? 'น้องกรีน' : 'โค้ชโค้ด'}
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    )
  }

  const c = PALETTE[variant]
  const mouth =
    mood === 'great'
      ? 'M36 68 Q50 86 64 68 Q50 80 36 68 Z'
      : mood === 'okay'
        ? 'M40 74 Q50 70 60 74'
        : 'M40 70 Q50 78 60 70'
  const eyeShape = mood === 'great' ? 'arc' : 'dot'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="character">
      {/* body */}
      <circle cx="50" cy="56" r="38" fill={c.body} />
      <circle cx="50" cy="56" r="38" fill="url(#shine)" opacity="0.25" />
      <defs>
        <radialGradient id="shine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* head decoration per variant */}
      {variant === 'green' && (
        <path d="M50 20 C42 10 34 12 34 20 C34 12 50 6 50 20 C50 6 66 12 66 20 C66 12 58 10 50 20 Z" fill={c.accent} />
      )}
      {variant === 'alert' && (
        <>
          <rect x="46" y="6" width="8" height="14" rx="4" fill={c.accent} />
          <circle cx="50" cy="6" r="6" fill="#FEF08A" />
        </>
      )}
      {variant === 'gold' && <path d="M50 18 L56 28 L44 28 Z" fill={c.accent} />}

      {/* eyes */}
      <circle cx="36" cy="52" r="9" fill="white" />
      <circle cx="64" cy="52" r="9" fill="white" />
      {eyeShape === 'dot' ? (
        <>
          <circle cx="37" cy="54" r="4" fill="#1F2937" />
          <circle cx="63" cy="54" r="4" fill="#1F2937" />
        </>
      ) : (
        <>
          <path d="M32 53 Q37 47 42 53" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M58 53 Q63 47 68 53" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* cheeks */}
      <circle cx="27" cy="64" r="5" fill={c.cheek} opacity="0.7" />
      <circle cx="73" cy="64" r="5" fill={c.cheek} opacity="0.7" />

      {/* mouth */}
      <path d={mouth} stroke="#1F2937" strokeWidth="3" fill={mood === 'great' ? '#1F2937' : 'none'} strokeLinecap="round" />
    </svg>
  )
}
