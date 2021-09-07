import classNames from "classnames"
import * as React from "react"
import { OverlayArrowProps } from "@restart/ui/Overlay"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
import { Placement } from "./types"
import { BsPrefixProps, getOverlayDirection } from "./helpers"
export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  placement?: Placement
  arrowProps?: Partial<OverlayArrowProps>
  show?: boolean
  popper?: any
}
const propTypes = {
  bsPrefix?: string,
  id?: string,
  placement?:
    "auto-start" |
    "auto" |
    "auto-end" |
    "top-start" |
    "top" |
    "top-end" |
    "right-start" |
    "right" |
    "right-end" |
    "bottom-end" |
    "bottom" |
    "bottom-start" |
    "left-end" |
    "left" |
    "left-start" |
  ,
  arrowProps?: {
    ref?: any,
    style?: object,
  },

  popper?: object,

  show?: any,
}
const defaultProps = {
  placement: "right",
}
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      bsPrefix,
      placement,
      className,
      style,
      children,
      arrowProps,
      popper: _,
      show: _2,
      ...props
    }: TooltipProps,
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "tooltip")
    const isRTL = useIsRTL()
    const [primaryPlacement] = placement?.split("-") || []
    const bsDirection = getOverlayDirection(primaryPlacement, isRTL)
    return (
      <div
        ref={ref}
        style={style}
        role="tooltip"
        x-placement={primaryPlacement}
        className={classNames(className, bsPrefix, `bs-tooltip-${bsDirection}`)}
        {...props}
      >
        <div className="tooltip-arrow" {...arrowProps} />
        <div className={`${bsPrefix}-inner`}>{children}</div>
      </div>
    )
  }
)
Tooltip.propTypes = propTypes as any
Tooltip.defaultProps = defaultProps as any
Tooltip.displayName = "Tooltip"
export default Tooltip
