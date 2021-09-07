import * as React from "react"
import { TransitionComponent } from "@restart/ui/types"
export type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>
export type ReplaceProps<Inner extends React.ElementType, P> = Omit<
  React.ComponentPropsWithRef<Inner>,
  P
> &
  P
export interface BsPrefixOnlyProps {
  bsPrefix?: string
}
export interface AsProp<As extends React.ElementType = React.ElementType> {
  as?: As
}
export interface BsPrefixProps<As extends React.ElementType = React.ElementType>
  extends BsPrefixOnlyProps,
    AsProp<As> {}
export interface BsPrefixRefForwardingComponent<
  TInitial extends React.ElementType,
  P = unknown
> {
  <As extends React.ElementType = TInitial>(
    props: React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & P>>,
    context?: any
  ): React.ReactElement | null
  propTypes?: any
  contextTypes?: any
  defaultProps?: Partial<P>
  displayName?: string
}
export class BsPrefixComponent<
  As extends React.ElementType,
  P = unknown
> extends React.Component<ReplaceProps<As, BsPrefixProps<As> & P>> {}
export type BsPrefixComponentClass<
  As extends React.ElementType,
  P = unknown
> = React.ComponentClass<ReplaceProps<As, BsPrefixProps<As> & P>>
export type TransitionType = boolean | TransitionComponent
export function getOverlayDirection(placement: string, isRTL?: boolean) {
  let bsDirection = placement
  if (placement === "left") {
    bsDirection = isRTL ? "end" : "start"
  } else if (placement === "right") {
    bsDirection = isRTL ? "start" : "end"
  }
  return bsDirection
}
import ReactDOM from "react-dom"
export default function safeFindDOMNode(
  componentOrElement: React.ComponentClass | Element | null | undefined
) {
  if (componentOrElement && "setState" in componentOrElement) {
    return ReactDOM.findDOMNode(componentOrElement)
  }
  return (componentOrElement ?? null) as Element | Text | null
}
function createChainedFunction(...funcs) {
  return funcs
    .filter(f => f != null)
    .reduce((acc, f) => {
      if (typeof f !== "function") {
        throw new Error(
          "Invalid Argument Type, must only provide functions, undefined, or null."
        )
      }
      if (acc === null) return f
      return function chainedFunction(...args) {
        // @ts-ignore
        acc.apply(this, args)
        // @ts-ignore
        f.apply(this, args)
      }
    }, null)
}
export default createChainedFunction
import classNames from "classnames"
import camelize from "dom-helpers/camelize"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixRefForwardingComponent } from "./helpers"
const pascalCase = str => str[0].toUpperCase() + camelize(str).slice(1)
interface BsPrefixOptions<As extends React.ElementType = "div"> {
  displayName?: string
  Component?: As
  defaultProps?: Partial<React.ComponentProps<As>>
}
export default function createWithBsPrefix<
  As extends React.ElementType = "div"
>(
  prefix: string,
  {
    displayName = pascalCase(prefix),
    Component,
    defaultProps,
  }: BsPrefixOptions<As> = {}
): BsPrefixRefForwardingComponent<As> {
  const BsComponent = React.forwardRef(
    (
      { className, bsPrefix, as: Tag = Component || "div", ...props }: any,
      ref
    ) => {
      const resolvedPrefix = useBootstrapPrefix(bsPrefix, prefix)
      return (
        <Tag
          ref={ref}
          className={classNames(className, resolvedPrefix)}
          {...props}
        />
      )
    }
  )
  BsComponent.defaultProps = defaultProps as any
  BsComponent.displayName = displayName
  return BsComponent as any
}
import * as React from "react"
import classNames from "classnames"
export default (className: string) =>
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((p, ref) => (
    <div
      {...p}
      ref={ref}
      className={classNames((p as any).className, className)}
    />
  ))
import { TransitionComponent } from "@restart/ui/types"
import Fade from "./Fade"
import { TransitionType } from "./helpers"
export default function getTabTransitionComponent(
  transition?: TransitionType
): TransitionComponent | undefined {
  if (typeof transition === "boolean") {
    return transition ? Fade : undefined
  }
  return transition
}
import css from "dom-helpers/css"
import transitionEnd from "dom-helpers/transitionEnd"
function parseDuration(
  node: HTMLElement,
  property: "transitionDuration" | "transitionDelay"
) {
  const str = css(node, property) || ""
  const mult = str.indexOf("ms") === -1 ? 1000 : 1
  return parseFloat(str) * mult
}
export default function transitionEndListener(
  element: HTMLElement,
  handler: (e: TransitionEvent) => void
) {
  const duration = parseDuration(element, "transitionDuration")
  const delay = parseDuration(element, "transitionDelay")
  const remove = transitionEnd(
    element,
    e => {
      if (e.target === element) {
        remove()
        handler(e)
      }
    },
    duration + delay
  )
}
export default function triggerBrowserReflow(node: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  node.offsetHeight
}
