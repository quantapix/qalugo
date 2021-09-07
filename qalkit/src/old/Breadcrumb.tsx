import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import BreadcrumbItem from "./BreadcrumbItem"
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
  bsPrefix: PropTypes.string,
  /**
   * ARIA label for the nav element
   * https://www.w3.org/TR/wai-aria-practices/#breadcrumb
   */
  label: PropTypes.string,
  /**
   * Additional props passed as-is to the underlying `<ol>` element
   */
  listProps: PropTypes.object,
  as: PropTypes.elementType,
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
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
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
import PropTypes from "prop-types"
import Anchor from "@restart/ui/Anchor"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
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
  bsPrefix: PropTypes.string,
  /**
   * Adds a visual "active" state to a Breadcrumb
   * Item and disables the link.
   */
  active: PropTypes.bool,
  /**
   * `href` attribute for the inner `a` element
   */
  href: PropTypes.string,
  /**
   * You can use a custom element type for this component's inner link.
   */
  linkAs: PropTypes.elementType,
  /**
   * `title` attribute for the inner `a` element
   */
  title: PropTypes.node,
  /**
   * `target` attribute for the inner `a` element
   */
  target: PropTypes.string,
  /**
   * Additional props passed as-is to the underlying link for non-active items.
   */
  linkProps: PropTypes.object,
  as: PropTypes.elementType,
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
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
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
