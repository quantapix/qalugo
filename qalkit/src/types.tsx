import * as React from "react"
export type EventKey = string | number
export type IntrinsicElementTypes = keyof JSX.IntrinsicElements
export type AssignProps<Inner extends string | React.ComponentType<any>, P> = Omit<
  React.ComponentPropsWithRef<Inner extends React.ElementType ? Inner : never>,
  keyof P
> &
  P
export interface DynamicRefForwardingComponent<
  TInitial extends string | React.ComponentType<any>,
  P = unknown
> {
  <As extends string | React.ComponentType<any> = TInitial>(
    props: React.PropsWithChildren<AssignProps<As, { as?: As } & P>>,
    context?: any
  ): React.ReactElement | null
  propTypes?: any
  contextTypes?: any
  defaultProps?: Partial<P>
  displayName?: string
}
export class DynamicComponent<
  As extends string | React.ComponentType<any>,
  P = unknown
> extends React.Component<AssignProps<As, { as?: As } & P>> {}
export type DynamicComponentClass<
  As extends string | React.ComponentType<any>,
  P = unknown
> = React.ComponentClass<AssignProps<As, { as?: As } & P>>
export type SelectCallback = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => void
export interface TransitionCallbacks {
  onEnter?(node: HTMLElement, isAppearing: boolean): any
  onEntering?(node: HTMLElement, isAppearing: boolean): any
  onEntered?(node: HTMLElement, isAppearing: boolean): any
  onExit?(node: HTMLElement): any
  onExiting?(node: HTMLElement): any
  onExited?(node: HTMLElement): any
}
export interface TransitionProps extends TransitionCallbacks {
  in?: boolean
  appear?: boolean
  children: React.ReactElement
  mountOnEnter?: boolean
  unmountOnExit?: boolean
}
export type TransitionComponent = React.ComponentType<TransitionProps>
export type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | string
export type ButtonVariant =
  | Variant
  | "link"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-dark"
  | "outline-light"
export type Color =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | "white"
  | "muted"
export type Placement = import("@restart/ui/usePopper").Placement
export type AlignDirection = "start" | "end"
export type ResponsiveAlignProp =
  | { sm: AlignDirection }
  | { md: AlignDirection }
  | { lg: AlignDirection }
  | { xl: AlignDirection }
  | { xxl: AlignDirection }
export type AlignType = AlignDirection | ResponsiveAlignProp
const alignDirection = PropTypes.oneOf<AlignDirection>(["start", "end"])
export const alignPropType = 
  alignDirection |
  { sm: alignDirection } |
  { md: alignDirection } |
  { lg: alignDirection } |
  { xl: alignDirection } |
  { xxl: alignDirection },
export type RootCloseEvent = "click" | "mousedown"
export const ATTRIBUTE_PREFIX = `data-rr-ui-` as const;
export const PROPERTY_PREFIX = `rrUi` as const;
export function dataAttr<T extends string>(property: T) {
  return `${ATTRIBUTE_PREFIX}${property}` as const;
}
export function dataProp<T extends string>(property: T) {
  return `${PROPERTY_PREFIX}${property}` as const;
}
