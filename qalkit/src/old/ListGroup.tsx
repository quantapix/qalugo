import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import warning from "warning"
import { useUncontrolled } from "uncontrollable"
import BaseNav, { NavProps as BaseNavProps } from "@restart/ui/Nav"
import { EventKey } from "@restart/ui/types"
import { useBootstrapPrefix } from "./ThemeProvider"
import ListGroupItem from "./ListGroupItem"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface ListGroupProps extends BsPrefixProps, BaseNavProps {
  variant?: "flush"
  horizontal?: boolean | "sm" | "md" | "lg" | "xl" | "xxl"
  defaultActiveKey?: EventKey
}
const propTypes = {
  /**
   * @default 'list-group'
   */
  bsPrefix: PropTypes.string,
  /**
   * Adds a variant to the list-group
   *
   * @type {('flush')}
   */
  variant: PropTypes.oneOf(["flush"]),
  /**
   * Changes the flow of the list group items from vertical to horizontal.
   * A value of `null` (the default) sets it to vertical for all breakpoints;
   * Just including the prop sets it for all breakpoints, while `{sm|md|lg|xl|xxl}`
   * makes the list group horizontal starting at that breakpoint’s `min-width`.
   * @type {(true|'sm'|'md'|'lg'|'xl'|'xxl')}
   */
  horizontal: PropTypes.oneOf([true, "sm", "md", "lg", "xl", "xxl"]),
  /**
   * You can use a custom element type for this component.
   */
  as: PropTypes.elementType,
}
const ListGroup: BsPrefixRefForwardingComponent<"div", ListGroupProps> =
  React.forwardRef<HTMLElement, ListGroupProps>((props, ref) => {
    const {
      className,
      bsPrefix: initialBsPrefix,
      variant,
      horizontal,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as = "div",
      ...controlledProps
    } = useUncontrolled(props, {
      activeKey: "onSelect",
    })
    const bsPrefix = useBootstrapPrefix(initialBsPrefix, "list-group")
    let horizontalVariant: string | undefined
    if (horizontal) {
      horizontalVariant =
        horizontal === true ? "horizontal" : `horizontal-${horizontal}`
    }
    warning(
      !(horizontal && variant === "flush"),
      '`variant="flush"` and `horizontal` should not be used together.'
    )
    return (
      <BaseNav
        ref={ref}
        {...controlledProps}
        as={as}
        className={classNames(
          className,
          bsPrefix,
          variant && `${bsPrefix}-${variant}`,
          horizontalVariant && `${bsPrefix}-${horizontalVariant}`
        )}
      />
    )
  })
ListGroup.propTypes = propTypes
ListGroup.displayName = "ListGroup"
export default Object.assign(ListGroup, {
  Item: ListGroupItem,
})
import classNames from "classnames"
import * as React from "react"
import { useCallback } from "react"
import PropTypes from "prop-types"
import BaseNavItem, {
  NavItemProps as BaseNavItemProps,
} from "@restart/ui/NavItem"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { Variant } from "./types"
export interface ListGroupItemProps
  extends Omit<BaseNavItemProps, "onSelect">,
    BsPrefixProps {
  action?: boolean
  onClick?: React.MouseEventHandler
  variant?: Variant
}
const propTypes = {
  /**
   * @default 'list-group-item'
   */
  bsPrefix: PropTypes.string,
  /**
   * Sets contextual classes for list item
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  variant: PropTypes.string,
  /**
   * Marks a ListGroupItem as actionable, applying additional hover, active and disabled styles
   * for links and buttons.
   */
  action: PropTypes.bool,
  /**
   * Sets list item as active
   */
  active: PropTypes.bool,
  /**
   * Sets list item state as disabled
   */
  disabled: PropTypes.bool,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  href: PropTypes.string,
  /**
   * You can use a custom element type for this component. For none `action` items, items render as `li`.
   * For actions the default is an achor or button element depending on whether a `href` is provided.
   *
   * @default {'div' | 'a' | 'button'}
   */
  as: PropTypes.elementType,
}
const defaultProps = {
  variant: undefined,
  active: false,
  disabled: false,
}
const ListGroupItem: BsPrefixRefForwardingComponent<"a", ListGroupItemProps> =
  React.forwardRef<HTMLElement, ListGroupItemProps>(
    (
      {
        bsPrefix,
        active,
        disabled,
        className,
        variant,
        action,
        as,
        onClick,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "list-group-item")
      const handleClick = useCallback(
        event => {
          if (disabled) {
            event.preventDefault()
            event.stopPropagation()
            return
          }
          onClick?.(event)
        },
        [disabled, onClick]
      )
      if (disabled && props.tabIndex === undefined) {
        props.tabIndex = -1
        props["aria-disabled"] = true
      }
      return (
        <BaseNavItem
          ref={ref}
          {...props}
          // eslint-disable-next-line no-nested-ternary
          as={as || (action ? (props.href ? "a" : "button") : "div")}
          onClick={handleClick}
          className={classNames(
            className,
            bsPrefix,
            active && "active",
            disabled && "disabled",
            variant && `${bsPrefix}-${variant}`,
            action && `${bsPrefix}-action`
          )}
        />
      )
    }
  )
ListGroupItem.propTypes = propTypes
ListGroupItem.defaultProps = defaultProps
ListGroupItem.displayName = "ListGroupItem"
export default ListGroupItem
