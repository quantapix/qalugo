import classNames from "classnames"
import all from "prop-types-extra/lib/all"
import * as React from "react"
import { useContext } from "react"
import { useUncontrolled } from "uncontrollable"
import BaseNav, { NavProps as BaseNavProps } from "@restart/ui/Nav"
import { EventKey } from "@restart/ui/types"
import { useBootstrapPrefix } from "./ThemeProvider"
import NavbarContext from "./NavbarContext"
import CardHeaderContext from "./CardHeaderContext"
import NavItem from "./NavItem"
import NavLink from "./NavLink"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"

import qsa from "dom-helpers/querySelectorAll"
import * as React from "react"
import { useContext, useEffect, useRef } from "react"
import useForceUpdate from "@restart/hooks/useForceUpdate"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import NavContext from "./NavContext"
import SelectableContext, { makeEventKey } from "./SelectableContext"
import TabContext from "./TabContext"
import { EventKey, DynamicRefForwardingComponent, SelectCallback } from "./types"
import { dataAttr, dataProp } from "./DataKey"
import NavItem, { UseNavItemOptions, NavItemProps } from "./NavItem"
export type { UseNavItemOptions, NavItemProps }
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
export interface NavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  activeKey?: EventKey
  as?: React.ElementType
  onSelect?: SelectCallback
}
const EVENT_KEY_ATTR = dataAttr("event-key")
const Nav: DynamicRefForwardingComponent<"div", NavProps> = React.forwardRef<HTMLElement, NavProps>(
  ({ as: Component = "div", onSelect, activeKey, role, onKeyDown, ...props }, ref) => {
    const forceUpdate = useForceUpdate()
    const needsRefocusRef = useRef(false)
    const parentOnSelect = useContext(SelectableContext)
    const tabContext = useContext(TabContext)
    let getControlledId, getControllerId
    if (tabContext) {
      role = role || "tablist"
      activeKey = tabContext.activeKey
      getControlledId = tabContext.getControlledId
      getControllerId = tabContext.getControllerId
    }
    const listNode = useRef<HTMLElement>(null)
    const getNextActiveTab = (offset: number) => {
      const currentListNode = listNode.current
      if (!currentListNode) return null
      const items = qsa(currentListNode, `[${EVENT_KEY_ATTR}]:not([aria-disabled=true])`)
      const activeChild = currentListNode.querySelector<HTMLElement>("[aria-selected=true]")
      if (!activeChild) return null
      const index = items.indexOf(activeChild)
      if (index === -1) return null
      let nextIndex = index + offset
      if (nextIndex >= items.length) nextIndex = 0
      if (nextIndex < 0) nextIndex = items.length - 1
      return items[nextIndex]
    }
    const handleSelect = (key: string | null, event: React.SyntheticEvent) => {
      if (key == null) return
      onSelect?.(key, event)
      parentOnSelect?.(key, event)
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event)
      if (!tabContext) {
        return
      }
      let nextActiveChild
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          nextActiveChild = getNextActiveTab(-1)
          break
        case "ArrowRight":
        case "ArrowDown":
          nextActiveChild = getNextActiveTab(1)
          break
        default:
          return
      }
      if (!nextActiveChild) return
      event.preventDefault()
      handleSelect(nextActiveChild.dataset[dataProp("EventKey")] || null, event)
      needsRefocusRef.current = true
      forceUpdate()
    }
    useEffect(() => {
      if (listNode.current && needsRefocusRef.current) {
        const activeChild = listNode.current.querySelector<HTMLElement>(
          `[${EVENT_KEY_ATTR}][aria-selected=true]`
        )
        activeChild?.focus()
      }
      needsRefocusRef.current = false
    })
    const mergedRef = useMergedRefs(ref, listNode)
    return (
      <SelectableContext.Provider value={handleSelect}>
        <NavContext.Provider
          value={{
            role, // used by NavLink to determine it's role
            activeKey: makeEventKey(activeKey),
            getControlledId: getControlledId || noop,
            getControllerId: getControllerId || noop,
          }}
        >
          <Component {...props} onKeyDown={handleKeyDown} ref={mergedRef} role={role} />
        </NavContext.Provider>
      </SelectableContext.Provider>
    )
  }
)
Nav.displayName = "Nav"
export default Object.assign(Nav, { Item: NavItem })
import * as React from "react"
import { EventKey } from "./types"
interface NavContextType {
  role?: string
  activeKey: EventKey | null
  getControlledId: (key: EventKey | null) => string
  getControllerId: (key: EventKey | null) => string
}
const NavContext = React.createContext<NavContextType | null>(null)
NavContext.displayName = "NavContext"
export default NavContext
import * as React from "react"
import { useContext } from "react"
import useEventCallback from "@restart/hooks/useEventCallback"
import NavContext from "./NavContext"
import SelectableContext, { makeEventKey } from "./SelectableContext"
import { EventKey, DynamicRefForwardingComponent } from "./types"
import Button from "./Button"
import { dataAttr } from "./DataKey"
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  active?: boolean
  as?: React.ElementType
  disabled?: boolean
  eventKey?: EventKey
  href?: string
}
export interface UseNavItemOptions {
  key?: string | null
  onClick?: React.MouseEventHandler
  active?: boolean
  disabled?: boolean
  id?: string
  role?: string
}
export function useNavItem({ key, onClick, active, id, role, disabled }: UseNavItemOptions) {
  const parentOnSelect = useContext(SelectableContext)
  const navContext = useContext(NavContext)
  let isActive = active
  const props = { role } as any
  if (navContext) {
    if (!role && navContext.role === "tablist") props.role = "tab"
    const contextControllerId = navContext.getControllerId(key ?? null)
    const contextControlledId = navContext.getControlledId(key ?? null)
    // @ts-ignore
    props[dataAttr("event-key")] = key
    props.id = contextControllerId || id
    props["aria-controls"] = contextControlledId
    isActive = active == null && key != null ? navContext.activeKey === key : active
  }
  if (props.role === "tab") {
    if (disabled) {
      props.tabIndex = -1
      props["aria-disabled"] = true
    }
    if (isActive) {
      props["aria-selected"] = isActive
    } else {
      props.tabIndex = -1
    }
  }
  props.onClick = useEventCallback((e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    if (key == null) {
      return
    }
    if (parentOnSelect && !e.isPropagationStopped()) {
      parentOnSelect(key, e)
    }
  })
  return [props, { isActive }] as const
}
const NavItem: DynamicRefForwardingComponent<typeof Button, NavItemProps> = React.forwardRef<
  HTMLElement,
  NavItemProps
>(({ as: Component = Button, active, eventKey, ...options }, ref) => {
  const [props, meta] = useNavItem({
    key: makeEventKey(eventKey, options.href),
    active,
    ...options,
  })
  // @ts-ignore
  props[dataAttr("active")] = meta.isActive
  return <Component {...options} {...props} ref={ref} />
})
NavItem.displayName = "NavItem"
export default NavItem

export interface NavProps extends BsPrefixProps, BaseNavProps {
  navbarBsPrefix?: string
  cardHeaderBsPrefix?: string
  variant?: "tabs" | "pills"
  defaultActiveKey?: EventKey
  fill?: boolean
  justify?: boolean
  navbar?: boolean
  navbarScroll?: boolean
}
const propTypes = {
  bsPrefix?: string,

  navbarBsPrefix?: string,

  cardHeaderBsPrefix?: string,
  variant?: string,
  activeKey?: string | number,
  fill?: boolean,
  justify: all(boolean, ({ justify, navbar }) =>
    justify && navbar ? Error("justify navbar `Nav`s are not supported") : null
  ),
  onSelect?: () => void,
  role?: string,
  navbar?: boolean,
  navbarScroll?: boolean,
  as?: React.elementType,

  onKeyDown?: () => void,
}
const defaultProps = {
  justify: false,
  fill: false,
}
const Nav: BsPrefixRefForwardingComponent<"div", NavProps> = React.forwardRef<
  HTMLElement,
  NavProps
>((uncontrolledProps, ref) => {
  const {
    as = "div",
    bsPrefix: initialBsPrefix,
    variant,
    fill,
    justify,
    navbar,
    navbarScroll,
    className,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, { activeKey: "onSelect" })
  const bsPrefix = useBootstrapPrefix(initialBsPrefix, "nav")
  let navbarBsPrefix
  let cardHeaderBsPrefix
  let isNavbar = false
  const navbarContext = useContext(NavbarContext)
  const cardHeaderContext = useContext(CardHeaderContext)
  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix
    isNavbar = navbar == null ? true : navbar
  } else if (cardHeaderContext) {
    ;({ cardHeaderBsPrefix } = cardHeaderContext)
  }
  return (
    <BaseNav
      as={as}
      ref={ref}
      activeKey={activeKey}
      className={classNames(className, {
        [bsPrefix]: !isNavbar,
        [`${navbarBsPrefix}-nav`]: isNavbar,
        [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
        [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
        [`${bsPrefix}-${variant}`]: !!variant,
        [`${bsPrefix}-fill`]: fill,
        [`${bsPrefix}-justified`]: justify,
      })}
      {...props}
    />
  )
})
Nav.displayName = "Nav"
Nav.propTypes = propTypes
Nav.defaultProps = defaultProps
export default Object.assign(Nav, {
  Item: NavItem,
  Link: NavLink,
})
import * as React from "react"
import { EventKey } from "@restart/ui/types"
interface NavContextType {
  role?: string
  activeKey: EventKey | null
  getControlledId: (key: EventKey | null) => string
  getControllerId: (key: EventKey | null) => string
}
const NavContext = React.createContext<NavContextType | null>(null)
NavContext.displayName = "NavContext"
export default NavContext
import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import Dropdown, { DropdownProps } from "./Dropdown"
import { DropdownMenuVariant } from "./DropdownMenu"
import NavLink from "./NavLink"
import { BsPrefixRefForwardingComponent } from "./utils"
export interface NavDropdownProps
  extends Omit<DropdownProps, "onSelect" | "title"> {
  title: React.ReactNode
  disabled?: boolean
  active?: boolean
  menuRole?: string
  renderMenuOnMount?: boolean
  rootCloseEvent?: "click" | "mousedown"
  menuVariant?: DropdownMenuVariant
}
const propTypes = {
  id?: string,

  onClick?: () => void,

  title: React.ReactNode,

  disabled?: boolean,

  active?: boolean,

  menuRole?: string,

  renderMenuOnMount?: boolean,
  rootCloseEvent?: string,
  menuVariant: PropTypes.oneOf<DropdownMenuVariant>(["dark"]),

  bsPrefix?: string,
}
const NavDropdown: BsPrefixRefForwardingComponent<"div", NavDropdownProps> =
  React.forwardRef(
    (
      {
        id,
        title,
        children,
        bsPrefix,
        className,
        rootCloseEvent,
        menuRole,
        disabled,
        active,
        renderMenuOnMount,
        menuVariant,
        ...props
      }: NavDropdownProps,
      ref
    ) => {
      /* NavItem has no additional logic, it's purely presentational. Can set nav item class here to support "as" */
      const navItemPrefix = useBootstrapPrefix(undefined, "nav-item")
      return (
        <Dropdown
          ref={ref}
          {...props}
          className={classNames(className, navItemPrefix)}
        >
          <Dropdown.Toggle
            id={id}
            eventKey={null}
            active={active}
            disabled={disabled}
            childBsPrefix={bsPrefix}
            as={NavLink}
          >
            {title}
          </Dropdown.Toggle>
          <Dropdown.Menu
            role={menuRole}
            renderOnMount={renderMenuOnMount}
            rootCloseEvent={rootCloseEvent}
            variant={menuVariant}
          >
            {children}
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  )
NavDropdown.displayName = "NavDropdown"
NavDropdown.propTypes = propTypes
export default Object.assign(NavDropdown, {
  Item: Dropdown.Item,
  ItemText: Dropdown.ItemText,
  Divider: Dropdown.Divider,
  Header: Dropdown.Header,
})
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("nav-item")
import classNames from "classnames"
import * as React from "react"
import Anchor from "@restart/ui/Anchor"
import {
  useNavItem,
  NavItemProps as BaseNavItemProps,
} from "@restart/ui/NavItem"
import { makeEventKey } from "@restart/ui/SelectableContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
export interface NavLinkProps
  extends BsPrefixProps,
    Omit<BaseNavItemProps, "as"> {}
const propTypes = {
  bsPrefix?: string,
  active?: boolean,
  disabled?: boolean,
  role?: string,

  href?: string,
  eventKey?: string | number,

  as?: React.elementType,
}
const defaultProps = {
  disabled: false,
}
const NavLink: BsPrefixRefForwardingComponent<"a", NavLinkProps> =
  React.forwardRef<HTMLElement, NavLinkProps>(
    (
      {
        bsPrefix,
        className,
        as: Component = Anchor,
        active,
        eventKey,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "nav-link")
      const [navItemProps, meta] = useNavItem({
        key: makeEventKey(eventKey, props.href),
        active,
        ...props,
      })
      return (
        <Component
          {...props}
          {...navItemProps}
          ref={ref}
          className={classNames(
            className,
            bsPrefix,
            props.disabled && "disabled",
            meta.isActive && "active"
          )}
        />
      )
    }
  )
NavLink.displayName = "NavLink"
NavLink.propTypes = propTypes
NavLink.defaultProps = defaultProps
export default NavLink
