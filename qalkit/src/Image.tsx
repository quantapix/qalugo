import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixOnlyProps } from "./helpers"
export interface ImageProps
  extends BsPrefixOnlyProps,
    React.ImgHTMLAttributes<HTMLImageElement> {
  fluid?: boolean
  rounded?: boolean
  roundedCircle?: boolean
  thumbnail?: boolean
}
export const propTypes = {
  bsPrefix?: string,
  fluid?: boolean,
  rounded?: boolean,
  roundedCircle?: boolean,
  thumbnail?: boolean,
}
const defaultProps = {
  fluid: false,
  rounded: false,
  roundedCircle: false,
  thumbnail: false,
}
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    { bsPrefix, className, fluid, rounded, roundedCircle, thumbnail, ...props },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "img")
    return (
      <img // eslint-disable-line jsx-a11y/alt-text
        ref={ref}
        {...props}
        className={classNames(
          className,
          fluid && `${bsPrefix}-fluid`,
          rounded && `rounded`,
          roundedCircle && `rounded-circle`,
          thumbnail && `${bsPrefix}-thumbnail`
        )}
      />
    )
  }
)
Image.displayName = "Image"
Image.propTypes = propTypes
Image.defaultProps = defaultProps
export default Image
