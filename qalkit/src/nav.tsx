import classNames from "classnames"
import PropTypes from "prop-types"
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
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
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
  as: PropTypes.elementType,

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
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import Dropdown, { DropdownProps } from "./Dropdown"
import { DropdownMenuVariant } from "./DropdownMenu"
import NavLink from "./NavLink"
import { BsPrefixRefForwardingComponent } from "./helpers"
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
import PropTypes from "prop-types"
import * as React from "react"
import Anchor from "@restart/ui/Anchor"
import {
  useNavItem,
  NavItemProps as BaseNavItemProps,
} from "@restart/ui/NavItem"
import { makeEventKey } from "@restart/ui/SelectableContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
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

  as: PropTypes.elementType,
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
