import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby-interface"

import DetailsChart from "@modules/charts/components/DetailsChart"
import DetailsTable from "@modules/charts/components/DetailsTable"
import DetailsChartPlaceholder from "@modules/charts/components/DetailsChartPlaceholder"
import { DetailsChartDimensions } from "@modules/charts/constants"
import {
  ContentSource,
  ArtificiallySlowContentSources,
} from "@modules/data/constants"
import MaxWidthWrapper, {
  HORIZONTAL_PADDING_DESKTOP as wrapperPaddingDesktop,
} from "@modules/ui/components/MaxWidthWrapper"
import DetailsHeader from "./DetailsHeader"
import DetailsOverview from "./DetailsOverview"
import { formatDataForChart } from "./SiteDetailsPage.helpers"
import { SEO } from "@modules/seo/components/SEO"

const { YAxisWidth, ChartWithControlsHeight } = DetailsChartDimensions

const SiteDetailsPage = ({ data, pageContext }) => {
  const [chartIsMounted, setChartIsMounted] = React.useState(false)
  const { activeBenchmarks } = pageContext
  const [graphData, setGraphData] = React.useState()
  const [chartActiveLines, setChartActiveLines] = React.useState({
    DATA_UPDATE: true,
    WARM_START: true,
    COLD_START: true,
  })

  React.useEffect(() => {
    setChartIsMounted(true)
  }, [])

  const {
    allAnnotationsJson: { nodes: graphAnnotations },
    benchmarkApi: { benchmarkVendor },
  } = data

  const { pageCount } = pageContext
  const { latest, contentSource, siteType, benchmarks } = benchmarkVendor

  // TEMP: Stop relying on buildType. We have all the data at once now.
  const buildType = "WARM_START"

  // BAND-AID: The backend returns the repository URL in the wrong format:
  // - Current: https://github.com/gatsbyjs/gatsby/benchmarks/source-contentful
  // - Correct: https://github.com/gatsbyjs/gatsby/tree/master/benchmarks/source-contentful
  //
  // We'll patch in the missing /tree/master here
  let { repositoryUrl } = benchmarkVendor
  repositoryUrl = repositoryUrl.replace(
    "gatsbyjs/gatsby",
    "gatsbyjs/gatsby/tree/master"
  )

  const isArtificiallySlow = !!ArtificiallySlowContentSources[contentSource]

  React.useEffect(() => {
    const graphData = formatDataForChart({
      benchmarks,
      pageCount,
      chartActiveLines,
    })

    setGraphData(graphData)
  }, [benchmarks, pageCount, chartActiveLines])

  const { displayedAs: contentSourceTitle } = ContentSource[contentSource]

  if (!graphData) {
    return null
  }

  return (
    <MaxWidthWrapper
      css={theme => ({
        paddingLeft: 0,
        paddingRight: 0,

        [theme.mediaQueries.desktop]: {
          paddingLeft: wrapperPaddingDesktop,
          paddingRight: wrapperPaddingDesktop,
        },
      })}
    >
      <SEO
        title={`Gatsby and ${contentSourceTitle} Build Benchmarks`}
        description="Compare historical build times of Gatsby example sites with data sourced from Contentful and built on Gatsby Cloud"
      />
      <div
        css={theme => ({
          background: theme.colors.grey[5],

          [theme.mediaQueries.desktop]: {
            padding: `${theme.space[2]} 0 ${theme.space[8]} ${YAxisWidth}px`,
          },
        })}
      >
        <DetailsHeader
          siteType={siteType}
          contentSource={contentSource}
          pageCount={pageCount}
          repositoryUrl={repositoryUrl}
        />

        <DetailsOverview
          siteType={siteType}
          contentSource={contentSource}
          pageCount={pageCount}
          buildType={buildType}
          stats={latest}
          activeBenchmarks={activeBenchmarks}
        />
      </div>

      {isArtificiallySlow && (
        <section
          css={theme => ({
            textAlign: `center`,
            padding: `${theme.space[2]} ${theme.space[5]} ${theme.space[6]} ${theme.space[5]}`,
            fontSize: theme.fontSizes[1],
            color: theme.colors.grey[60],
            lineHeight: theme.lineHeights.body,
          })}
        >
          <strong>Note:</strong> Markdown build times are artificially inflated.
          You should experience quicker builds.{" "}
          <Link to="/faq#markdown-mdx-builds">Learn more</Link>
        </section>
      )}

      <section
        css={{
          minHeight: `${ChartWithControlsHeight}px`,
        }}
      >
        {!chartIsMounted && <DetailsChartPlaceholder />}
        <DetailsChart
          data={graphData}
          annotations={graphAnnotations}
          setChartIsMounted={setChartIsMounted}
          chartActiveLines={chartActiveLines}
          setChartActiveLines={setChartActiveLines}
        />
      </section>

      <section
        css={theme => ({
          padding: `0 ${theme.space[5]}`,

          [theme.mediaQueries.desktop]: {
            padding: `${theme.space[2]} 0 ${theme.space[8]} ${YAxisWidth}px`,
          },
        })}
      >
        <DetailsTable
          data={graphData}
          annotations={graphAnnotations}
          contentSource={contentSource}
        />
      </section>
    </MaxWidthWrapper>
  )
}

export default SiteDetailsPage

export const query = graphql`
  query SiteDetailsPageQuery(
    $contentSource: BenchmarkVendors_CmsVendor!
    $siteType: BenchmarkVendors_BenchmarkSiteType!
    $pageCount: Int!
  ) {
    allAnnotationsJson {
      nodes {
        date
        label
        description
        link
        linkText
      }
    }
    benchmarkApi {
      benchmarkVendor(siteType: $siteType, contentSource: $contentSource) {
        id
        repositoryUrl
        contentSource
        siteType
        latest(numberOfPages: $pageCount) {
          coldStart {
            timeInMs
            timeInMinutes
            humanReadableTime
          }
          warmStart {
            timeInMs
            timeInMinutes
            humanReadableTime
          }
          dataUpdate {
            timeInMs
            timeInMinutes
            humanReadableTime
          }
        }
        benchmarks(numberOfPages: $pageCount) {
          id
          numberOfPages
          numberOfImages
          buildType
          createdAt
          buildTimes {
            timeInMs
            timeInMinutes
            humanReadableTime
          }
        }
      }
    }
  }
`
