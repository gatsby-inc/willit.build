import React from "react"
import { useTheme } from "@modules/ui/components/ThemeProvider"
import { DetailsChartDimensions } from "../constants"

function CustomDot(prop) {
  const { cx, cy, dataKey, active = false } = prop

  if (!cx || !cy) {
    return null
  }

  const {
    ActiveDotRadius,
    ActiveDotDiam,
    ActiveDotInnerRadius,
  } = DetailsChartDimensions
  const { tones } = useTheme()

  return (
    <svg
      x={cx - ActiveDotRadius}
      y={cy - ActiveDotRadius}
      width={ActiveDotDiam}
      height={ActiveDotDiam}
      viewBox={`0 0 ${ActiveDotDiam} ${ActiveDotDiam}`}
    >
      {active && (
        <circle
          cx={ActiveDotRadius}
          cy={ActiveDotRadius}
          r={ActiveDotRadius}
          fill={tones[dataKey].medium}
          opacity="0.2"
        />
      )}
      <circle
        cx={ActiveDotRadius}
        cy={ActiveDotRadius}
        r={ActiveDotInnerRadius}
        fill={tones[dataKey].medium}
      />
    </svg>
  )
}

export default CustomDot
