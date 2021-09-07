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

  bsPrefix?: string,
  variant?: string,
  expand: true | "sm" | "md" | "lg" | "xl" | "xxl",
  bg?: string,
  fixed?: "top" | "bottom",
  sticky?: "top",
  as: PropTypes.elementType,
  onToggle?: () => void,
  onSelect?: () => void,
  collapseOnSelect?: boolean,
  expanded?: boolean,
  role?: string,
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

  bsPrefix?: string,
  href?: string,
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

  bsPrefix?: string,
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

  bsPrefix?: string,

  label?: string,

  onClick?: () => void,
  children?: React.ReactNode,
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
