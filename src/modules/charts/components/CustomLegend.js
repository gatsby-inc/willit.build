import React from "react"
import { DetailsChartDimensions } from "../constants"
import { BuildType } from "@modules/data/constants"
import { ToggleCheckbox } from "gatsby-interface"
import LinePreview from "./LinePreview"
import { useTheme } from "@modules/ui/components/ThemeProvider"

function CustomLegend({ onClick, chartActiveLines }) {
  const { LegendMinHeight, YAxisWidth, VerticalGap } = DetailsChartDimensions
  const { tones } = useTheme()

  return (
    <div
      css={theme => ({
        display: `flex`,
        flexWrap: `wrap`,
        justifyContent: `center`,
        minHeight: `${LegendMinHeight}px`,
        alignItems: `flex-end`,
        marginTop: `${VerticalGap}px`,

        [theme.mediaQueries.desktop]: {
          paddingLeft: `${YAxisWidth}px`,
          justifyContent: `flex-start`,
        },
      })}
    >
      {Object.keys(chartActiveLines).map(key => {
        const isActive = chartActiveLines[key]
        const displayedAs = BuildType[key].displayedAs

        /*
          There are some 'magic' numbers in styling transition/margins below, 
          all of them are result of scaling down the original component, 
          the values come through 'manual' trial and error 
        */

        return (
          <div
            key={`legend-toggle-${key}`}
            data-cy="chart-legend-item"
            css={theme => ({
              alignItems: `center`,
              display: `flex`,
              margin: `${theme.space[1]} ${theme.space[4]}`,

              [theme.mediaQueries.desktop]: {
                transform: `translate(-${theme.space[4]})`,
              },
            })}
          >
            <ToggleCheckbox
              label={displayedAs}
              checked={isActive}
              tone={key}
              onChange={() => onClick(key)}
              css={theme => ({
                color: theme.colors.grey[60],
                fontSize: theme.fontSizes[1],
                fontFamily: theme.fonts.body,

                span: {
                  transform: `scale(0.66) translateX(5%)`,
                  margin: 0,
                  marginLeft: `-10px`,

                  "&:after": {
                    transform: `scale(0.8)`,
                  },
                },
              })}
            />
            <LinePreview
              strokeDasharray={BuildType[key].strokeDasharray}
              strokeColor={tones[key].medium}
              width={25}
              css={theme => ({
                marginLeft: theme.space[2],
              })}
            />
          </div>
        )
      })}
    </div>
  )
}

export default CustomLegend
