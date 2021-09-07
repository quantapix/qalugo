import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { OverlayArrowProps } from "@restart/ui/Overlay"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
import PopoverHeader from "./PopoverHeader"
import PopoverBody from "./PopoverBody"
import { Placement } from "./types"
import { BsPrefixProps, getOverlayDirection } from "./helpers"
export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  placement?: Placement
  title?: string
  arrowProps?: Partial<OverlayArrowProps>
  body?: boolean
  popper?: any
  show?: boolean
}
const propTypes = {
  bsPrefix?: string,
  id?: string,
  placement: PropTypes.oneOf<Placement>([
    "auto-start",
    "auto",
    "auto-end",
    "top-start",
    "top",
    "top-end",
    "right-start",
    "right",
    "right-end",
    "bottom-end",
    "bottom",
    "bottom-start",
    "left-end",
    "left",
    "left-start",
  ]),
  arrowProps: PropTypes.shape({
    ref: PropTypes.any,
    style: PropTypes.object,
  }),
  body?: boolean,

  popper: PropTypes.object,

  show?: boolean,
}
const defaultProps: Partial<PopoverProps> = {
  placement: "right",
}
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      bsPrefix,
      placement,
      className,
      style,
      children,
      body,
      arrowProps,
      popper: _,
      show: _1,
      ...props
    },
    ref
  ) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, "popover")
    const isRTL = useIsRTL()
    const [primaryPlacement] = placement?.split("-") || []
    const bsDirection = getOverlayDirection(primaryPlacement, isRTL)
    return (
      <div
        ref={ref}
        role="tooltip"
        style={style}
        x-placement={primaryPlacement}
        className={classNames(
          className,
          decoratedBsPrefix,
          primaryPlacement && `bs-popover-${bsDirection}`
        )}
        {...props}
      >
        <div className="popover-arrow" {...arrowProps} />
        {body ? <PopoverBody>{children}</PopoverBody> : children}
      </div>
    )
  }
)
Popover.propTypes = propTypes as any
Popover.defaultProps = defaultProps
export default Object.assign(Popover, {
  Header: PopoverHeader,
  Body: PopoverBody,
  POPPER_OFFSET: [0, 8] as const,
})
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("popover-body")
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("popover-header")
