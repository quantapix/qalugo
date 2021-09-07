import * as React from "react"
import { useEffect, useMemo, useRef, useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import useTimeout from "@restart/hooks/useTimeout"
import { TransitionComponent } from "@restart/ui/types"
import ToastFade from "./ToastFade"
import ToastHeader from "./ToastHeader"
import ToastBody from "./ToastBody"
import { useBootstrapPrefix } from "./ThemeProvider"
import ToastContext from "./ToastContext"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { Variant } from "./types"
export interface ToastProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  animation?: boolean
  autohide?: boolean
  delay?: number
  onClose?: () => void
  show?: boolean
  transition?: TransitionComponent
  bg?: Variant
}
const propTypes = {
  bsPrefix?: string,
  animation: PropTypes.bool,
  autohide: PropTypes.bool,
  delay: PropTypes.number,
  onClose: PropTypes.func,
  show: PropTypes.bool,
  transition: PropTypes.elementType,
  /**
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  bg?: string,
}
const Toast: BsPrefixRefForwardingComponent<"div", ToastProps> =
  React.forwardRef<HTMLDivElement, ToastProps>(
    (
      {
        bsPrefix,
        className,
        transition: Transition = ToastFade,
        show = true,
        animation = true,
        delay = 5000,
        autohide = false,
        onClose,
        bg,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "toast")
      const delayRef = useRef(delay)
      const onCloseRef = useRef(onClose)
      useEffect(() => {
        delayRef.current = delay
        onCloseRef.current = onClose
      }, [delay, onClose])
      const autohideTimeout = useTimeout()
      const autohideToast = !!(autohide && show)
      const autohideFunc = useCallback(() => {
        if (autohideToast) {
          onCloseRef.current?.()
        }
      }, [autohideToast])
      useEffect(() => {
        autohideTimeout.set(autohideFunc, delayRef.current)
      }, [autohideTimeout, autohideFunc])
      const toastContext = useMemo(
        () => ({
          onClose,
        }),
        [onClose]
      )
      const hasAnimation = !!(Transition && animation)
      const toast = (
        <div
          {...props}
          ref={ref}
          className={classNames(
            bsPrefix,
            className,
            bg && `bg-${bg}`,
            !hasAnimation && (show ? "show" : "hide")
          )}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        />
      )
      return (
        <ToastContext.Provider value={toastContext}>
          {hasAnimation && Transition ? (
            <Transition in={show} unmountOnExit>
              {toast}
            </Transition>
          ) : (
            toast
          )}
        </ToastContext.Provider>
      )
    }
  )
Toast.propTypes = propTypes
Toast.displayName = "Toast"
export default Object.assign(Toast, {
  Body: ToastBody,
  Header: ToastHeader,
})
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("toast-body")
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export type ToastPosition =
  | "top-start"
  | "top-center"
  | "top-end"
  | "middle-start"
  | "middle-center"
  | "middle-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end"
export interface ToastContainerProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  position?: ToastPosition
}
const propTypes = {
  bsPrefix?: string,
  position: PropTypes.oneOf<ToastPosition>([
    "top-start",
    "top-center",
    "top-end",
    "middle-start",
    "middle-center",
    "middle-end",
    "bottom-start",
    "bottom-center",
    "bottom-end",
  ]),
}
const positionClasses = {
  "top-start": "top-0 start-0",
  "top-center": "top-0 start-50 translate-middle-x",
  "top-end": "top-0 end-0",
  "middle-start": "top-50 start-0 translate-middle-y",
  "middle-center": "top-50 start-50 translate-middle",
  "middle-end": "top-50 end-0 translate-middle-y",
  "bottom-start": "bottom-0 start-0",
  "bottom-center": "bottom-0 start-50 translate-middle-x",
  "bottom-end": "bottom-0 end-0",
}
const ToastContainer: BsPrefixRefForwardingComponent<
  "div",
  ToastContainerProps
> = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  (
    {
      bsPrefix,
      position,
      className,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "toast-container")
    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(
          bsPrefix,
          position && `position-absolute ${positionClasses[position]}`,
          className
        )}
      />
    )
  }
)
ToastContainer.displayName = "ToastContainer"
ToastContainer.propTypes = propTypes
export default ToastContainer
import * as React from "react"
export interface ToastContextType {
  onClose?: (e: Event) => void
}
const ToastContext = React.createContext<ToastContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose() {},
})
export default ToastContext
import * as React from "react"
import Transition, {
  ENTERING,
  EXITING,
} from "react-transition-group/Transition"
import Fade, { FadeProps } from "./Fade"
const fadeStyles = {
  [ENTERING]: "showing",
  [EXITING]: "showing show",
}
const ToastFade = React.forwardRef<Transition<any>, FadeProps>((props, ref) => (
  <Fade {...props} ref={ref} transitionClasses={fadeStyles} />
))
ToastFade.displayName = "ToastFade"
export default ToastFade
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import useEventCallback from "@restart/hooks/useEventCallback"
import { useBootstrapPrefix } from "./ThemeProvider"
import CloseButton, { CloseButtonVariant } from "./CloseButton"
import ToastContext from "./ToastContext"
import { BsPrefixOnlyProps } from "./helpers"
export interface ToastHeaderProps
  extends BsPrefixOnlyProps,
    React.HTMLAttributes<HTMLDivElement> {
  closeLabel?: string
  closeVariant?: CloseButtonVariant
  closeButton?: boolean
}
const propTypes = {
  bsPrefix?: string,
  closeLabel?: string,
  closeVariant: PropTypes.oneOf<CloseButtonVariant>(["white"]),
  closeButton: PropTypes.bool,
}
const defaultProps = {
  closeLabel: "Close",
  closeButton: true,
}
const ToastHeader = React.forwardRef<HTMLDivElement, ToastHeaderProps>(
  (
    {
      bsPrefix,
      closeLabel,
      closeVariant,
      closeButton,
      className,
      children,
      ...props
    }: ToastHeaderProps,
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "toast-header")
    const context = useContext(ToastContext)
    const handleClick = useEventCallback(e => {
      context?.onClose?.(e)
    })
    return (
      <div ref={ref} {...props} className={classNames(bsPrefix, className)}>
        {children}
        {closeButton && (
          <CloseButton
            aria-label={closeLabel}
            variant={closeVariant}
            onClick={handleClick}
            data-dismiss="toast"
          />
        )}
      </div>
    )
  }
)
ToastHeader.displayName = "ToastHeader"
ToastHeader.propTypes = propTypes
ToastHeader.defaultProps = defaultProps
export default ToastHeader
