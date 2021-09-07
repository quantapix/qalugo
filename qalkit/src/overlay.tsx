import * as React from "react"
import { useRef } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import BaseOverlay, {
  OverlayProps as BaseOverlayProps,
  OverlayArrowProps,
} from "@restart/ui/Overlay"
import { componentOrElement, elementType } from "prop-types-extra"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import useOverlayOffset from "./use"
import Fade from "./Fade"
import { TransitionType } from "./helpers"
import { Placement, RootCloseEvent } from "./types"
import safeFindDOMNode from "./safeFindDOMNode"
export interface OverlayInjectedProps {
  ref: React.RefCallback<HTMLElement>
  style: React.CSSProperties
  "aria-labelledby"?: string
  arrowProps: Partial<OverlayArrowProps>
  show: boolean
  placement: Placement | undefined
  popper: {
    state: any
    outOfBoundaries: boolean
    placement: Placement | undefined
    scheduleUpdate?: () => void
  }
  [prop: string]: any
}
export type OverlayChildren =
  | React.ReactElement<OverlayInjectedProps>
  | ((injected: OverlayInjectedProps) => React.ReactNode)
export interface OverlayProps
  extends Omit<BaseOverlayProps, "children" | "transition" | "rootCloseEvent"> {
  children: OverlayChildren
  transition?: TransitionType
  placement?: Placement
  rootCloseEvent?: RootCloseEvent
}
const propTypes = {
  container?: componentOrElement | PropTypes.func,
  target?: componentOrElement | PropTypes.func,
  show?: boolean,
  popperConfig: PropTypes.object,
  rootClose?: boolean,
  rootCloseEvent: PropTypes.oneOf<RootCloseEvent>(["click", "mousedown"]),
  onHide?: () => void,
  transition?: boolean | elementType,
  onEnter?: () => void,
  onEntering?: () => void,
  onEntered?: () => void,
  onExit?: () => void,
  onExiting?: () => void,
  onExited?: () => void,
  placement: PropTypes.oneOf<Placement>([
    "auto-start",
    "auto",
    "auto-end",
    "top-start",
    "top",
    "top-end",
    "right-start",
    "right",
    "right-end",
    "bottom-end",
    "bottom",
    "bottom-start",
    "left-end",
    "left",
    "left-start",
  ]),
}
const defaultProps: Partial<OverlayProps> = {
  transition: Fade,
  rootClose: false,
  show: false,
  placement: "top",
}
function wrapRefs(props, arrowProps) {
  const { ref } = props
  const { ref: aRef } = arrowProps
  props.ref = ref.__wrapped || (ref.__wrapped = r => ref(safeFindDOMNode(r)))
  arrowProps.ref =
    aRef.__wrapped || (aRef.__wrapped = r => aRef(safeFindDOMNode(r)))
}
const Overlay = React.forwardRef<HTMLElement, OverlayProps>(
  (
    { children: overlay, transition, popperConfig = {}, ...outerProps },
    outerRef
  ) => {
    const popperRef = useRef({})
    const [ref, modifiers] = useOverlayOffset()
    const mergedRef = useMergedRefs(outerRef, ref)
    const actualTransition =
      transition === true ? Fade : transition || undefined
    return (
      <BaseOverlay
        {...outerProps}
        ref={mergedRef}
        popperConfig={{
          ...popperConfig,
          modifiers: modifiers.concat(popperConfig.modifiers || []),
        }}
        transition={actualTransition}
      >
        {(overlayProps, { arrowProps, placement, popper: popperObj, show }) => {
          wrapRefs(overlayProps, arrowProps)
          const popper = Object.assign(popperRef.current, {
            state: popperObj?.state,
            scheduleUpdate: popperObj?.update,
            placement,
            outOfBoundaries:
              popperObj?.state?.modifiersData.hide?.isReferenceHidden || false,
          })
          if (typeof overlay === "function")
            return overlay({
              ...overlayProps,
              placement,
              show,
              ...(!transition && show && { className: "show" }),
              popper,
              arrowProps,
            })
          return React.cloneElement(overlay as React.ReactElement, {
            ...overlayProps,
            placement,
            arrowProps,
            popper,
            className: classNames(
              (overlay as React.ReactElement).props.className,
              !transition && show && "show"
            ),
            style: {
              ...(overlay as React.ReactElement).props.style,
              ...overlayProps.style,
            },
          })
        }}
      </BaseOverlay>
    )
  }
)
Overlay.displayName = "Overlay"
Overlay.propTypes = propTypes
Overlay.defaultProps = defaultProps
export default Overlay
import contains from "dom-helpers/contains"
import PropTypes from "prop-types"
import * as React from "react"
import { cloneElement, useCallback, useRef } from "react"
import useTimeout from "@restart/hooks/useTimeout"
import warning from "warning"
import { useUncontrolledProp } from "uncontrollable"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import Overlay, { OverlayChildren, OverlayProps } from "./Overlay"
import safeFindDOMNode from "./safeFindDOMNode"
export type OverlayTriggerType = "hover" | "click" | "focus"
export type OverlayDelay = number | { show: number; hide: number }
export type OverlayInjectedProps = {
  onFocus?: (...args: any[]) => any
}
export type OverlayTriggerRenderProps = OverlayInjectedProps & {
  ref: React.Ref<any>
}
export interface OverlayTriggerProps
  extends Omit<OverlayProps, "children" | "target"> {
  children:
    | React.ReactElement
    | ((props: OverlayTriggerRenderProps) => React.ReactNode)
  trigger?: OverlayTriggerType | OverlayTriggerType[]
  delay?: OverlayDelay
  show?: boolean
  defaultShow?: boolean
  onToggle?: (nextShow: boolean) => void
  flip?: boolean
  overlay: OverlayChildren
  target?: never
  onHide?: never
}
function normalizeDelay(delay?: OverlayDelay) {
  return delay && typeof delay === "object"
    ? delay
    : {
        show: delay,
        hide: delay,
      }
}
function handleMouseOverOut(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  handler: (...args: [React.MouseEvent, ...any[]]) => any,
  args: [React.MouseEvent, ...any[]],
  relatedNative: "fromElement" | "toElement"
) {
  const [e] = args
  const target = e.currentTarget
  const related = e.relatedTarget || e.nativeEvent[relatedNative]
  if ((!related || related !== target) && !contains(target, related)) {
    handler(...args)
  }
}
const triggerType = "click" | "hover" | "focus"
const propTypes = {
  children: PropTypes.element | PropTypes.func;
  trigger?: triggerType | triggerType[];
  delay?:
    number | 
    PropTypes.shape({
      show?: number,
      hide?: number,
    }),
  show?: boolean,
  defaultShow?: boolean,
  onToggle?: () => void,
  flip?: boolean,
  overlay?: PropTypes.func | PropTypes.element.isRequired,
  popperConfig: PropTypes.object,
  target?: null,
  onHide?: null,
  placement?: 
    "auto-start" |
    "auto" |
    "auto-end" |
    "top-start" |
    "top" |
    "top-end" |
    "right-start" |
    "right" |
    "right-end" |
    "bottom-end" |
    "bottom" |
    "bottom-start" |
    "left-end" |
    "left" |
    "left-start"
  ,
}
const defaultProps = {
  defaultShow: false,
  trigger: ["hover", "focus"],
}
function OverlayTrigger({
  trigger,
  overlay,
  children,
  popperConfig = {},
  show: propsShow,
  defaultShow = false,
  onToggle,
  delay: propsDelay,
  placement,
  flip = placement && placement.indexOf("auto") !== -1,
  ...props
}: OverlayTriggerProps) {
  const triggerNodeRef = useRef(null)
  const mergedRef = useMergedRefs<unknown>(
    triggerNodeRef,
    (children as any).ref
  )
  const timeout = useTimeout()
  const hoverStateRef = useRef<string>("")
  const [show, setShow] = useUncontrolledProp(propsShow, defaultShow, onToggle)
  const delay = normalizeDelay(propsDelay)
  const { onFocus, onBlur, onClick } =
    typeof children !== "function"
      ? React.Children.only(children).props
      : ({} as any)
  const attachRef = (r: React.ComponentClass | Element | null | undefined) => {
    mergedRef(safeFindDOMNode(r))
  }
  const handleShow = useCallback(() => {
    timeout.clear()
    hoverStateRef.current = "show"
    if (!delay.show) {
      setShow(true)
      return
    }
    timeout.set(() => {
      if (hoverStateRef.current === "show") setShow(true)
    }, delay.show)
  }, [delay.show, setShow, timeout])
  const handleHide = useCallback(() => {
    timeout.clear()
    hoverStateRef.current = "hide"
    if (!delay.hide) {
      setShow(false)
      return
    }
    timeout.set(() => {
      if (hoverStateRef.current === "hide") setShow(false)
    }, delay.hide)
  }, [delay.hide, setShow, timeout])
  const handleFocus = useCallback(
    (...args: any[]) => {
      handleShow()
      onFocus?.(...args)
    },
    [handleShow, onFocus]
  )
  const handleBlur = useCallback(
    (...args: any[]) => {
      handleHide()
      onBlur?.(...args)
    },
    [handleHide, onBlur]
  )
  const handleClick = useCallback(
    (...args: any[]) => {
      setShow(!show)
      onClick?.(...args)
    },
    [onClick, setShow, show]
  )
  const handleMouseOver = useCallback(
    (...args: [React.MouseEvent, ...any[]]) => {
      handleMouseOverOut(handleShow, args, "fromElement")
    },
    [handleShow]
  )
  const handleMouseOut = useCallback(
    (...args: [React.MouseEvent, ...any[]]) => {
      handleMouseOverOut(handleHide, args, "toElement")
    },
    [handleHide]
  )
  const triggers: string[] = trigger == null ? [] : [].concat(trigger as any)
  const triggerProps: any = {
    ref: attachRef,
  }
  if (triggers.indexOf("click") !== -1) {
    triggerProps.onClick = handleClick
  }
  if (triggers.indexOf("focus") !== -1) {
    triggerProps.onFocus = handleFocus
    triggerProps.onBlur = handleBlur
  }
  if (triggers.indexOf("hover") !== -1) {
    warning(
      triggers.length > 1,
      '[react-bootstrap] Specifying only the `"hover"` trigger limits the visibility of the overlay to just mouse users. Consider also including the `"focus"` trigger so that touch and keyboard only users can see the overlay as well.'
    )
    triggerProps.onMouseOver = handleMouseOver
    triggerProps.onMouseOut = handleMouseOut
  }
  return (
    <>
      {typeof children === "function"
        ? children(triggerProps)
        : cloneElement(children, triggerProps)}
      <Overlay
        {...props}
        show={show}
        onHide={handleHide}
        flip={flip}
        placement={placement}
        popperConfig={popperConfig}
        target={triggerNodeRef.current}
      >
        {overlay}
      </Overlay>
    </>
  )
}
OverlayTrigger.propTypes = propTypes
OverlayTrigger.defaultProps = defaultProps
export default OverlayTrigger
