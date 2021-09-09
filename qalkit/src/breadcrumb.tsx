import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import BreadcrumbItem from "./BreadcrumbItem"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
export interface BreadcrumbProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  label?: string
  listProps?: React.OlHTMLAttributes<HTMLOListElement>
}
const propTypes = {
  bsPrefix?: string,
  label?: string,
  listProps?: object,
  as?: React.elementType,
}
const defaultProps = {
  label: "breadcrumb",
  listProps: {},
}
const Breadcrumb: BsPrefixRefForwardingComponent<"nav", BreadcrumbProps> =
  React.forwardRef<HTMLElement, BreadcrumbProps>(
    (
      {
        bsPrefix,
        className,
        listProps,
        children,
        label,
        as: Component = "nav",
        ...props
      },
      ref
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, "breadcrumb")
      return (
        <Component
          aria-label={label}
          className={className}
          ref={ref}
          {...props}
        >
          <ol
            {...listProps}
            className={classNames(prefix, listProps?.className)}
          >
            {children}
          </ol>
        </Component>
      )
    }
  )
Breadcrumb.displayName = "Breadcrumb"
Breadcrumb.propTypes = propTypes
Breadcrumb.defaultProps = defaultProps
export default Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
})
import classNames from "classnames"
import * as React from "react"
import Anchor from "@restart/ui/Anchor"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
export interface BreadcrumbItemProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  active?: boolean
  href?: string
  linkAs?: React.ElementType
  target?: string
  title?: React.ReactNode
  linkProps?: Record<string, any>
}
const propTypes = {
  bsPrefix?: string,
  active?: boolean,
  href?: string,
  linkAs?: React.elementType,
  title?: React.ReactNode,
  target?: string,
  linkProps?: object,
  as?: React.elementType,
}
const defaultProps = {
  active: false,
  linkProps: {},
}
const BreadcrumbItem: BsPrefixRefForwardingComponent<
  "li",
  BreadcrumbItemProps
> = React.forwardRef<HTMLElement, BreadcrumbItemProps>(
  (
    {
      bsPrefix,
      active,
      children,
      className,
      as: Component = "li",
      linkAs: LinkComponent = Anchor,
      linkProps,
      href,
      title,
      target,
      ...props
    },
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "breadcrumb-item")
    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(prefix, className, { active })}
        aria-current={active ? "page" : undefined}
      >
        {active ? (
          children
        ) : (
          <LinkComponent
            {...linkProps}
            href={href}
            title={title}
            target={target}
          >
            {children}
          </LinkComponent>
        )}
      </Component>
    )
  }
)
BreadcrumbItem.displayName = "BreadcrumbItem"
BreadcrumbItem.propTypes = propTypes
BreadcrumbItem.defaultProps = defaultProps
export default BreadcrumbItem
