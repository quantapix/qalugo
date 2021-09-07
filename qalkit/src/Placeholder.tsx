import * as React from "react"
import PropTypes from "prop-types"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import usePlaceholder, { UsePlaceholderProps } from "./usePlaceholder"
import PlaceholderButton from "./PlaceholderButton"
export interface PlaceholderProps extends UsePlaceholderProps, BsPrefixProps {}
const propTypes = {
  bsPrefix?: string,
  animation?: string,
  bg?: string,
  size?: string,
}
const Placeholder: BsPrefixRefForwardingComponent<"span", PlaceholderProps> =
  React.forwardRef<HTMLElement, PlaceholderProps>(
    ({ as: Component = "span", ...props }, ref) => {
      const placeholderProps = usePlaceholder(props)
      return <Component {...placeholderProps} ref={ref} />
    }
  )
Placeholder.displayName = "Placeholder"
Placeholder.propTypes = propTypes
export default Object.assign(Placeholder, {
  Button: PlaceholderButton,
})
import * as React from "react"
import PropTypes from "prop-types"
import { BsPrefixRefForwardingComponent } from "./helpers"
import Button from "./Button"
import usePlaceholder, { UsePlaceholderProps } from "./usePlaceholder"
import { ButtonVariant } from "./types"
export interface PlaceholderButtonProps extends UsePlaceholderProps {
  variant?: ButtonVariant
}
const propTypes = {
  bsPrefix?: string,
  animation: PropTypes.oneOf(["glow", "wave"]),
  size: PropTypes.oneOf(["xs", "sm", "lg"]),
  variant?: string,
}
const PlaceholderButton: BsPrefixRefForwardingComponent<
  "button",
  PlaceholderButtonProps
> = React.forwardRef<HTMLButtonElement, PlaceholderButtonProps>(
  (props, ref) => {
    const placeholderProps = usePlaceholder(props)
    return <Button {...placeholderProps} ref={ref} disabled tabIndex={-1} />
  }
)
PlaceholderButton.displayName = "PlaceholderButton"
PlaceholderButton.propTypes = propTypes
export default PlaceholderButton
