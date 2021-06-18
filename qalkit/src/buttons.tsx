import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./utils"
import { SafeAnchor } from "./utils"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { ButtonVariant } from "./types"
import { ButtonGroup } from "./button_group"
import { Dropdown, DropdownProps, PropsFromToggle } from "./dropdown"
import { alignPropType } from "./types"

export type ButtonType = "button" | "reset" | "submit" | string
export interface ButtonProps
  extends React.HTMLAttributes<HTMLElement>,
    BsPrefixProps {
  active?: boolean
  variant?: ButtonVariant
  size?: "sm" | "lg"
  type?: ButtonType
  href?: string
  disabled?: boolean
  target?: any
}
export type CommonButtonProps = "href" | "size" | "variant" | "disabled"
const propTypes = {
  /**
   * @default 'btn'
   */
  bsPrefix: string,
  variant: string,
  /**
   * @type ('sm'|'lg')
   */
  size: string,
  active: bool,
  disabled: bool,
  href: string,
  /**
   * @default 'button'
   */
  type: oneOf(["button", "reset", "submit", null]),
  as: elementType,
}
const defaultProps = {
  variant: "primary",
  active: false,
  disabled: false,
}
export const Button: BsPrefixRefForwardingComponent<
  "button",
  ButtonProps
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ bsPrefix, variant, size, active, className, type, as, ...props }, ref) => {
    const prefix = useBootstrapPrefix(bsPrefix, "btn")
    const classes = classNames(
      className,
      prefix,
      active && "active",
      variant && `${prefix}-${variant}`,
      size && `${prefix}-${size}`
    )
    if (props.href) {
      return (
        <SafeAnchor
          {...props}
          as={as}
          ref={ref}
          className={classNames(classes, props.disabled && "disabled")}
        />
      )
    }
    if (!type && !as) {
      type = "button"
    }
    const Component = as || "button"
    return <Component {...props} ref={ref} type={type} className={classes} />
  }
)
Button.displayName = "Button"
Button.propTypes = propTypes
Button.defaultProps = defaultProps
export type ToggleButtonType = "checkbox" | "radio"
export interface ToggleButtonProps extends ButtonProps {
  type?: ToggleButtonType
  name?: string
  checked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string | ReadonlyArray<string> | number
  inputRef?: React.Ref<HTMLInputElement>
}
const noop = () => undefined
const propTypes = {
  /**
   * @default 'btn-check'
   */
  bsPrefix: string,
  type: oneOf<ToggleButtonType>(["checkbox", "radio"]),
  name: string,
  checked: bool,
  disabled: bool,
  id: string.isRequired,
  onChange: func,
  value: oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.number,
  ]).isRequired,
  /**
   * @type {ReactRef}
   */
  inputRef: oneOfType([PropTypes.func, PropTypes.any]),
}
export const ToggleButton = React.forwardRef<
  HTMLLabelElement,
  ToggleButtonProps
>(
  (
    {
      bsPrefix,
      name,
      className,
      checked,
      type,
      onChange,
      value,
      disabled,
      id,
      inputRef,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "btn-check")
    return (
      <>
        <input
          className={bsPrefix}
          name={name}
          type={type}
          value={value}
          ref={inputRef}
          autoComplete="off"
          checked={!!checked}
          disabled={!!disabled}
          onChange={onChange || noop}
          id={id}
        />
        <Button
          {...props}
          ref={ref}
          className={classNames(className, disabled && "disabled")}
          type={undefined}
          as="label"
          htmlFor={id}
        />
      </>
    )
  }
)
ToggleButton.propTypes = propTypes
ToggleButton.displayName = "ToggleButton"
export interface SplitButtonProps
  extends Omit<DropdownProps, "title" | "id">,
    PropsFromToggle,
    BsPrefixProps {
  id: string | number
  menuRole?: string
  renderMenuOnMount?: boolean
  rootCloseEvent?: "click" | "mousedown"
  target?: string
  title: React.ReactNode
  toggleLabel?: string
  type?: ButtonType
}
const propTypes = {
  /**
   * @type {string|number}
   * @required
   */
  id: any,
  toggleLabel: string,
  href: string,
  target: string,
  onClick: func,
  title: node.isRequired,
  type: string,
  disabled: bool,
  /**
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,
  menuRole: string,
  renderMenuOnMount: bool,
  rootCloseEvent: string,
  /** @ignore */
  bsPrefix: string,
  /** @ignore */
  variant: string,
  /** @ignore */
  size: string,
}
const defaultProps = {
  toggleLabel: "Toggle dropdown",
  type: "button",
}
export const SplitButton = React.forwardRef<HTMLElement, SplitButtonProps>(
  (
    {
      id,
      bsPrefix,
      size,
      variant,
      title,
      type,
      toggleLabel,
      children,
      onClick,
      href,
      target,
      menuRole,
      renderMenuOnMount,
      rootCloseEvent,
      ...props
    },
    ref
  ) => (
    <Dropdown ref={ref} {...props} as={ButtonGroup}>
      <Button
        size={size}
        variant={variant}
        disabled={props.disabled}
        bsPrefix={bsPrefix}
        href={href}
        target={target}
        onClick={onClick}
        type={type}
      >
        {title}
      </Button>
      <Dropdown.Toggle
        split
        id={id ? id.toString() : undefined}
        size={size}
        variant={variant}
        disabled={props.disabled}
        childBsPrefix={bsPrefix}
      >
        <span className="visually-hidden">{toggleLabel}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
      >
        {children}
      </Dropdown.Menu>
    </Dropdown>
  )
)
SplitButton.propTypes = propTypes as any
SplitButton.defaultProps = defaultProps
SplitButton.displayName = "SplitButton"
export interface ButtonToolbarProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  /**
   * @default 'btn-toolbar'
   */
  bsPrefix: string,
  role: string,
}
const defaultProps = {
  role: "toolbar",
}
export const ButtonToolbar = React.forwardRef<
  HTMLDivElement,
  ButtonToolbarProps
>(({ bsPrefix, className, ...props }, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, "btn-toolbar")
  return <div {...props} ref={ref} className={classNames(className, prefix)} />
})
ButtonToolbar.displayName = "ButtonToolbar"
ButtonToolbar.propTypes = propTypes
ButtonToolbar.defaultProps = defaultProps
