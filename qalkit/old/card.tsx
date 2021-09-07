import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./utils"
import { createWithBsPrefix, divWithClassName } from "./functions"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { Color, Variant } from "./types"
import { useMemo } from "react"
//export createWithBsPrefix('card-columns');
//export createWithBsPrefix('card-group');

const DivStyledAsH5 = divWithClassName("h5")
const DivStyledAsH6 = divWithClassName("h6")
const CardBody = createWithBsPrefix("card-body")
const CardTitle = createWithBsPrefix("card-title", {
  Component: DivStyledAsH5,
})
const CardSubtitle = createWithBsPrefix("card-subtitle", {
  Component: DivStyledAsH6,
})
const CardLink = createWithBsPrefix("card-link", { Component: "a" })
const CardText = createWithBsPrefix("card-text", { Component: "p" })
const CardFooter = createWithBsPrefix("card-footer")
const CardImgOverlay = createWithBsPrefix("card-img-overlay")
export interface CardProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  bg?: Variant
  text?: Color
  border?: Variant
  body?: boolean
}
const propTypes = {
  /**
   * @default 'card'
   */
  bsPrefix: string,
  /**
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  bg: string,
  /**
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light'|'white'|'muted')}
   */
  text: string,
  /**
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  border: string,
  body: bool,
  as: elementType,
}
const defaultProps = {
  body: false,
}
export const Card: BsPrefixRefForwardingComponent<
  "div",
  CardProps
> = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      bsPrefix,
      className,
      bg,
      text,
      border,
      body,
      children,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "card")
    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(
          className,
          prefix,
          bg && `bg-${bg}`,
          text && `text-${text}`,
          border && `border-${border}`
        )}
      >
        {body ? <CardBody>{children}</CardBody> : children}
      </Component>
    )
  }
)
Card.displayName = "Card"
Card.propTypes = propTypes
Card.defaultProps = defaultProps
Object.assign(Card, {
  Img: CardImg,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Body: CardBody,
  Link: CardLink,
  Text: CardText,
  Header: CardHeader,
  Footer: CardFooter,
  ImgOverlay: CardImgOverlay,
})
export interface CardHeaderProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  /**
   * @default 'card-header'
   */
  bsPrefix: string,
  as: elementType,
}
export const CardHeader: BsPrefixRefForwardingComponent<
  "div",
  CardHeaderProps
> = React.forwardRef<HTMLElement, CardHeaderProps>(
  ({ bsPrefix, className, as: Component = "div", ...props }, ref) => {
    const prefix = useBootstrapPrefix(bsPrefix, "card-header")
    const contextValue = useMemo(
      () => ({
        cardHeaderBsPrefix: prefix,
      }),
      [prefix]
    )
    return (
      <CardHeaderContext.Provider value={contextValue}>
        <Component
          ref={ref}
          {...props}
          className={classNames(className, prefix)}
        />
      </CardHeaderContext.Provider>
    )
  }
)
CardHeader.displayName = "CardHeader"
CardHeader.propTypes = propTypes
interface CardHeaderContextValue {
  cardHeaderBsPrefix: string
}
export const context = React.createContext<CardHeaderContextValue | null>(null)
context.displayName = "CardHeaderContext"
export interface CardImgProps
  extends BsPrefixProps,
    React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "top" | "bottom"
}
const propTypes = {
  /**
   * @default 'card-img'
   */
  bsPrefix: string,
  /**
   * @type {('top'|'bottom')}
   */
  variant: oneOf(["top", "bottom"]),
  as: elementType,
}
export const CardImg: BsPrefixRefForwardingComponent<
  "img",
  CardImgProps
> = React.forwardRef(
  (
    {
      bsPrefix,
      className,
      variant,
      as: Component = "img",
      ...props
    }: CardImgProps,
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "card-img")
    return (
      <Component
        ref={ref}
        className={classNames(
          variant ? `${prefix}-${variant}` : prefix,
          className
        )}
        {...props}
      />
    )
  }
)
CardImg.displayName = "CardImg"
CardImg.propTypes = propTypes
