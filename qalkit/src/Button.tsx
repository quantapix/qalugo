import classNames from "classnames"
import * as React from "react"
import {
  useButtonProps,
  ButtonProps as BaseButtonProps,
} from "@restart/ui/Button"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { ButtonVariant } from "./types"
export interface ButtonProps
  extends BaseButtonProps,
    Omit<BsPrefixProps, "as"> {
  active?: boolean
  variant?: ButtonVariant
  size?: "sm" | "lg"
}
export type CommonButtonProps = "href" | "size" | "variant" | "disabled"
const propTypes = {
  bsPrefix?: string,
  variant?: string,
  size?: string,
  active?: boolean,
  disabled?: boolean,
  href?: string,
  type?: "button" | "reset" | "submit" | null,
  as?: React.elementType,
}
const defaultProps = {
  variant: "primary",
  active: false,
  disabled: false,
}
const Button: BsPrefixRefForwardingComponent<"button", ButtonProps> =
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ as, bsPrefix, variant, size, active, className, ...props }, ref) => {
      const prefix = useBootstrapPrefix(bsPrefix, "btn")
      const [buttonProps, { tagName }] = useButtonProps({
        tagName: as,
        ...props,
      })
      const Component = tagName as React.ElementType
      return (
        <Component
          {...props}
          {...buttonProps}
          ref={ref}
          className={classNames(
            className,
            prefix,
            active && "active",
            variant && `${prefix}-${variant}`,
            size && `${prefix}-${size}`,
            props.href && props.disabled && "disabled"
          )}
        />
      )
    }
  )
Button.displayName = "Button"
Button.propTypes = propTypes
Button.defaultProps = defaultProps
export default Button
import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface ButtonGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "lg"
  vertical?: boolean
}
const propTypes = {
  bsPrefix?: string,
  size?: string,
  vertical?: boolean,
  role?: string,
  as?: React.elementType,
}
const defaultProps = {
  vertical: false,
  role: "group",
}
const ButtonGroup: BsPrefixRefForwardingComponent<"div", ButtonGroupProps> =
  React.forwardRef(
    (
      {
        bsPrefix,
        size,
        vertical,
        className,
        as: Component = "div",
        ...rest
      }: ButtonGroupProps,
      ref
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, "btn-group")
      let baseClass = prefix
      if (vertical) baseClass = `${prefix}-vertical`
      return (
        <Component
          {...rest}
          ref={ref}
          className={classNames(
            className,
            baseClass,
            size && `${prefix}-${size}`
          )}
        />
      )
    }
  )
ButtonGroup.displayName = "ButtonGroup"
ButtonGroup.propTypes = propTypes
ButtonGroup.defaultProps = defaultProps
export default ButtonGroup
import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps } from "./helpers"
export interface ButtonToolbarProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  bsPrefix?: string,
  role?: string,
}
const defaultProps = {
  role: "toolbar",
}
const ButtonToolbar = React.forwardRef<HTMLDivElement, ButtonToolbarProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    const prefix = useBootstrapPrefix(bsPrefix, "btn-toolbar")
    return (
      <div {...props} ref={ref} className={classNames(className, prefix)} />
    )
  }
)
ButtonToolbar.displayName = "ButtonToolbar"
ButtonToolbar.propTypes = propTypes
ButtonToolbar.defaultProps = defaultProps
export default ButtonToolbar
