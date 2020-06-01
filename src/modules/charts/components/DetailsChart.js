import React from "react"
import PropTypes from "prop-types"
import { useTheme } from "@modules/ui/components/ThemeProvider"

import LazyChart from "./LazyChart"
import CustomLegend from "./CustomLegend"
import RangeControllerMobile from "./RangeControllerMobile"
import LazyRangeControllerDesktop from "./LazyRangeControllerDesktop"
import {
  wrapperCss,
  filterData,
  filterDataForMobile,
  filteredDataInitialStartIndex,
  filteredDataInitialEndIndex,
  getYAxisTicks,
} from "./DetailsChart.helpers"
import { ChartDefaultProps, DetailsChartDimensions } from "../constants"
import useMatchMedia from "@modules/ui/hooks/useMatchMedia"
import { visuallyHiddenCss } from "@modules/a11y/stylesheets"

const {
  ChartHeight,
  RangeControllerDesktopHeight,
  VerticalGap,
} = DetailsChartDimensions

export const propTypes = {
  data: PropTypes.array,
  annotations: PropTypes.array,
  initialScopeDesktop: PropTypes.number, // in days
  initialScopeMobile: PropTypes.number, // in days
}
function DetailsChart({
  data = [],
  initialDataRangeDesktop = ChartDefaultProps.InitialDataScopeDesktop,
  initialDataRangeMobile = ChartDefaultProps.InitialDataScopeMobile,
  annotations = [],
  setChartIsMounted,
  chartActiveLines,
  setChartActiveLines,
  ...rest
}) {
  const { mediaQueries } = useTheme()
  const isMobile = !useMatchMedia(mediaQueries.desktop)
  const [filteredData, setFilteredData] = React.useState()
  const [filteredDataStartIndex, setFilteredDataStartIndex] = React.useState(
    filteredDataInitialStartIndex({
      isMobile,
      data,
      initialDataRangeMobile,
      initialDataRangeDesktop,
    })
  )
  const [filteredDataEndIndex, setFilteredDataEndIndex] = React.useState(
    filteredDataInitialEndIndex({ data })
  )

  React.useEffect(filterDataCallback, [
    isMobile,
    filteredDataStartIndex,
    filteredDataEndIndex,
    data,
  ])

  function filterDataCallback() {
    setFilteredData(
      isMobile
        ? filterDataForMobile({ data, scope: initialDataRangeMobile })
        : filterData({
            data,
            filteredDataStartIndex,
            filteredDataEndIndex,
          })
    )
  }

  const yAxisTicks = getYAxisTicks(data)

  if (!filteredData) {
    return null
  }

  const toggleChartLine = dataKey => {
    setChartActiveLines({
      ...chartActiveLines,
      [dataKey]: !chartActiveLines[dataKey],
    })
  }

  const updateDataRange = ({ startIndex, endIndex }) => {
    setFilteredDataStartIndex(startIndex)
    setFilteredDataEndIndex(endIndex)
  }

  return (
    <div css={wrapperCss} {...rest}>
      <h2 css={visuallyHiddenCss}>Charted data</h2>
      {isMobile && filteredData && (
        <RangeControllerMobile
          data={data}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
        />
      )}

      {filteredData && (
        <div
          css={{
            minHeight: `${ChartHeight}px`,
          }}
        >
          <LazyChart
            data={data}
            filteredData={filteredData}
            isMobile={isMobile}
            yAxisTicks={yAxisTicks}
            annotations={annotations}
            onFinishLoad={setChartIsMounted}
          />
        </div>
      )}

      {!isMobile && (
        <div
          css={{
            minHeight: `${RangeControllerDesktopHeight + VerticalGap}px`,
            paddingTop: `${VerticalGap}px`,
          }}
        >
          <LazyRangeControllerDesktop
            data={data}
            isMobile={isMobile}
            filteredDataStartIndex={filteredDataStartIndex}
            filteredDataEndIndex={filteredDataEndIndex}
            updateDataRange={updateDataRange}
            yAxisTicks={yAxisTicks}
          />
        </div>
      )}
      <CustomLegend
        chartActiveLines={chartActiveLines}
        onClick={toggleChartLine}
      />
    </div>
  )
}

DetailsChart.propTypes = propTypes

export default DetailsChart
