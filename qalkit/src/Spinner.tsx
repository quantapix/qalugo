import PropTypes from "prop-types"
import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { Variant } from "./types"
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLElement>,
    BsPrefixProps {
  animation: "border" | "grow"
  size?: "sm"
  variant?: Variant
}
const propTypes = {
  bsPrefix?: string,
  variant?: string,
  animation: PropTypes.oneOf(["border", "grow"]).isRequired,
  size?: string,
  children: PropTypes.element,
  role?: string,
  as: PropTypes.elementType,
}
const Spinner: BsPrefixRefForwardingComponent<"div", SpinnerProps> =
  React.forwardRef<HTMLElement, SpinnerProps>(
    (
      {
        bsPrefix,
        variant,
        animation,
        size,
        as: Component = "div",
        className,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "spinner")
      const bsSpinnerPrefix = `${bsPrefix}-${animation}`
      return (
        <Component
          ref={ref}
          {...props}
          className={classNames(
            className,
            bsSpinnerPrefix,
            size && `${bsSpinnerPrefix}-${size}`,
            variant && `text-${variant}`
          )}
        />
      )
    }
  )
Spinner.propTypes = propTypes as any
Spinner.displayName = "Spinner"
export default Spinner
