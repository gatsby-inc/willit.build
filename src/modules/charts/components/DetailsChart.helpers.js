import React from "react"
import formatDuration from "../utils/formatDuration"
import { DetailsChartDimensions } from "../constants"

const { ActiveDotRadius } = DetailsChartDimensions

export function filteredDataInitialStartIndex({
  data,
  isMobile,
  initialDataRangeMobile,
  initialDataRangeDesktop,
}) {
  const initialDataRange = isMobile
    ? initialDataRangeMobile
    : initialDataRangeDesktop

  return data.length > initialDataRange ? data.length - initialDataRange : 0
}

export function filteredDataInitialEndIndex({ data }) {
  return data.length - 1
}

export function filterData({
  data,
  filteredDataStartIndex,
  filteredDataEndIndex,
}) {
  return data.slice(filteredDataStartIndex, filteredDataEndIndex + 1)
}

export function filterDataForMobile({ data, scope }) {
  const startIndex = data.length > scope ? data.length - scope : 0

  return data.filter((_, idx) => idx >= startIndex)
}

export function xAxisTickFormater(value) {
  return value.slice(0, -5)
}

export function yAxisTickFormater(value) {
  if (value === 0) {
    return `0`
  }

  return formatDuration(value)
    .split(" ")
    .reduce((acc, item) => {
      const numStr = Number(item.substring(0, item.length - 1))
      return numStr ? [...acc, item] : acc
    }, [])
    .join(" ")
}

function getMaxValue(data) {
  return data.reduce((result, row) => {
    const maxItemValue = Object.keys(row).reduce((rowResult, key) => {
      return typeof row[key] === "number" && row[key] > rowResult
        ? row[key]
        : rowResult
    }, 0)

    return maxItemValue > result ? maxItemValue : result
  }, 0)
}

function getRoundedMaxValue(maxValue) {
  const SECONDS_IN_MINUTE = 60
  const MINUTES_IN_HOUR = 60
  const MIN_ROUNDING = 10

  if (maxValue < SECONDS_IN_MINUTE) {
    return {
      roundedMaxValue: Math.ceil(maxValue / MIN_ROUNDING) * MIN_ROUNDING,
      multiplier: 1,
    }
  } else if (maxValue < SECONDS_IN_MINUTE * MINUTES_IN_HOUR) {
    return {
      roundedMaxValue: Math.ceil(maxValue / SECONDS_IN_MINUTE),
      multiplier: SECONDS_IN_MINUTE,
    }
  } else {
    return {
      roundedMaxValue: Math.ceil(
        maxValue / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR)
      ),
      multiplier: SECONDS_IN_MINUTE * MINUTES_IN_HOUR,
    }
  }
}

export function getYAxisTicks(data) {
  const maxValue = getMaxValue(data)
  const { roundedMaxValue, multiplier } = getRoundedMaxValue(maxValue)
  const maxTick = roundedMaxValue * multiplier

  // depending on max tick value we render different amount of ticks,
  // the goal is that we render ticks with integer value in one unit
  // for example 15s, 45s, 1m, 3m, 45m, 1h, 3h,
  // but never 1m 35s, or 1h 25m
  // this way wy maintain proper spacing between yAxis label and its ticks' labels

  if (roundedMaxValue === 1) {
    const secondTick = 0.25 * multiplier
    const thirdTick = 0.5 * multiplier
    const fourthTick = 0.75 * multiplier

    return [0, secondTick, thirdTick, fourthTick, maxTick]
  } else if (roundedMaxValue === 2) {
    const secondTick = 1 * multiplier

    return [0, secondTick, maxTick]
  } else if (roundedMaxValue === 3) {
    const secondTick = 1 * multiplier
    const thirdTick = 2 * multiplier

    return [0, secondTick, thirdTick, maxTick]
  } else if (roundedMaxValue % 2 !== 0) {
    const secondTick = Math.floor(roundedMaxValue * 0.2) * multiplier
    const thirdTick = Math.floor(roundedMaxValue * 0.4) * multiplier
    const fourthTick = Math.floor(roundedMaxValue * 0.6) * multiplier
    const fifthTick = Math.floor(roundedMaxValue * 0.8) * multiplier

    return [0, secondTick, thirdTick, fourthTick, fifthTick, maxTick]
  } else {
    const secondTick = Math.floor(roundedMaxValue * 0.25) * multiplier
    const thirdTick = Math.floor(roundedMaxValue * 0.5) * multiplier
    const fourthTick = Math.ceil(roundedMaxValue * 0.75) * multiplier

    return [0, secondTick, thirdTick, fourthTick, maxTick]
  }
}

export function getLinearGradientDefs(tones) {
  return (
    <defs>
      <pattern
        id="brush-slide-fill"
        x="50%"
        y="0"
        width="1"
        height="1"
        patternTransform="translate(-4,17)"
        patternUnits="objectBoundingBox"
      >
        <rect fill="rgba(0,0,0,0.04)" x="0" y="0" width="100%" height="100" />
        <rect fill="rgba(0,0,0,0.3)" x="0" y="0" width="2" height="16" />
        <rect fill="rgba(0,0,0,0.3)" x="5" y="0" width="2" height="16" />
        <rect fill="rgba(0,0,0,0.3)" x="10" y="0" width="2" height="16" />
      </pattern>

      <linearGradient id="DATA_UPDATE-fill" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor={tones.DATA_UPDATE.medium}
          stopOpacity={0.15}
        />
        <stop
          offset="60%"
          stopColor={tones.DATA_UPDATE.medium}
          stopOpacity={0.01}
        />
      </linearGradient>
      <linearGradient id="WARM_START-fill" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor={tones.WARM_START.medium}
          stopOpacity={0.15}
        />
        <stop
          offset="60%"
          stopColor={tones.WARM_START.medium}
          stopOpacity={0.0}
        />
      </linearGradient>
      <linearGradient id="COLD_START-fill" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor={tones.COLD_START.medium}
          stopOpacity={0.15}
        />
        <stop
          offset="60%"
          stopColor={tones.COLD_START.medium}
          stopOpacity={0.0}
        />
      </linearGradient>
    </defs>
  )
}

export const wrapperCss = theme => ({
  background: theme.colors.grey[5],
  marginBottom: theme.space[4],

  [theme.mediaQueries.desktop]: {
    marginRight: `-${ActiveDotRadius}px`, // this nullify the right margin set on the chart
  },

  ".recharts-cartesian-grid": {
    borderRight: `1px solid red`,
  },

  ".recharts-cartesian-axis-tick-value": {
    fontSize: theme.fontSizes[0],
    fontFamily: theme.fonts.body,
  },

  ".recharts-brush": {},

  ".recharts-brush-slide": {
    fill: `url(#brush-slide-fill)`,
    fillOpacity: 1,
  },

  ".recharts-brush-texts": {
    display: `none`,
  },

  ".recharts-brush-traveller": {
    rect: {
      fill: `#ccc`,
    },
  },

  ".recharts-brush > rect:not(.recharts-brush-slide)": {
    fill: `rgba(0,0,0,0)`,
    stroke: `#fbfbfb`,
  },

  ".recharts-cartesian-axis-line, .recharts-cartesian-axis-tick-line": {
    stroke: theme.colors.blackFade[20],
  },
})
