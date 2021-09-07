import classNames from "classnames"
import useEventCallback from "@restart/hooks/useEventCallback"
import PropTypes from "prop-types"
import * as React from "react"
import { useCallback, useMemo, useRef } from "react"
import BaseModal, {
  ModalProps as BaseModalProps,
  ModalHandle,
} from "@restart/ui/Modal"
import Fade from "./Fade"
import OffcanvasBody from "./OffcanvasBody"
import OffcanvasToggling from "./OffcanvasToggling"
import ModalContext from "./ModalContext"
import OffcanvasHeader from "./OffcanvasHeader"
import OffcanvasTitle from "./OffcanvasTitle"
import { BsPrefixRefForwardingComponent } from "./helpers"
import { useBootstrapPrefix } from "./ThemeProvider"
import BootstrapModalManager, {
  getSharedManager,
} from "./BootstrapModalManager"
export type OffcanvasPlacement = "start" | "end" | "top" | "bottom"
export interface OffcanvasProps
  extends Omit<
    BaseModalProps,
    | "role"
    | "renderBackdrop"
    | "renderDialog"
    | "transition"
    | "backdrop"
    | "backdropTransition"
  > {
  bsPrefix?: string
  backdropClassName?: string
  scroll?: boolean
  placement?: OffcanvasPlacement
}
const propTypes = {
  bsPrefix?: string,
  backdrop?: boolean,
  backdropClassName?: string,
  keyboard?: boolean,
  scroll?: boolean,
  placement: PropTypes.oneOf<OffcanvasPlacement>([
    "start",
    "end",
    "top",
    "bottom",
  ]),
  autoFocus?: boolean,
  enforceFocus?: boolean,
  restoreFocus?: boolean,
  restoreFocusOptions: PropTypes.shape({
    preventScroll?: boolean,
  }),
  show?: boolean,
  onShow?: () => void,
  onHide?: () => void,
  onEscapeKeyDown?: () => void,
  onEnter?: () => void,
  onEntering?: () => void,
  onEntered?: () => void,
  onExit?: () => void,
  onExiting?: () => void,
  onExited?: () => void,
  container: PropTypes.any,
  "aria-labelledby"?: string,
}
const defaultProps: Partial<OffcanvasProps> = {
  show: false,
  backdrop: true,
  keyboard: true,
  scroll: false,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  placement: "start",
}
function DialogTransition(props) {
  return <OffcanvasToggling {...props} />
}
function BackdropTransition(props) {
  return <Fade {...props} />
}
const Offcanvas: BsPrefixRefForwardingComponent<"div", OffcanvasProps> =
  React.forwardRef<ModalHandle, OffcanvasProps>(
    (
      {
        bsPrefix,
        className,
        children,
        "aria-labelledby": ariaLabelledby,
        placement,
        /* BaseModal props */
        show,
        backdrop,
        keyboard,
        scroll,
        onEscapeKeyDown,
        onShow,
        onHide,
        container,
        autoFocus,
        enforceFocus,
        restoreFocus,
        restoreFocusOptions,
        onEntered,
        onExit,
        onExiting,
        onEnter,
        onEntering,
        onExited,
        backdropClassName,
        manager: propsManager,
        ...props
      },
      ref
    ) => {
      const modalManager = useRef<BootstrapModalManager>()
      const handleHide = useEventCallback(onHide)
      bsPrefix = useBootstrapPrefix(bsPrefix, "offcanvas")
      const modalContext = useMemo(
        () => ({
          onHide: handleHide,
        }),
        [handleHide]
      )
      function getModalManager() {
        if (propsManager) return propsManager
        if (scroll) {
          if (!modalManager.current)
            modalManager.current = new BootstrapModalManager({
              handleContainerOverflow: false,
            })
          return modalManager.current
        }
        return getSharedManager()
      }
      const handleEnter = (node, ...args) => {
        if (node) node.style.visibility = "visible"
        onEnter?.(node, ...args)
      }
      const handleExited = (node, ...args) => {
        if (node) node.style.visibility = ""
        onExited?.(...args)
      }
      const renderBackdrop = useCallback(
        backdropProps => (
          <div
            {...backdropProps}
            className={classNames(`${bsPrefix}-backdrop`, backdropClassName)}
          />
        ),
        [backdropClassName, bsPrefix]
      )
      const renderDialog = dialogProps => (
        <div
          role="dialog"
          {...dialogProps}
          {...props}
          className={classNames(
            className,
            bsPrefix,
            `${bsPrefix}-${placement}`
          )}
          aria-labelledby={ariaLabelledby}
        >
          {children}
        </div>
      )
      return (
        <ModalContext.Provider value={modalContext}>
          <BaseModal
            show={show}
            ref={ref}
            backdrop={backdrop}
            container={container}
            keyboard={keyboard}
            autoFocus={autoFocus}
            enforceFocus={enforceFocus && !scroll}
            restoreFocus={restoreFocus}
            restoreFocusOptions={restoreFocusOptions}
            onEscapeKeyDown={onEscapeKeyDown}
            onShow={onShow}
            onHide={onHide}
            onEnter={handleEnter}
            onEntering={onEntering}
            onEntered={onEntered}
            onExit={onExit}
            onExiting={onExiting}
            onExited={handleExited}
            manager={getModalManager()}
            transition={DialogTransition}
            backdropTransition={BackdropTransition}
            renderBackdrop={renderBackdrop}
            renderDialog={renderDialog}
          />
        </ModalContext.Provider>
      )
    }
  )
Offcanvas.displayName = "Offcanvas"
Offcanvas.propTypes = propTypes
Offcanvas.defaultProps = defaultProps
export default Object.assign(Offcanvas, {
  Body: OffcanvasBody,
  Header: OffcanvasHeader,
  Title: OffcanvasTitle,
})
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("offcanvas-body")
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { CloseButtonVariant } from "./CloseButton"
import AbstractModalHeader, {
  AbstractModalHeaderProps,
} from "./AbstractModalHeader"
import { BsPrefixOnlyProps } from "./helpers"
export interface OffcanvasHeaderProps
  extends AbstractModalHeaderProps,
    BsPrefixOnlyProps {}
const propTypes = {
  bsPrefix?: string,
  closeLabel?: string,
  closeVariant: PropTypes.oneOf<CloseButtonVariant>(["white"]),
  closeButton?: boolean,
  onHide?: () => void,
}
const defaultProps = {
  closeLabel: "Close",
  closeButton: false,
}
const OffcanvasHeader = React.forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "offcanvas-header")
    return (
      <AbstractModalHeader
        ref={ref}
        {...props}
        className={classNames(className, bsPrefix)}
      />
    )
  }
)
OffcanvasHeader.displayName = "OffcanvasHeader"
OffcanvasHeader.propTypes = propTypes
OffcanvasHeader.defaultProps = defaultProps
export default OffcanvasHeader
import createWithBsPrefix from "./createWithBsPrefix"
import divWithClassName from "./divWithClassName"
const DivStyledAsH5 = divWithClassName("h5")
export default createWithBsPrefix("offcanvas-title", {
  Component: DivStyledAsH5,
})
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
  EXITING,
} from "react-transition-group/Transition"
import { TransitionCallbacks } from "@restart/ui/types"
import transitionEndListener from "./transitionEndListener"
import { BsPrefixOnlyProps } from "./helpers"
import TransitionWrapper from "./TransitionWrapper"
import { useBootstrapPrefix } from "./ThemeProvider"
export interface OffcanvasTogglingProps
  extends TransitionCallbacks,
    BsPrefixOnlyProps {
  className?: string
  in?: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  appear?: boolean
  timeout?: number
  children: React.ReactElement
}
const propTypes = {
  in?: boolean,
  mountOnEnter?: boolean,
  unmountOnExit?: boolean,
  appear?: boolean,
  timeout?: number,
  onEnter?: () => void,
  onEntering?: () => void,
  onEntered?: () => void,
  onExit?: () => void,
  onExiting?: () => void,
  onExited?: () => void,
}
const defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
}
const transitionStyles = {
  [ENTERING]: "show",
  [ENTERED]: "show",
}
const OffcanvasToggling = React.forwardRef<
  Transition<any>,
  OffcanvasTogglingProps
>(({ bsPrefix, className, children, ...props }, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, "offcanvas")
  return (
    <TransitionWrapper
      ref={ref}
      addEndListener={transitionEndListener}
      {...props}
      childRef={(children as any).ref}
    >
      {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
        React.cloneElement(children, {
          ...innerProps,
          className: classNames(
            className,
            children.props.className,
            (status === ENTERING || status === EXITING) &&
              `${bsPrefix}-toggling`,
            transitionStyles[status]
          ),
        })
      }
    </TransitionWrapper>
  )
})
OffcanvasToggling.propTypes = propTypes as any
OffcanvasToggling.defaultProps = defaultProps
OffcanvasToggling.displayName = "OffcanvasToggling"
export default OffcanvasToggling
