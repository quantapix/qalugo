import classNames from "classnames"
import * as React from "react"
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
  bsPrefix?: string,
  variant?: "flush",
  horizontal?: true | "sm" | "md" | "lg" | "xl" | "xxl",
  as?: React.elementType,
}
const ListGroup: BsPrefixRefForwardingComponent<"div", ListGroupProps> =
  React.forwardRef<HTMLElement, ListGroupProps>((props, ref) => {
    const {
      className,
      bsPrefix: initialBsPrefix,
      variant,
      horizontal,
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
  bsPrefix?: string,
  variant?: string,
  action?: boolean,
  active?: boolean,
  disabled?: boolean,
  eventKey?: string | number,
  onClick?: () => void,
  href?: string,
  as?: React.elementType,
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
