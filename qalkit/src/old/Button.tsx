import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
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
  /**
   * @default 'btn'
   */
  bsPrefix: PropTypes.string,
  /**
   * One or more button variant combinations
   *
   * buttons may be one of a variety of visual variants such as:
   *
   * `'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link'`
   *
   * as well as "outline" versions (prefixed by 'outline-*')
   *
   * `'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light'`
   */
  variant: PropTypes.string,
  /**
   * Specifies a large or small button.
   *
   * @type ('sm'|'lg')
   */
  size: PropTypes.string,
  /** Manually set the visual state of the button to `:active` */
  active: PropTypes.bool,
  /**
   * Disables the Button, preventing mouse events,
   * even if the underlying component is an `<a>` element
   */
  disabled: PropTypes.bool,
  /** Providing a `href` will render an `<a>` element, _styled_ as a button. */
  href: PropTypes.string,
  /**
   * Defines HTML button type attribute.
   *
   * @default 'button'
   */
  type: PropTypes.oneOf(["button", "reset", "submit", null]),
  as: PropTypes.elementType,
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
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface ButtonGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "lg"
  vertical?: boolean
}
const propTypes = {
  /**
   * @default 'btn-group'
   */
  bsPrefix: PropTypes.string,
  /**
   * Sets the size for all Buttons in the group.
   *
   * @type ('sm'|'lg')
   */
  size: PropTypes.string,
  /** Make the set of Buttons appear vertically stacked. */
  vertical: PropTypes.bool,
  /**
   * An ARIA role describing the button group. Usually the default
   * "group" role is fine. An `aria-label` or `aria-labelledby`
   * prop is also recommended.
   */
  role: PropTypes.string,
  as: PropTypes.elementType,
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
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
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
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps } from "./helpers"
export interface ButtonToolbarProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  /**
   * @default 'btn-toolbar'
   */
  bsPrefix: PropTypes.string,
  /**
   * The ARIA role describing the button toolbar. Generally the default
   * "toolbar" role is correct. An `aria-label` or `aria-labelledby`
   * prop is also recommended.
   */
  role: PropTypes.string,
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
