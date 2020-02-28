import React from "react"
import { Link } from "gatsby-interface"

import { useBenchmarkVendors } from "@modules/build/hooks/useBenchmarkVendors"
import Card from "@modules/build/components/Card"
import { SiteTypeThumbnail, SourceIcon } from "@modules/build/constants"

const wrapperStyles = {
  marginTop: `12rem`,
}

const BuildCardsGroup = () => {
  const [benchmarkVendors, { loading, error }] = useBenchmarkVendors()

  // TODO: determine loading and error states
  if (loading) return <div css={wrapperStyles}>Loading...</div>
  if (error) return <div css={wrapperStyles}>Error: {error.message}</div>

  return (
    <div css={wrapperStyles}>
      <Link
        to="/methodology-faq"
        css={theme => ({
          color: theme.colors.purple[40],
        })}
      >
        Methodology + FAQ
      </Link>
      <div
        css={theme => ({
          marginTop: theme.space[12],
          display: `grid`,
          gridGap: theme.space[12],
          [theme.mediaQueries.desktop]: {
            marginTop: theme.space[9],
            gridGap: theme.space[10],
          },
        })}
      >
        {benchmarkVendors.map(({ id, contentSource, siteType, topStats }) => {
          // currently, this is showing the top stats. this could change if we decide to show latest benchmark, median of benchmarks, etc
          // we also probably need to add numberOfPages to topStats on the backend if we decide to go this route. this is hard coded for now
          return (
            <Card
              key={id}
              Icon={SourceIcon[contentSource]}
              coverImage={SiteTypeThumbnail[siteType]}
              source={contentSource}
              siteType={siteType}
              numberOfPages={512}
              subsequentBuildTime={topStats.warmStartTime}
              initialBuildTime={topStats.coldStartTime}
            />
          )
        })}
      </div>
    </div>
  )
}

export default BuildCardsGroup
