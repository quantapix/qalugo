import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext, useMemo } from "react"
import BaseDropdown, {
  DropdownProps as BaseDropdownProps,
  ToggleMetadata,
} from "@restart/ui/Dropdown"
import { useUncontrolled } from "uncontrollable"
import useEventCallback from "@restart/hooks/useEventCallback"
import DropdownContext, { DropDirection } from "./DropdownContext"
import DropdownItem from "./DropdownItem"
import DropdownMenu, { getDropdownMenuPlacement } from "./DropdownMenu"
import DropdownToggle from "./DropdownToggle"
import InputGroupContext from "./InputGroupContext"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
import createWithBsPrefix from "./createWithBsPrefix"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { AlignType, alignPropType } from "./types"
const DropdownHeader = createWithBsPrefix("dropdown-header", {
  defaultProps: { role: "heading" },
})
const DropdownDivider = createWithBsPrefix("dropdown-divider", {
  Component: "hr",
  defaultProps: { role: "separator" },
})
const DropdownItemText = createWithBsPrefix("dropdown-item-text", {
  Component: "span",
})
export interface DropdownProps
  extends BaseDropdownProps,
    BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "children"> {
  drop?: DropDirection
  align?: AlignType
  flip?: boolean
  focusFirstItemOnShow?: boolean | "keyboard"
  navbar?: boolean
  autoClose?: boolean | "outside" | "inside"
}
const propTypes = {
  bsPrefix: PropTypes.string,
  drop: PropTypes.oneOf(["up", "start", "end", "down"]),
  as: PropTypes.elementType,
  align: alignPropType,
  show: PropTypes.bool,
  flip: PropTypes.bool,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
  focusFirstItemOnShow: PropTypes.oneOf([false, true, "keyboard"]),
  navbar: PropTypes.bool,
  autoClose: PropTypes.oneOf([true, "outside", "inside", false]),
}
const defaultProps: Partial<DropdownProps> = {
  navbar: false,
  align: "start",
  autoClose: true,
}
const Dropdown: BsPrefixRefForwardingComponent<"div", DropdownProps> =
  React.forwardRef<HTMLElement, DropdownProps>((pProps, ref) => {
    const {
      bsPrefix,
      drop,
      show,
      className,
      align,
      onSelect,
      onToggle,
      focusFirstItemOnShow,
      as: Component = "div",
      navbar: _4,
      autoClose,
      ...props
    } = useUncontrolled(pProps, { show: "onToggle" })
    const isInputGroup = useContext(InputGroupContext)
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown")
    const isRTL = useIsRTL()
    const isClosingPermitted = (source: string): boolean => {
      if (autoClose === false) return source === "click"
      if (autoClose === "inside") return source !== "rootClose"
      if (autoClose === "outside") return source !== "select"
      return true
    }
    const handleToggle = useEventCallback(
      (nextShow: boolean, meta: ToggleMetadata) => {
        if (
          meta.originalEvent!.currentTarget === document &&
          (meta.source !== "keydown" ||
            (meta.originalEvent as any).key === "Escape")
        )
          meta.source = "rootClose"
        if (isClosingPermitted(meta.source!)) onToggle?.(nextShow, meta)
      }
    )
    const alignEnd = align === "end"
    const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)
    const contextValue = useMemo(
      () => ({
        align,
        drop,
        isRTL,
      }),
      [align, drop, isRTL]
    )
    return (
      <DropdownContext.Provider value={contextValue}>
        <BaseDropdown
          placement={placement}
          show={show}
          onSelect={onSelect}
          onToggle={handleToggle}
          focusFirstItemOnShow={focusFirstItemOnShow}
          itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
        >
          {isInputGroup ? (
            props.children
          ) : (
            <Component
              {...props}
              ref={ref}
              className={classNames(
                className,
                show && "show",
                (!drop || drop === "down") && prefix,
                drop === "up" && "dropup",
                drop === "end" && "dropend",
                drop === "start" && "dropstart"
              )}
            />
          )}
        </BaseDropdown>
      </DropdownContext.Provider>
    )
  })
Dropdown.displayName = "Dropdown"
Dropdown.propTypes = propTypes
Dropdown.defaultProps = defaultProps
export default Object.assign(Dropdown, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemText: DropdownItemText,
  Divider: DropdownDivider,
  Header: DropdownHeader,
})
import * as React from "react"
import PropTypes from "prop-types"
import Dropdown, { DropdownProps } from "./Dropdown"
import DropdownToggle, { PropsFromToggle } from "./DropdownToggle"
import DropdownMenu, { DropdownMenuVariant } from "./DropdownMenu"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { alignPropType } from "./types"
export interface DropdownButtonProps
  extends Omit<DropdownProps, "title">,
    PropsFromToggle,
    BsPrefixProps {
  title: React.ReactNode
  menuRole?: string
  renderMenuOnMount?: boolean
  rootCloseEvent?: "click" | "mousedown"
  menuVariant?: DropdownMenuVariant
}
const propTypes = {
  id: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  align: alignPropType,

  menuRole: PropTypes.string,

  renderMenuOnMount: PropTypes.bool,
  rootCloseEvent: PropTypes.string,
  menuVariant: PropTypes.oneOf<DropdownMenuVariant>(["dark"]),

  bsPrefix: PropTypes.string,

  variant: PropTypes.string,

  size: PropTypes.string,
}
const DropdownButton: BsPrefixRefForwardingComponent<
  "div",
  DropdownButtonProps
> = React.forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      title,
      children,
      bsPrefix,
      rootCloseEvent,
      variant,
      size,
      menuRole,
      renderMenuOnMount,
      disabled,
      href,
      id,
      menuVariant,
      ...props
    },
    ref
  ) => (
    <Dropdown ref={ref} {...props}>
      <DropdownToggle
        id={id}
        href={href}
        size={size}
        variant={variant}
        disabled={disabled}
        childBsPrefix={bsPrefix}
      >
        {title}
      </DropdownToggle>
      <DropdownMenu
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
        variant={menuVariant}
      >
        {children}
      </DropdownMenu>
    </Dropdown>
  )
)
DropdownButton.displayName = "DropdownButton"
DropdownButton.propTypes = propTypes
export default DropdownButton
import * as React from "react"
import { AlignType } from "./types"
export type DropDirection = "up" | "start" | "end" | "down"
export type DropdownContextValue = {
  align?: AlignType
  drop?: DropDirection
  isRTL?: boolean
}
const DropdownContext = React.createContext<DropdownContextValue>({})
DropdownContext.displayName = "DropdownContext"
export default DropdownContext
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import BaseDropdownItem, {
  useDropdownItem,
  DropdownItemProps as BaseDropdownItemProps,
} from "@restart/ui/DropdownItem"
import Anchor from "@restart/ui/Anchor"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface DropdownItemProps
  extends BaseDropdownItemProps,
    BsPrefixProps {}
const propTypes = {

  bsPrefix: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  href: PropTypes.string,
  onClick: PropTypes.func,
  as: PropTypes.elementType,
}
const DropdownItem: BsPrefixRefForwardingComponent<
  typeof BaseDropdownItem,
  DropdownItemProps
> = React.forwardRef(
  (
    {
      bsPrefix,
      className,
      eventKey,
      disabled = false,
      onClick,
      active,
      as: Component = Anchor,
      ...props
    },
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown-item")
    const [dropdownItemProps, meta] = useDropdownItem({
      key: eventKey,
      href: props.href,
      disabled,
      onClick,
      active,
    })
    return (
      <Component
        {...props}
        {...dropdownItemProps}
        ref={ref}
        className={classNames(
          className,
          prefix,
          meta.isActive && "active",
          disabled && "disabled"
        )}
      />
    )
  }
)
DropdownItem.displayName = "DropdownItem"
DropdownItem.propTypes = propTypes
export default DropdownItem
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import {
  useDropdownMenu,
  UseDropdownMenuOptions,
} from "@restart/ui/DropdownMenu"
import useIsomorphicEffect from "@restart/hooks/useIsomorphicEffect"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import { SelectCallback } from "@restart/ui/types"
import warning from "warning"
import DropdownContext, { DropDirection } from "./DropdownContext"
import InputGroupContext from "./InputGroupContext"
import NavbarContext from "./NavbarContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import useWrappedRefWithWarning from "./useWrappedRefWithWarning"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { AlignType, AlignDirection, alignPropType, Placement } from "./types"
export type DropdownMenuVariant = "dark" | string
export interface DropdownMenuProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  show?: boolean
  renderOnMount?: boolean
  flip?: boolean
  align?: AlignType
  onSelect?: SelectCallback
  rootCloseEvent?: "click" | "mousedown"
  popperConfig?: UseDropdownMenuOptions["popperConfig"]
  variant?: DropdownMenuVariant
}
const propTypes = {
  bsPrefix: PropTypes.string,

  show: PropTypes.bool,

  renderOnMount: PropTypes.bool,

  flip: PropTypes.bool,
  align: alignPropType,
  onSelect: PropTypes.func,
  rootCloseEvent: PropTypes.oneOf(["click", "mousedown"]),
  as: PropTypes.elementType,
  popperConfig: PropTypes.object,
  variant: PropTypes.string,
}
const defaultProps: Partial<DropdownMenuProps> = {
  flip: true,
}
export function getDropdownMenuPlacement(
  alignEnd: boolean,
  dropDirection?: DropDirection,
  isRTL?: boolean
) {
  const topStart = isRTL ? "top-end" : "top-start"
  const topEnd = isRTL ? "top-start" : "top-end"
  const bottomStart = isRTL ? "bottom-end" : "bottom-start"
  const bottomEnd = isRTL ? "bottom-start" : "bottom-end"
  const leftStart = isRTL ? "right-start" : "left-start"
  const leftEnd = isRTL ? "right-end" : "left-end"
  const rightStart = isRTL ? "left-start" : "right-start"
  const rightEnd = isRTL ? "left-end" : "right-end"
  let placement: Placement = alignEnd ? bottomEnd : bottomStart
  if (dropDirection === "up") placement = alignEnd ? topEnd : topStart
  else if (dropDirection === "end") placement = alignEnd ? rightEnd : rightStart
  else if (dropDirection === "start") placement = alignEnd ? leftEnd : leftStart
  return placement
}
const DropdownMenu: BsPrefixRefForwardingComponent<"div", DropdownMenuProps> =
  React.forwardRef<HTMLElement, DropdownMenuProps>(
    (
      {
        bsPrefix,
        className,
        align,
        rootCloseEvent,
        flip,
        show: showProps,
        renderOnMount,
        as: Component = "div",
        popperConfig,
        variant,
        ...props
      },
      ref
    ) => {
      let alignEnd = false
      const isNavbar = useContext(NavbarContext)
      const prefix = useBootstrapPrefix(bsPrefix, "dropdown-menu")
      const { align: contextAlign, drop, isRTL } = useContext(DropdownContext)
      align = align || contextAlign
      const isInputGroup = useContext(InputGroupContext)
      const alignClasses: string[] = []
      if (align) {
        if (typeof align === "object") {
          const keys = Object.keys(align)
          warning(
            keys.length === 1,
            "There should only be 1 breakpoint when passing an object to `align`"
          )
          if (keys.length) {
            const brkPoint = keys[0]
            const direction: AlignDirection = align[brkPoint]
            alignEnd = direction === "start"
            alignClasses.push(`${prefix}-${brkPoint}-${direction}`)
          }
        } else if (align === "end") {
          alignEnd = true
        }
      }
      const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)
      const [menuProps, { hasShown, popper, show, toggle }] = useDropdownMenu({
        flip,
        rootCloseEvent,
        show: showProps,
        usePopper: !isNavbar && alignClasses.length === 0,
        offset: [0, 2],
        popperConfig,
        placement,
      })
      menuProps.ref = useMergedRefs(
        useWrappedRefWithWarning(ref, "DropdownMenu"),
        menuProps.ref
      )
      useIsomorphicEffect(() => {
        if (show) popper?.update()
      }, [show])
      if (!hasShown && !renderOnMount && !isInputGroup) return null
      if (typeof Component !== "string") {
        menuProps.show = show
        menuProps.close = () => toggle?.(false)
        menuProps.align = align
      }
      let style = props.style
      if (popper?.placement) {
        style = { ...props.style, ...menuProps.style }
        props["x-placement"] = popper.placement
      }
      return (
        <Component
          {...props}
          {...menuProps}
          style={style}
          {...((alignClasses.length || isNavbar) && {
            "data-bs-popper": "static",
          })}
          className={classNames(
            className,
            prefix,
            show && "show",
            alignEnd && `${prefix}-end`,
            variant && `${prefix}-${variant}`,
            ...alignClasses
          )}
        />
      )
    }
  )
DropdownMenu.displayName = "DropdownMenu"
DropdownMenu.propTypes = propTypes
DropdownMenu.defaultProps = defaultProps
export default DropdownMenu
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import { useDropdownToggle } from "@restart/ui/DropdownToggle"
import DropdownContext from "@restart/ui/DropdownContext"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import Button, { ButtonProps, CommonButtonProps } from "./Button"
import InputGroupContext from "./InputGroupContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import useWrappedRefWithWarning from "./useWrappedRefWithWarning"
import { BsPrefixRefForwardingComponent } from "./helpers"
export interface DropdownToggleProps extends Omit<ButtonProps, "as"> {
  as?: React.ElementType
  split?: boolean
  childBsPrefix?: string
}
type DropdownToggleComponent = BsPrefixRefForwardingComponent<
  "button",
  DropdownToggleProps
>
export type PropsFromToggle = Partial<
  Pick<React.ComponentPropsWithRef<DropdownToggleComponent>, CommonButtonProps>
>
const propTypes = {
  bsPrefix: PropTypes.string,
  id: PropTypes.string,
  split: PropTypes.bool,
  as: PropTypes.elementType,
  childBsPrefix: PropTypes.string,
}
const DropdownToggle: DropdownToggleComponent = React.forwardRef(
  (
    {
      bsPrefix,
      split,
      className,
      childBsPrefix,
      as: Component = Button,
      ...props
    }: DropdownToggleProps,
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown-toggle")
    const dropdownContext = useContext(DropdownContext)
    const isInputGroup = useContext(InputGroupContext)
    if (childBsPrefix !== undefined) {
      ;(props as any).bsPrefix = childBsPrefix
    }
    const [toggleProps] = useDropdownToggle()
    toggleProps.ref = useMergedRefs(
      toggleProps.ref,
      useWrappedRefWithWarning(ref, "DropdownToggle")
    )
    return (
      <Component
        className={classNames(
          className,
          prefix,
          split && `${prefix}-split`,
          !!isInputGroup && dropdownContext?.show && "show"
        )}
        {...toggleProps}
        {...props}
      />
    )
  }
)
DropdownToggle.displayName = "DropdownToggle"
DropdownToggle.propTypes = propTypes
export default DropdownToggle
