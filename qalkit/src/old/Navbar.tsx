import classNames from "classnames"
import * as React from "react"
import { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import SelectableContext from "@restart/ui/SelectableContext"
import { SelectCallback } from "@restart/ui/types"
import { useUncontrolled } from "uncontrollable"
import createWithBsPrefix from "./createWithBsPrefix"
import NavbarBrand from "./NavbarBrand"
import NavbarCollapse from "./NavbarCollapse"
import NavbarToggle from "./NavbarToggle"
import { useBootstrapPrefix } from "./ThemeProvider"
import NavbarContext, { NavbarContextType } from "./NavbarContext"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
const NavbarText = createWithBsPrefix("navbar-text", {
  Component: "span",
})
export interface NavbarProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  variant?: "light" | "dark"
  expand?: boolean | "sm" | "md" | "lg" | "xl" | "xxl"
  bg?: string
  fixed?: "top" | "bottom"
  sticky?: "top"
  onToggle?: (expanded: boolean) => void
  onSelect?: SelectCallback
  collapseOnSelect?: boolean
  expanded?: boolean
}
const propTypes = {
  /** @default 'navbar' */
  bsPrefix: PropTypes.string,
  /**
   * The general visual variant a the Navbar.
   * Use in combination with the `bg` prop, `background-color` utilities,
   * or your own background styles.
   *
   * @type {('light'|'dark')}
   */
  variant: PropTypes.string,
  /**
   * The breakpoint, below which, the Navbar will collapse.
   * When `true` the Navbar will always be expanded regardless of screen size.
   */
  expand: PropTypes.oneOf([true, "sm", "md", "lg", "xl", "xxl"]).isRequired,
  /**
   * A convenience prop for adding `bg-*` utility classes since they are so commonly used here.
   * `light` and `dark` are common choices but any `bg-*` class is supported, including any custom ones you might define.
   *
   * Pairs nicely with the `variant` prop.
   */
  bg: PropTypes.string,
  /**
   * Create a fixed navbar along the top or bottom of the screen, that scrolls with the
   * page. A convenience prop for the `fixed-*` positioning classes.
   */
  fixed: PropTypes.oneOf(["top", "bottom"]),
  /**
   * Position the navbar at the top of the viewport, but only after scrolling past it.
   * A convenience prop for the `sticky-top` positioning class.
   *
   *  __Not supported in <= IE11 and other older browsers without a polyfill__
   */
  sticky: PropTypes.oneOf(["top"]),
  /**
   * Set a custom element for this component.
   */
  as: PropTypes.elementType,
  /**
   * A callback fired when the `<Navbar>` body collapses or expands. Fired when
   * a `<Navbar.Toggle>` is clicked and called with the new `expanded`
   * boolean value.
   *
   * @controllable expanded
   */
  onToggle: PropTypes.func,
  /**
   * A callback fired when a descendant of a child `<Nav>` is selected. Should
   * be used to execute complex closing or other miscellaneous actions desired
   * after selecting a descendant of `<Nav>`. Does nothing if no `<Nav>` or `<Nav>`
   * descendants exist. The callback is called with an eventKey, which is a
   * prop from the selected `<Nav>` descendant, and an event.
   *
   * ```js
   * function (
   *  eventKey: mixed,
   *  event?: SyntheticEvent
   * )
   * ```
   *
   * For basic closing behavior after all `<Nav>` descendant onSelect events in
   * mobile viewports, try using collapseOnSelect.
   *
   * Note: If you are manually closing the navbar using this `OnSelect` prop,
   * ensure that you are setting `expanded` to false and not *toggling* between
   * true and false.
   */
  onSelect: PropTypes.func,
  /**
   * Toggles `expanded` to `false` after the onSelect event of a descendant of a
   * child `<Nav>` fires. Does nothing if no `<Nav>` or `<Nav>` descendants exist.
   *
   * Manually controlling `expanded` via the onSelect callback is recommended instead,
   * for more complex operations that need to be executed after
   * the `select` event of `<Nav>` descendants.
   */
  collapseOnSelect: PropTypes.bool,
  /**
   * Controls the visiblity of the navbar body
   *
   * @controllable onToggle
   */
  expanded: PropTypes.bool,
  /**
   * The ARIA role for the navbar, will default to 'navigation' for
   * Navbars whose `as` is something other than `<nav>`.
   *
   * @default 'navigation'
   */
  role: PropTypes.string,
}
const defaultProps = {
  expand: true,
  variant: "light" as const,
  collapseOnSelect: false,
}
const Navbar: BsPrefixRefForwardingComponent<"nav", NavbarProps> =
  React.forwardRef<HTMLElement, NavbarProps>((props, ref) => {
    const {
      bsPrefix: initialBsPrefix,
      expand,
      variant,
      bg,
      fixed,
      sticky,
      className,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "nav",
      expanded,
      onToggle,
      onSelect,
      collapseOnSelect,
      ...controlledProps
    } = useUncontrolled(props, {
      expanded: "onToggle",
    })
    const bsPrefix = useBootstrapPrefix(initialBsPrefix, "navbar")
    const handleCollapse = useCallback<SelectCallback>(
      (...args) => {
        onSelect?.(...args)
        if (collapseOnSelect && expanded) {
          onToggle?.(false)
        }
      },
      [onSelect, collapseOnSelect, expanded, onToggle]
    )
    // will result in some false positives but that seems better
    // than false negatives. strict `undefined` check allows explicit
    // "nulling" of the role if the user really doesn't want one
    if (controlledProps.role === undefined && Component !== "nav") {
      controlledProps.role = "navigation"
    }
    let expandClass = `${bsPrefix}-expand`
    if (typeof expand === "string") expandClass = `${expandClass}-${expand}`
    const navbarContext = useMemo<NavbarContextType>(
      () => ({
        onToggle: () => onToggle?.(!expanded),
        bsPrefix,
        expanded: !!expanded,
      }),
      [bsPrefix, expanded, onToggle]
    )
    return (
      <NavbarContext.Provider value={navbarContext}>
        <SelectableContext.Provider value={handleCollapse}>
          <Component
            ref={ref}
            {...controlledProps}
            className={classNames(
              className,
              bsPrefix,
              expand && expandClass,
              variant && `${bsPrefix}-${variant}`,
              bg && `bg-${bg}`,
              sticky && `sticky-${sticky}`,
              fixed && `fixed-${fixed}`
            )}
          />
        </SelectableContext.Provider>
      </NavbarContext.Provider>
    )
  })
Navbar.propTypes = propTypes
Navbar.defaultProps = defaultProps
Navbar.displayName = "Navbar"
export default Object.assign(Navbar, {
  Brand: NavbarBrand,
  Toggle: NavbarToggle,
  Collapse: NavbarCollapse,
  Text: NavbarText,
})
import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface NavbarBrandProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  href?: string
}
const propTypes = {
  /** @default 'navbar' */
  bsPrefix: PropTypes.string,
  /**
   * An href, when provided the Brand will render as an `<a>` element (unless `as` is provided).
   */
  href: PropTypes.string,
  /**
   * Set a custom element for this component.
   */
  as: PropTypes.elementType,
}
const NavbarBrand: BsPrefixRefForwardingComponent<"a", NavbarBrandProps> =
  React.forwardRef<HTMLElement, NavbarBrandProps>(
    ({ bsPrefix, className, as, ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "navbar-brand")
      const Component = as || (props.href ? "a" : "span")
      return (
        <Component
          {...props}
          ref={ref}
          className={classNames(className, bsPrefix)}
        />
      )
    }
  )
NavbarBrand.displayName = "NavbarBrand"
NavbarBrand.propTypes = propTypes
export default NavbarBrand
import * as React from "react"
import { useContext } from "react"
import PropTypes from "prop-types"
import Collapse, { CollapseProps } from "./Collapse"
import { useBootstrapPrefix } from "./ThemeProvider"
import NavbarContext from "./NavbarContext"
import { BsPrefixProps } from "./helpers"
export interface NavbarCollapseProps
  extends Omit<CollapseProps, "children">,
    React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {}
const propTypes = {
  /** @default 'navbar-collapse' */
  bsPrefix: PropTypes.string,
}
const NavbarCollapse = React.forwardRef<HTMLDivElement, NavbarCollapseProps>(
  ({ children, bsPrefix, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "navbar-collapse")
    const context = useContext(NavbarContext)
    return (
      <Collapse in={!!(context && context.expanded)} {...props}>
        <div ref={ref} className={bsPrefix}>
          {children}
        </div>
      </Collapse>
    )
  }
)
NavbarCollapse.displayName = "NavbarCollapse"
NavbarCollapse.propTypes = propTypes
export default NavbarCollapse
import * as React from "react"
// TODO: check
export interface NavbarContextType {
  onToggle: () => void
  bsPrefix?: string
  expanded: boolean
}
const context = React.createContext<NavbarContextType | null>(null)
context.displayName = "NavbarContext"
export default context
import classNames from "classnames"
import * as React from "react"
import { useContext } from "react"
import PropTypes from "prop-types"
import useEventCallback from "@restart/hooks/useEventCallback"
import { useBootstrapPrefix } from "./ThemeProvider"
import NavbarContext from "./NavbarContext"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface NavbarToggleProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  label?: string
}
const propTypes = {
  /** @default 'navbar-toggler' */
  bsPrefix: PropTypes.string,
  /** An accessible ARIA label for the toggler button. */
  label: PropTypes.string,
  /** @private */
  onClick: PropTypes.func,
  /**
   * The toggle content. When empty, the default toggle will be rendered.
   */
  children: PropTypes.node,
  as: PropTypes.elementType,
}
const defaultProps = {
  label: "Toggle navigation",
}
const NavbarToggle: BsPrefixRefForwardingComponent<
  "button",
  NavbarToggleProps
> = React.forwardRef<HTMLElement, NavbarToggleProps>(
  (
    {
      bsPrefix,
      className,
      children,
      label,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "navbar-toggler")
    const { onToggle, expanded } = useContext(NavbarContext) || {}
    const handleClick = useEventCallback(e => {
      if (onClick) onClick(e)
      if (onToggle) onToggle()
    })
    if (Component === "button") {
      ;(props as any).type = "button"
    }
    return (
      <Component
        {...props}
        ref={ref}
        onClick={handleClick}
        aria-label={label}
        className={classNames(className, bsPrefix, !expanded && "collapsed")}
      >
        {children || <span className={`${bsPrefix}-icon`} />}
      </Component>
    )
  }
)
NavbarToggle.displayName = "NavbarToggle"
NavbarToggle.propTypes = propTypes
NavbarToggle.defaultProps = defaultProps
export default NavbarToggle
