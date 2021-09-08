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
