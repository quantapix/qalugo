import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
import { ButtonVariant } from "./types"
import { useBootstrapPrefix } from "./ThemeProvider"
import * as React from "react"
import classNames from "classnames"
export type ButtonType = "button" | "reset" | "submit"
export interface AnchorOptions {
  href?: string
  rel?: string
  target?: string
}
export interface UseButtonPropsOptions extends AnchorOptions {
  type?: ButtonType
  disabled?: boolean
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>
  tabIndex?: number
  tagName?: keyof JSX.IntrinsicElements
}
export function isTrivialHref(href?: string) {
  return !href || href.trim() === "#"
}
export interface AriaButtonProps {
  type?: ButtonType | undefined
  disabled: boolean | undefined
  role?: "button"
  tabIndex?: number | undefined
  href?: string | undefined
  target?: string | undefined
  rel?: string | undefined
  "aria-disabled"?: true | undefined
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
}
export interface UseButtonPropsMetadata {
  tagName: React.ElementType
}
export function useButtonProps({
  tagName,
  disabled,
  href,
  target,
  rel,
  onClick,
  tabIndex = 0,
  type,
}: UseButtonPropsOptions): [AriaButtonProps, UseButtonPropsMetadata] {
  if (!tagName) {
    if (href != null || target != null || rel != null) {
      tagName = "a"
    } else {
      tagName = "button"
    }
  }
  const meta: UseButtonPropsMetadata = { tagName }
  if (tagName === "button") {
    return [{ type: (type as any) || "button", disabled }, meta]
  }
  const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled || (tagName === "a" && isTrivialHref(href))) {
      event.preventDefault()
    }
    if (disabled) {
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault()
      handleClick(event)
    }
  }
  return [
    {
      role: "button",
      disabled: undefined,
      tabIndex: disabled ? undefined : tabIndex,
      href: tagName === "a" && disabled ? undefined : href,
      target: tagName === "a" ? target : undefined,
      "aria-disabled": !disabled ? undefined : disabled,
      rel: tagName === "a" ? rel : undefined,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    },
    meta,
  ]
}
export interface BaseButtonProps {
  as?: keyof JSX.IntrinsicElements | undefined
  disabled?: boolean | undefined
  href?: string | undefined
  target?: string | undefined
  rel?: string | undefined
}
export interface ButtonProps extends BaseButtonProps, React.ComponentPropsWithoutRef<"button"> {}
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ as: asProp, disabled, ...props }, ref) => {
    const [buttonProps, { tagName: Component }] = useButtonProps({
      tagName: asProp,
      disabled,
      ...props,
    })
    return <Component {...props} {...buttonProps} ref={ref} />
  }
)
Button.displayName = "Button"
export interface ButtonProps extends BaseButtonProps, Omit<BsPrefixProps, "as"> {
  active?: boolean
  variant?: ButtonVariant
  size?: "sm" | "lg"
}
export type CommonButtonProps = "href" | "size" | "variant" | "disabled"
const propTypes = {
  bsPrefix: string,
  variant: string,
  size: string,
  active: boolean,
  disabled: boolean,
  href: string,
  type: "button" | "reset" | "submit" | null,
  as: React.elementType,
}
const defaultProps = {
  variant: "primary",
  active: false,
  disabled: false,
}
const Button: BsPrefixRefForwardingComponent<"button", ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ as, bsPrefix, variant, size, active, className, ...props }, ref) => {
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
})
Button.displayName = "Button"
Button.propTypes = propTypes
Button.defaultProps = defaultProps
export default Button
import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
export interface ButtonGroupProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "lg"
  vertical?: boolean
}
const propTypes = {
  bsPrefix: string,
  size: string,
  vertical: boolean,
  role: string,
  as: React.elementType,
}
const defaultProps = {
  vertical: false,
  role: "group",
}
const ButtonGroup: BsPrefixRefForwardingComponent<"div", ButtonGroupProps> = React.forwardRef(
  (
    { bsPrefix, size, vertical, className, as: Component = "div", ...rest }: ButtonGroupProps,
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "btn-group")
    let baseClass = prefix
    if (vertical) baseClass = `${prefix}-vertical`
    return (
      <Component
        {...rest}
        ref={ref}
        className={classNames(className, baseClass, size && `${prefix}-${size}`)}
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
import { BsPrefixProps } from "./utils"
export interface ButtonToolbarProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  bsPrefix: string,
  role: string,
}
const defaultProps = {
  role: "toolbar",
}
const ButtonToolbar = React.forwardRef<HTMLDivElement, ButtonToolbarProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    const prefix = useBootstrapPrefix(bsPrefix, "btn-toolbar")
    return <div {...props} ref={ref} className={classNames(className, prefix)} />
  }
)
ButtonToolbar.displayName = "ButtonToolbar"
ButtonToolbar.propTypes = propTypes
ButtonToolbar.defaultProps = defaultProps
export default ButtonToolbar
