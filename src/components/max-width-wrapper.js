/** @jsx jsx */
import { jsx } from "@emotion/core"

// TODO: Theme UI, add this max width?
const MAX_WIDTH = 1280

const wrapperCss = {
  maxWidth: MAX_WIDTH,
  paddingLeft: 32,
  paddingRight: 32,
  marginLeft: "auto",
  marginRight: "auto",

  // TODO: use small breakpoint with ThemeUI
  "@media (max-width: 540px)": {
    paddingLeft: 16,
    paddingRight: 16,
  },
}

const MaxWidthWrapper = ({ children }) => {
  return <div css={wrapperCss}>{children}</div>
}

export default MaxWidthWrapper
