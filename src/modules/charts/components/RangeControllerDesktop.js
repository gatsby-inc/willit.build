import React from "react"
import isFirstDayOfMonth from "date-fns/isFirstDayOfMonth"
import format from "date-fns/format"
import { useTheme } from "@modules/ui/components/ThemeProvider"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  YAxis,
  XAxis,
  Brush,
  ComposedChart,
} from "recharts"
import MonthRefLineLabel from "./MonthRefLineLabel"
import { DetailsChartDimensions } from "../constants"
import { BuildType } from "@modules/data/constants"

const {
  ActiveDotRadius,
  YAxisWidth,
  RangeControllerDesktopHeight,
} = DetailsChartDimensions

function RangeControllerDesktop({
  data,
  yAxisTicks,
  isMobile,
  filteredDataStartIndex,
  filteredDataEndIndex,
  updateDataRange,
}) {
  const { tones } = useTheme()
  const [initialWidth, setInitialWidth] = React.useState()

  const measuredRef = React.useCallback(node => {
    if (node !== null) {
      setInitialWidth(node.getBoundingClientRect().width)
    }
  }, [])

  const yMaxValueTick = yAxisTicks[yAxisTicks.length - 1]

  return (
    <div
      ref={measuredRef}
      css={{
        marginLeft: `${YAxisWidth}px`,
        marginRight: isMobile ? 0 : `${ActiveDotRadius}px`,
        position: `relative`,
      }}
    >
      <ResponsiveContainer
        width="100%"
        height={RangeControllerDesktopHeight}
        css={{ opacity: 0.6 }}
      >
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <YAxis domain={[0, yMaxValueTick]} hide={true} />

          <XAxis dataKey="createdAt" hide={true} />

          {Object.entries(BuildType).map(([key]) => (
            <Area
              key={`${key}ControllerChartArea`}
              type="linear"
              dataKey={key}
              strokeWidth={1}
              stroke={tones[key].medium}
              fillOpacity={1}
              fill={`url(#${key}-fill)`}
              isAnimationActive={false}
            />
          ))}

          {data.map(({ createdAt }) => {
            const date = new Date(createdAt)
            const isFirstDay = isFirstDayOfMonth(date)
            const label = format(date, "LLL ''yy")

            return isFirstDay ? (
              <ReferenceLine
                key={`montnRefLine${createdAt}`}
                x={createdAt}
                label={
                  <MonthRefLineLabel
                    label={label}
                    controllerInitialWidth={initialWidth}
                  />
                }
              />
            ) : null
          })}
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer
        width="100%"
        height={50}
        css={theme => ({
          position: `absolute`,
          top: 0,
          left: 0,
          borderTop: `1px solid ${theme.colors.blackFade[10]}`,
          borderBottom: `1px solid ${theme.colors.blackFade[10]}`,
        })}
      >
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <Brush
            height={50}
            startIndex={filteredDataStartIndex}
            endIndex={filteredDataEndIndex}
            onChange={updateDataRange}
            travellerWidth={5}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RangeControllerDesktop
