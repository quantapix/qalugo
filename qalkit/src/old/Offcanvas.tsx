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
  /**
   * @default 'offcanvas'
   */
  bsPrefix: PropTypes.string,
  /**
   * Include a backdrop component.
   */
  backdrop: PropTypes.bool,
  /**
   * Add an optional extra class name to .offcanvas-backdrop.
   */
  backdropClassName: PropTypes.string,
  /**
   * Closes the offcanvas when escape key is pressed.
   */
  keyboard: PropTypes.bool,
  /**
   * Allow body scrolling while offcanvas is open.
   */
  scroll: PropTypes.bool,
  /**
   * Which side of the viewport the offcanvas will appear from.
   */
  placement: PropTypes.oneOf<OffcanvasPlacement>([
    "start",
    "end",
    "top",
    "bottom",
  ]),
  /**
   * When `true` The offcanvas will automatically shift focus to itself when it
   * opens, and replace it to the last focused element when it closes.
   * Generally this should never be set to false as it makes the offcanvas less
   * accessible to assistive technologies, like screen-readers.
   */
  autoFocus: PropTypes.bool,
  /**
   * When `true` The offcanvas will prevent focus from leaving the offcanvas while
   * open. Consider leaving the default value here, as it is necessary to make
   * the offcanvas work well with assistive technologies, such as screen readers.
   */
  enforceFocus: PropTypes.bool,
  /**
   * When `true` The offcanvas will restore focus to previously focused element once
   * offcanvas is hidden
   */
  restoreFocus: PropTypes.bool,
  /**
   * Options passed to focus function when `restoreFocus` is set to `true`
   *
   * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
   */
  restoreFocusOptions: PropTypes.shape({
    preventScroll: PropTypes.bool,
  }),
  /**
   * When `true` The offcanvas will show itself.
   */
  show: PropTypes.bool,
  /**
   * A callback fired when the offcanvas is opening.
   */
  onShow: PropTypes.func,
  /**
   * A callback fired when the header closeButton or backdrop is
   * clicked. Required if either are specified.
   */
  onHide: PropTypes.func,
  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   */
  onEscapeKeyDown: PropTypes.func,
  /**
   * Callback fired before the offcanvas transitions in
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired as the offcanvas begins to transition in
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired after the offcanvas finishes transitioning in
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired right before the offcanvas transitions out
   */
  onExit: PropTypes.func,
  /**
   * Callback fired as the offcanvas begins to transition out
   */
  onExiting: PropTypes.func,
  /**
   * Callback fired after the offcanvas finishes transitioning out
   */
  onExited: PropTypes.func,
  /**
   * @private
   */
  container: PropTypes.any,
  "aria-labelledby": PropTypes.string,
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
          // Have to use a different modal manager since the shared
          // one handles overflow.
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
  /**
   * @default 'offcanvas-header'
   */
  bsPrefix: PropTypes.string,
  /**
   * Provides an accessible label for the close
   * button. It is used for Assistive Technology when the label text is not
   * readable.
   */
  closeLabel: PropTypes.string,
  /**
   * Sets the variant for close button.
   */
  closeVariant: PropTypes.oneOf<CloseButtonVariant>(["white"]),
  /**
   * Specify whether the Component should contain a close button
   */
  closeButton: PropTypes.bool,
  /**
   * A Callback fired when the close button is clicked. If used directly inside
   * a Offcanvas component, the onHide will automatically be propagated up to the
   * parent Offcanvas `onHide`.
   */
  onHide: PropTypes.func,
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
  /**
   * Show the component; triggers the fade in or fade out animation
   */
  in: PropTypes.bool,
  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter: PropTypes.bool,
  /**
   * Unmount the component (remove it from the DOM) when it is faded out
   */
  unmountOnExit: PropTypes.bool,
  /**
   * Run the fade in animation when the component mounts, if it is initially
   * shown
   */
  appear: PropTypes.bool,
  /**
   * Duration of the fade animation in milliseconds, to ensure that finishing
   * callbacks are fired even if the original browser transition end events are
   * canceled
   */
  timeout: PropTypes.number,
  /**
   * Callback fired before the component fades in
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired after the component starts to fade in
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired after the has component faded in
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired before the component fades out
   */
  onExit: PropTypes.func,
  /**
   * Callback fired after the component starts to fade out
   */
  onExiting: PropTypes.func,
  /**
   * Callback fired after the component has faded out
   */
  onExited: PropTypes.func,
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
