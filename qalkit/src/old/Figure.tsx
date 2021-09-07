import createWithBsPrefix from "./createWithBsPrefix"
import FigureImage from "./FigureImage"
import FigureCaption from "./FigureCaption"
const Figure = createWithBsPrefix("figure", {
  Component: "figure",
})
export default Object.assign(Figure, {
  Image: FigureImage,
  Caption: FigureCaption,
})
import createWithBsPrefix from "./createWithBsPrefix"
const FigureCaption = createWithBsPrefix("figure-caption", {
  Component: "figcaption",
})
export default FigureCaption
import classNames from "classnames"
import * as React from "react"
import Image, { ImageProps, propTypes as imagePropTypes } from "./Image"
const defaultProps = { fluid: true }
const FigureImage = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      {...props}
      className={classNames(className, "figure-img")}
    />
  )
)
FigureImage.displayName = "FigureImage"
FigureImage.propTypes = imagePropTypes
FigureImage.defaultProps = defaultProps
export default FigureImage
