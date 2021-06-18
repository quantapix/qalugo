import * as React from "react"
import classNames from "classnames"
import camelize from "dom-helpers/camelize"
import { useBootstrapPrefix } from "./utils"
import { BsPrefixRefForwardingComponent } from "./helpers"
import invariant from "invariant"
import { useCallback } from "react"
import useMergedRefs from "@restart/hooks/useMergedRefs"

export function map<P = any>(
  children,
  func: (el: React.ReactElement<P>, index: number) => any
) {
  let index = 0
  return React.Children.map(children, child =>
    React.isValidElement<P>(child) ? func(child, index++) : child
  )
}
export function forEach<P = any>(
  children,
  func: (el: React.ReactElement<P>, index: number) => void
) {
  let index = 0
  React.Children.forEach(children, child => {
    if (React.isValidElement<P>(child)) func(child, index++)
  })
}
export function createChainedFunction(...funcs) {
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
        acc.apply(this, args)
        f.apply(this, args)
      }
    }, null)
}
const pascalCase = str => str[0].toUpperCase() + camelize(str).slice(1)
interface BsPrefixOptions<As extends React.ElementType = "div"> {
  displayName?: string
  Component?: As
  defaultProps?: Partial<React.ComponentProps<As>>
}
export function createWithBsPrefix<As extends React.ElementType = "div">(
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
export function divWithClassName(className: string) {
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>((p, ref) => (
    <div
      {...p}
      ref={ref}
      className={classNames((p as any).className, className)}
    />
  ))
}
export function useWrappedRefWithWarning(ref, componentName) {
  if (!__DEV__) return ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const warningRef = useCallback(
    refValue => {
      invariant(
        refValue == null || !refValue.isReactComponent,
        `${componentName} injected a ref to a provided \`as\` component that resolved to a component instance instead of a DOM element. ` +
          "Use `React.forwardRef` to provide the injected ref to the class component as a prop in order to pass it directly to a DOM element"
      )
    },
    [componentName]
  )
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMergedRefs(warningRef, ref)
}
export function triggerBrowserReflow(node: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  node.offsetHeight
}
