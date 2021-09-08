import classNames from "classnames"
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

import qsa from "dom-helpers/querySelectorAll"
import addEventListener from "dom-helpers/addEventListener"
import { useCallback, useRef, useEffect, useMemo, useContext } from "react"
import * as React from "react"
import { useUncontrolledProp } from "uncontrollable"
import usePrevious from "@restart/hooks/usePrevious"
import useForceUpdate from "@restart/hooks/useForceUpdate"
import useGlobalListener from "@restart/hooks/useGlobalListener"
import useEventCallback from "@restart/hooks/useEventCallback"
import DropdownContext from "./DropdownContext"
import DropdownMenu, {
  DropdownMenuProps,
  UseDropdownMenuMetadata,
  UseDropdownMenuOptions,
} from "./DropdownMenu"
import DropdownToggle, {
  DropdownToggleProps,
  UseDropdownToggleMetadata,
  isRoleMenu,
} from "./DropdownToggle"
import DropdownItem, { DropdownItemProps } from "./DropdownItem"
import SelectableContext from "./SelectableContext"
import { SelectCallback } from "./types"
import { dataAttr } from "./DataKey"
import { Placement } from "./usePopper"
export type {
  DropdownMenuProps,
  UseDropdownMenuMetadata,
  UseDropdownMenuOptions,
  DropdownToggleProps,
  UseDropdownToggleMetadata,
  DropdownItemProps,
}
export interface DropdownInjectedProps {
  onKeyDown: React.KeyboardEventHandler
}
export type ToggleEvent = React.SyntheticEvent | KeyboardEvent | MouseEvent
export interface ToggleMetadata {
  source: string | undefined
  originalEvent: ToggleEvent | undefined
}
export interface DropdownProps {
  placement?: Placement
  defaultShow?: boolean
  show?: boolean
  onSelect?: SelectCallback
  onToggle?: (nextShow: boolean, meta: ToggleMetadata) => void
  itemSelector?: string
  focusFirstItemOnShow?: boolean | "keyboard"
  children: React.ReactNode
}
function useRefWithUpdate() {
  const forceUpdate = useForceUpdate()
  const ref = useRef<HTMLElement | null>(null)
  const attachRef = useCallback(
    (element: null | HTMLElement) => {
      ref.current = element
      forceUpdate()
    },
    [forceUpdate]
  )
  return [ref, attachRef] as const
}
function Dropdown({
  defaultShow,
  show: rawShow,
  onSelect,
  onToggle: rawOnToggle,
  itemSelector = `* [${dataAttr("dropdown-item")}]`,
  focusFirstItemOnShow,
  placement = "bottom-start",
  children,
}: DropdownProps) {
  const [show, onToggle] = useUncontrolledProp(rawShow, defaultShow!, rawOnToggle)
  const [menuRef, setMenu] = useRefWithUpdate()
  const menuElement = menuRef.current
  const [toggleRef, setToggle] = useRefWithUpdate()
  const toggleElement = toggleRef.current
  const lastShow = usePrevious(show)
  const lastSourceEvent = useRef<string | null>(null)
  const focusInDropdown = useRef(false)
  const onSelectCtx = useContext(SelectableContext)
  const toggle = useCallback(
    (
      nextShow: boolean,
      event: ToggleEvent | undefined,
      source: string | undefined = event?.type
    ) => {
      onToggle(nextShow, { originalEvent: event, source })
    },
    [onToggle]
  )
  const handleSelect = useEventCallback((key: string | null, event: React.SyntheticEvent) => {
    onSelect?.(key, event)
    toggle(false, event, "select")
    if (!event.isPropagationStopped()) {
      onSelectCtx?.(key, event)
    }
  })
  const context = useMemo(
    () => ({
      toggle,
      placement,
      show,
      menuElement,
      toggleElement,
      setMenu,
      setToggle,
    }),
    [toggle, placement, show, menuElement, toggleElement, setMenu, setToggle]
  )
  if (menuElement && lastShow && !show) {
    focusInDropdown.current = menuElement.contains(document.activeElement)
  }
  const focusToggle = useEventCallback(() => {
    if (toggleElement && toggleElement.focus) {
      toggleElement.focus()
    }
  })
  const maybeFocusFirst = useEventCallback(() => {
    const type = lastSourceEvent.current
    let focusType = focusFirstItemOnShow
    if (focusType == null) {
      focusType = menuRef.current && isRoleMenu(menuRef.current) ? "keyboard" : false
    }
    if (focusType === false || (focusType === "keyboard" && !/^key.+$/.test(type!))) {
      return
    }
    const first = qsa(menuRef.current!, itemSelector)[0]
    if (first && first.focus) first.focus()
  })
  useEffect(() => {
    if (show) maybeFocusFirst()
    else if (focusInDropdown.current) {
      focusInDropdown.current = false
      focusToggle()
    }
    // only `show` should be changing
  }, [show, focusInDropdown, focusToggle, maybeFocusFirst])
  useEffect(() => {
    lastSourceEvent.current = null
  })
  const getNextFocusedChild = (current: HTMLElement, offset: number) => {
    if (!menuRef.current) return null
    const items = qsa(menuRef.current, itemSelector)
    let index = items.indexOf(current) + offset
    index = Math.max(0, Math.min(index, items.length))
    return items[index]
  }
  useGlobalListener("keydown", (event: KeyboardEvent) => {
    const { key } = event
    const target = event.target as HTMLElement
    const fromMenu = menuRef.current?.contains(target)
    const fromToggle = toggleRef.current?.contains(target)
    const isInput = /input|textarea/i.test(target.tagName)
    if (isInput && (key === " " || (key !== "Escape" && fromMenu))) {
      return
    }
    if (!fromMenu && !fromToggle) {
      return
    }
    if (key === "Tab" && (!menuRef.current || !show)) {
      return
    }
    lastSourceEvent.current = event.type
    const meta = { originalEvent: event, source: event.type }
    switch (key) {
      case "ArrowUp": {
        const next = getNextFocusedChild(target, -1)
        if (next && next.focus) next.focus()
        event.preventDefault()
        return
      }
      case "ArrowDown":
        event.preventDefault()
        if (!show) {
          onToggle(true, meta)
        } else {
          const next = getNextFocusedChild(target, 1)
          if (next && next.focus) next.focus()
        }
        return
      case "Tab":
        addEventListener(
          document as any,
          "keyup",
          e => {
            if (
              (e.key === "Tab" && !e.target) ||
              !menuRef.current?.contains(e.target as HTMLElement)
            ) {
              onToggle(false, meta)
            }
          },
          { once: true }
        )
        break
      case "Escape":
        if (key === "Escape") {
          event.preventDefault()
          event.stopPropagation()
        }
        onToggle(false, meta)
        break
      default:
    }
  })
  return (
    <SelectableContext.Provider value={handleSelect}>
      <DropdownContext.Provider value={context}>{children}</DropdownContext.Provider>
    </SelectableContext.Provider>
  )
}
Dropdown.displayName = "Dropdown"
Dropdown.Menu = DropdownMenu
Dropdown.Toggle = DropdownToggle
Dropdown.Item = DropdownItem
export default Dropdown
import * as React from "react"
import type { Placement } from "./usePopper"
export type DropdownContextValue = {
  toggle: (nextShow: boolean, event?: React.SyntheticEvent | Event) => void
  menuElement: HTMLElement | null
  toggleElement: HTMLElement | null
  setMenu: (ref: HTMLElement | null) => void
  setToggle: (ref: HTMLElement | null) => void
  show: boolean
  placement?: Placement
}
const DropdownContext = React.createContext<DropdownContextValue | null>(null)
export default DropdownContext
import * as React from "react"
import { useContext } from "react"
import useEventCallback from "@restart/hooks/useEventCallback"
import SelectableContext, { makeEventKey } from "./SelectableContext"
import NavContext from "./NavContext"
import { EventKey, DynamicRefForwardingComponent } from "./types"
import Button from "./Button"
import { dataAttr } from "./DataKey"
export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  active?: boolean
  disabled?: boolean
  eventKey?: EventKey
  href?: string
}
interface UseDropdownItemOptions {
  key?: EventKey | null
  href?: string
  active?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler
}
export function useDropdownItem({ key, href, active, disabled, onClick }: UseDropdownItemOptions) {
  const onSelectCtx = useContext(SelectableContext)
  const navContext = useContext(NavContext)
  const { activeKey } = navContext || {}
  const eventKey = makeEventKey(key, href)
  const isActive = active == null && key != null ? makeEventKey(activeKey) === eventKey : active
  const handleClick = useEventCallback(event => {
    if (disabled) return
    onClick?.(event)
    if (onSelectCtx && !event.isPropagationStopped()) {
      onSelectCtx(eventKey, event)
    }
  })
  return [
    {
      onClick: handleClick,
      "aria-disabled": disabled || undefined,
      "aria-selected": isActive,
      [dataAttr("dropdown-item")]: "",
    },
    { isActive },
  ] as const
}
const DropdownItem: DynamicRefForwardingComponent<typeof Button, DropdownItemProps> =
  React.forwardRef(
    (
      { eventKey, disabled, onClick, active, as: Component = Button, ...props }: DropdownItemProps,
      ref
    ) => {
      const [dropdownItemProps] = useDropdownItem({
        key: eventKey,
        href: props.href,
        disabled,
        onClick,
        active,
      })
      return <Component {...props} ref={ref} {...dropdownItemProps} />
    }
  )
DropdownItem.displayName = "DropdownItem"
export default DropdownItem
import { useContext, useRef } from "react"
import * as React from "react"
import useCallbackRef from "@restart/hooks/useCallbackRef"
import DropdownContext, { DropdownContextValue } from "./DropdownContext"
import usePopper, { UsePopperOptions, Placement, Offset, UsePopperState } from "./usePopper"
import useRootClose, { RootCloseOptions } from "./useRootClose"
import mergeOptionsWithPopperConfig from "./mergeOptionsWithPopperConfig"
export interface UseDropdownMenuOptions {
  flip?: boolean
  show?: boolean
  fixed?: boolean
  placement?: Placement
  usePopper?: boolean
  enableEventListeners?: boolean
  offset?: Offset
  rootCloseEvent?: RootCloseOptions["clickTrigger"]
  popperConfig?: Omit<UsePopperOptions, "enabled" | "placement">
}
export type UserDropdownMenuProps = Record<string, any> & {
  ref: React.RefCallback<HTMLElement>
  style?: React.CSSProperties
  "aria-labelledby"?: string
}
export type UserDropdownMenuArrowProps = Record<string, any> & {
  ref: React.RefCallback<HTMLElement>
  style: React.CSSProperties
}
export interface UseDropdownMenuMetadata {
  show: boolean
  placement?: Placement
  hasShown: boolean
  toggle?: DropdownContextValue["toggle"]
  popper: UsePopperState | null
  arrowProps: Partial<UserDropdownMenuArrowProps>
}
const noop: any = () => {}
export function useDropdownMenu(options: UseDropdownMenuOptions = {}) {
  const context = useContext(DropdownContext)
  const [arrowElement, attachArrowRef] = useCallbackRef<Element>()
  const hasShownRef = useRef(false)
  const {
    flip,
    offset,
    rootCloseEvent,
    fixed = false,
    placement: placementOverride,
    popperConfig = {},
    enableEventListeners = true,
    usePopper: shouldUsePopper = !!context,
  } = options
  const show = context?.show == null ? !!options.show : context.show
  if (show && !hasShownRef.current) {
    hasShownRef.current = true
  }
  const handleClose = (e: React.SyntheticEvent | Event) => {
    context?.toggle(false, e)
  }
  const { placement, setMenu, menuElement, toggleElement } = context || {}
  const popper = usePopper(
    toggleElement,
    menuElement,
    mergeOptionsWithPopperConfig({
      placement: placementOverride || placement || "bottom-start",
      enabled: shouldUsePopper,
      enableEvents: enableEventListeners == null ? show : enableEventListeners,
      offset,
      flip,
      fixed,
      arrowElement,
      popperConfig,
    })
  )
  const menuProps: UserDropdownMenuProps = {
    ref: setMenu || noop,
    "aria-labelledby": toggleElement?.id,
    ...popper.attributes.popper,
    style: popper.styles.popper as any,
  }
  const metadata: UseDropdownMenuMetadata = {
    show,
    placement,
    hasShown: hasShownRef.current,
    toggle: context?.toggle,
    popper: shouldUsePopper ? popper : null,
    arrowProps: shouldUsePopper
      ? {
          ref: attachArrowRef,
          ...popper.attributes.arrow,
          style: popper.styles.arrow as any,
        }
      : {},
  }
  useRootClose(menuElement, handleClose, {
    clickTrigger: rootCloseEvent,
    disabled: !show,
  })
  return [menuProps, metadata] as const
}
const defaultProps = {
  usePopper: true,
}
export interface DropdownMenuProps extends UseDropdownMenuOptions {
  children: (props: UserDropdownMenuProps, meta: UseDropdownMenuMetadata) => React.ReactNode
}
function DropdownMenu({ children, ...options }: DropdownMenuProps) {
  const [props, meta] = useDropdownMenu(options)
  return <>{children(props, meta)}</>
}
DropdownMenu.displayName = "DropdownMenu"
DropdownMenu.defaultProps = defaultProps
export default DropdownMenu
import { useContext, useCallback } from "react"
import * as React from "react"
import { useSSRSafeId } from "./ssr"
import DropdownContext, { DropdownContextValue } from "./DropdownContext"
export const isRoleMenu = (el: HTMLElement) => el.getAttribute("role")?.toLowerCase() === "menu"
export interface UseDropdownToggleProps {
  id: string
  ref: DropdownContextValue["setToggle"]
  onClick: React.MouseEventHandler
  "aria-expanded": boolean
  "aria-haspopup"?: true
}
export interface UseDropdownToggleMetadata {
  show: DropdownContextValue["show"]
  toggle: DropdownContextValue["toggle"]
}
const noop = () => {}
export function useDropdownToggle(): [UseDropdownToggleProps, UseDropdownToggleMetadata] {
  const id = useSSRSafeId()
  const { show = false, toggle = noop, setToggle, menuElement } = useContext(DropdownContext) || {}
  const handleClick = useCallback(
    e => {
      toggle(!show, e)
    },
    [show, toggle]
  )
  const props: UseDropdownToggleProps = {
    id,
    ref: setToggle || noop,
    onClick: handleClick,
    "aria-expanded": !!show,
  }
  if (menuElement && isRoleMenu(menuElement)) {
    props["aria-haspopup"] = true
  }
  return [props, { show, toggle }]
}
export interface DropdownToggleProps {
  children: (props: UseDropdownToggleProps, meta: UseDropdownToggleMetadata) => React.ReactNode
}
function DropdownToggle({ children }: DropdownToggleProps) {
  const [props, meta] = useDropdownToggle()
  return <>{children(props, meta)}</>
}
DropdownToggle.displayName = "DropdownToggle"
export default DropdownToggle


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
  bsPrefix?: string,
  drop?: "up" | "start" | "end" | "down",
  as?: React.elementType,
  align: alignPropType,
  show?: boolean,
  flip?: boolean,
  onToggle?: () => void,
  onSelect?: () => void,
  focusFirstItemOnShow?: false | true | "keyboard",
  navbar?: boolean,
  autoClose?: true | "outside" | "inside" | false,
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
  id?: string,
  href?: string,
  onClick?: () => void,
  title: React.ReactNode,
  disabled?: boolean,
  align: alignPropType,

  menuRole?: string,

  renderMenuOnMount?: boolean,
  rootCloseEvent?: string,
  menuVariant: PropTypes.oneOf<DropdownMenuVariant>(["dark"]),

  bsPrefix?: string,

  variant?: string,

  size?: string,
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

  bsPrefix?: string,
  active?: boolean,
  disabled?: boolean,
  eventKey?: string | number,
  href?: string,
  onClick?: () => void,
  as?: React.elementType,
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
  bsPrefix?: string,

  show?: boolean,

  renderOnMount?: boolean,

  flip?: boolean,
  align: alignPropType,
  onSelect?: () => void,
  rootCloseEvent?: "click" | "mousedown",
  as?: React.elementType,
  popperConfig?: object,
  variant?: string,
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
  bsPrefix?: string,
  id?: string,
  split?: boolean,
  as?: React.elementType,
  childBsPrefix?: string,
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
