import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix, SafeAnchor } from "./utils"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface BreadcrumbProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  label?: string
  listProps?: React.OlHTMLAttributes<HTMLOListElement>
}
const propTypes = {
  /**
   * @default 'breadcrumb'
   */
  bsPrefix: string,
  label: string,
  listProps: object,
  as: elementType,
}
const defaultProps = {
  label: "breadcrumb",
  listProps: {},
}
export const Breadcrumb: BsPrefixRefForwardingComponent<
  "nav",
  BreadcrumbProps
> = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      bsPrefix,
      className,
      listProps,
      children,
      label,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "nav",
      ...props
    },
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "breadcrumb")
    return (
      <Component aria-label={label} className={className} ref={ref} {...props}>
        <ol {...listProps} className={classNames(prefix, listProps?.className)}>
          {children}
        </ol>
      </Component>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"
Breadcrumb.propTypes = propTypes
Breadcrumb.defaultProps = defaultProps
Object.assign(Breadcrumb, {
  Item: BreadcrumbItem,
})
export interface BreadcrumbItemProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  active?: boolean
  href?: string
  linkAs?: React.ElementType
  target?: string
  title?: React.ReactNode
  linkProps?: Record<string, any> // the generic is to much work here
}
const propTypes = {
  /**
   * @default 'breadcrumb-item'
   */
  bsPrefix: string,
  active: bool,
  href: string,
  linkAs: elementType,
  title: node,
  target: string,
  linkProps: object,
  as: elementType,
}
const defaultProps = {
  active: false,
  linkProps: {},
}
export const BreadcrumbItem: BsPrefixRefForwardingComponent<
  "li",
  BreadcrumbItemProps
> = React.forwardRef<HTMLElement, BreadcrumbItemProps>(
  (
    {
      bsPrefix,
      active,
      children,
      className,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "li",
      linkAs: LinkComponent = SafeAnchor,
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
