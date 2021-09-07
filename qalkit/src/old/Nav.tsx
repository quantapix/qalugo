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
  /**
   * @default 'nav'
   */
  bsPrefix: PropTypes.string,
  /** @private */
  navbarBsPrefix: PropTypes.string,
  /** @private */
  cardHeaderBsPrefix: PropTypes.string,
  /**
   * The visual variant of the nav items.
   *
   * @type {('tabs'|'pills')}
   */
  variant: PropTypes.string,
  /**
   * Marks the NavItem with a matching `eventKey` (or `href` if present) as active.
   */
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Have all `NavItem`s proportionately fill all available width.
   */
  fill: PropTypes.bool,
  /**
   * Have all `NavItem`s evenly fill all available width.
   *
   * @type {boolean}
   */
  justify: all(PropTypes.bool, ({ justify, navbar }) =>
    justify && navbar ? Error("justify navbar `Nav`s are not supported") : null
  ),
  /**
   * A callback fired when a NavItem is selected.
   *
   * ```js
   * function (
   *  Any eventKey,
   *  SyntheticEvent event?
   * )
   * ```
   */
  onSelect: PropTypes.func,
  /**
   * ARIA role for the Nav, in the context of a TabContainer, the default will
   * be set to "tablist", but can be overridden by the Nav when set explicitly.
   *
   * When the role is "tablist", NavLink focus is managed according to
   * the ARIA authoring practices for tabs:
   * https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel
   */
  role: PropTypes.string,
  /**
   * Apply styling an alignment for use in a Navbar. This prop will be set
   * automatically when the Nav is used inside a Navbar.
   */
  navbar: PropTypes.bool,
  /**
   * Enable vertical scrolling within the toggleable contents of a collapsed Navbar.
   */
  navbarScroll: PropTypes.bool,
  as: PropTypes.elementType,
  /** @private */
  onKeyDown: PropTypes.func,
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
  role?: string // used by NavLink to determine it's role
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
  /**
   * An html id attribute for the Toggle button, necessary for assistive technologies, such as screen readers.
   * @type {string}
   */
  id: PropTypes.string,
  /** An `onClick` handler passed to the Toggle component */
  onClick: PropTypes.func,
  /** The content of the non-toggle Button.  */
  title: PropTypes.node.isRequired,
  /** Disables the toggle NavLink  */
  disabled: PropTypes.bool,
  /** Style the toggle NavLink as active  */
  active: PropTypes.bool,
  /** An ARIA accessible role applied to the Menu component. When set to 'menu', The dropdown */
  menuRole: PropTypes.string,
  /** Whether to render the dropdown menu in the DOM before the first time it is shown */
  renderMenuOnMount: PropTypes.bool,
  /**
   *  Which event when fired outside the component will cause it to be closed.
   *
   * _see [DropdownMenu](#menu-props) for more details_
   */
  rootCloseEvent: PropTypes.string,
  /**
   * Menu color variant.
   *
   * Omitting this will use the default light color.
   */
  menuVariant: PropTypes.oneOf<DropdownMenuVariant>(["dark"]),
  /** @ignore */
  bsPrefix: PropTypes.string,
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
  /**
   * @default 'nav-link'
   */
  bsPrefix: PropTypes.string,
  /**
   * The active state of the NavItem item.
   */
  active: PropTypes.bool,
  /**
   * The disabled state of the NavItem item.
   */
  disabled: PropTypes.bool,
  /**
   * The ARIA role for the `NavLink`, In the context of a 'tablist' parent Nav,
   * the role defaults to 'tab'
   * */
  role: PropTypes.string,
  /** The HTML href attribute for the `NavLink` */
  href: PropTypes.string,
  /**
   * Uniquely identifies the `NavItem` amongst its siblings,
   * used to determine and control the active state of the parent `Nav`
   */
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** @default 'a' */
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
