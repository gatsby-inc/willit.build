import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Card from "@modules/build/components/Card"
import { visuallyHiddenCss } from "@modules/a11y/stylesheets"
import {
  HORIZONTAL_PADDING_MOBILE,
  HORIZONTAL_PADDING_DESKTOP,
} from "@modules/ui/components/MaxWidthWrapper"

import checkIfConstantsExist from "@modules/data/utils/checkIfConstantsExist"

const BuildCardsGroup = () => {
  const data = useStaticQuery(graphql`
    {
      benchmarkApi {
        benchmarkVendors {
          id
          contentSource
          siteType
          latest(numberOfPages: 8192) {
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
        }
      }
    }
  `)

  const benchmarkVendors = data.benchmarkApi.benchmarkVendors

  return (
    <div
      css={(theme) => ({
        marginTop: theme.space[8],
        display: `grid`,
        marginLeft: `-${HORIZONTAL_PADDING_MOBILE}`,
        marginRight: `-${HORIZONTAL_PADDING_MOBILE}`,
        [theme.mediaQueries.phablet]: {
          marginLeft: `-${HORIZONTAL_PADDING_DESKTOP}`,
          marginRight: `-${HORIZONTAL_PADDING_DESKTOP}`,
          marginTop: theme.space[10],
        },
        [theme.mediaQueries.desktop]: {
          marginLeft: "auto",
          marginRight: "auto",
        },
      })}
    >
      <h2 css={visuallyHiddenCss} id="benchmark-sites">
        Benchmark sites
      </h2>
      {benchmarkVendors.map(({ contentSource, siteType, id, latest }) => {
        if (!checkIfConstantsExist({ id, contentSource, siteType })) {
          return null
        }

        const { warmStart, dataUpdate } = latest

        if (!warmStart.length || !dataUpdate.length) {
          return null
        }

        return (
          <Card
            key={id}
            contentSource={contentSource}
            siteType={siteType}
            numberOfPages={8192}
            contentChangeBuild={dataUpdate[0]}
            codeChangeBuild={warmStart[0]}
          />
        )
      })}
    </div>
  )
}

export default BuildCardsGroup
