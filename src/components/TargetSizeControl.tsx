const PRESETS = [20, 40, 100, 200]

const SLIDER_MIN = 5
const SLIDER_MAX = 500

interface TargetSizeControlProps {
  value: number
  onChange: (kb: number) => void
  id?: string
  compact?: boolean
}

export function TargetSizeControl({
  value,
  onChange,
  id = 'target-size',
  compact = false,
}: TargetSizeControlProps) {
  const sliderValue = Math.min(Math.max(value, SLIDER_MIN), SLIDER_MAX)

  return (
    <div className={`target-size${compact ? ' target-size-compact' : ''}`}>
      <div className="target-size-label-row">
        <label htmlFor={id}>Target size</label>
        <div className="target-size-input">
          <input
            id={id}
            type="number"
            min={5}
            max={51200}
            value={value}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (!Number.isNaN(next)) onChange(next)
            }}
          />
          <span className="unit">KB</span>
        </div>
      </div>

      <input
        type="range"
        className="target-size-slider"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={1}
        value={sliderValue}
        aria-labelledby={id}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="target-size-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`preset${value === preset ? ' preset-active' : ''}`}
            onClick={() => onChange(preset)}
          >
            {preset < 1000 ? `${preset}KB` : `${preset / 1024}MB`}
          </button>
        ))}
      </div>
    </div>
  )
}
