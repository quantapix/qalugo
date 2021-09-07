import classNames from "classnames"
import addEventListener from "dom-helpers/addEventListener"
import canUseDOM from "dom-helpers/canUseDOM"
import ownerDocument from "dom-helpers/ownerDocument"
import removeEventListener from "dom-helpers/removeEventListener"
import getScrollbarSize from "dom-helpers/scrollbarSize"
import useCallbackRef from "@restart/hooks/useCallbackRef"
import useEventCallback from "@restart/hooks/useEventCallback"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import useWillUnmount from "@restart/hooks/useWillUnmount"
import transitionEnd from "dom-helpers/transitionEnd"
import PropTypes from "prop-types"
import * as React from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import BaseModal, { ModalProps as BaseModalProps } from "@restart/ui/Modal"
import { ModalInstance } from "@restart/ui/ModalManager"
import { getSharedManager } from "./BootstrapModalManager"
import Fade from "./Fade"
import ModalBody from "./ModalBody"
import ModalContext from "./ModalContext"
import ModalDialog from "./ModalDialog"
import ModalFooter from "./ModalFooter"
import ModalHeader from "./ModalHeader"
import ModalTitle from "./ModalTitle"
import { BsPrefixRefForwardingComponent } from "./helpers"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
export interface ModalProps
  extends Omit<
    BaseModalProps,
    | "role"
    | "renderBackdrop"
    | "renderDialog"
    | "transition"
    | "backdropTransition"
    | "children"
  > {
  size?: "sm" | "lg" | "xl"
  fullscreen?: true | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down"
  bsPrefix?: string
  centered?: boolean
  backdropClassName?: string
  animation?: boolean
  dialogClassName?: string
  contentClassName?: string
  dialogAs?: React.ElementType
  scrollable?: boolean
  [other: string]: any
}
const propTypes = {
  bsPrefix?: string,
  size?: string,
  fullscreen?: boolean | string,
  centered?: boolean,
  backdrop?: "static" | true | false,
  backdropClassName?: string,
  keyboard?: boolean,
  scrollable?: boolean,
  animation?: boolean,
  dialogClassName?: string,
  contentClassName?: string,
  dialogAs: PropTypes.elementType,
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
  manager: PropTypes.object,
  container: PropTypes.any,
  "aria-labelledby": PropTypes.any,
}
const defaultProps = {
  show: false,
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  animation: true,
  dialogAs: ModalDialog,
}
/* eslint-disable no-use-before-define, react/no-multi-comp */
function DialogTransition(props) {
  return <Fade {...props} timeout={null} />
}
function BackdropTransition(props) {
  return <Fade {...props} timeout={null} />
}
/* eslint-enable no-use-before-define */
const Modal: BsPrefixRefForwardingComponent<"div", ModalProps> =
  React.forwardRef(
    (
      {
        bsPrefix,
        className,
        style,
        dialogClassName,
        contentClassName,
        children,
        dialogAs: Dialog,
        "aria-labelledby": ariaLabelledby,
        /* BaseModal props */
        show,
        animation,
        backdrop,
        keyboard,
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
      const [modalStyle, setStyle] = useState({})
      const [animateStaticModal, setAnimateStaticModal] = useState(false)
      const waitingForMouseUpRef = useRef(false)
      const ignoreBackdropClickRef = useRef(false)
      const removeStaticModalAnimationRef = useRef<(() => void) | null>(null)
      const [modal, setModalRef] = useCallbackRef<ModalInstance>()
      const mergedRef = useMergedRefs(ref, setModalRef)
      const handleHide = useEventCallback(onHide)
      const isRTL = useIsRTL()
      bsPrefix = useBootstrapPrefix(bsPrefix, "modal")
      const modalContext = useMemo(
        () => ({
          onHide: handleHide,
        }),
        [handleHide]
      )
      function getModalManager() {
        if (propsManager) return propsManager
        return getSharedManager({ isRTL })
      }
      function updateDialogStyle(node) {
        if (!canUseDOM) return
        const containerIsOverflowing = getModalManager().getScrollbarWidth() > 0
        const modalIsOverflowing =
          node.scrollHeight > ownerDocument(node).documentElement.clientHeight
        setStyle({
          paddingRight:
            containerIsOverflowing && !modalIsOverflowing
              ? getScrollbarSize()
              : undefined,
          paddingLeft:
            !containerIsOverflowing && modalIsOverflowing
              ? getScrollbarSize()
              : undefined,
        })
      }
      const handleWindowResize = useEventCallback(() => {
        if (modal) {
          updateDialogStyle(modal.dialog)
        }
      })
      useWillUnmount(() => {
        removeEventListener(window as any, "resize", handleWindowResize)
        removeStaticModalAnimationRef.current?.()
      })
      const handleDialogMouseDown = () => {
        waitingForMouseUpRef.current = true
      }
      const handleMouseUp = e => {
        if (
          waitingForMouseUpRef.current &&
          modal &&
          e.target === modal.dialog
        ) {
          ignoreBackdropClickRef.current = true
        }
        waitingForMouseUpRef.current = false
      }
      const handleStaticModalAnimation = () => {
        setAnimateStaticModal(true)
        removeStaticModalAnimationRef.current = transitionEnd(
          modal!.dialog as any,
          () => {
            setAnimateStaticModal(false)
          }
        )
      }
      const handleStaticBackdropClick = e => {
        if (e.target !== e.currentTarget) {
          return
        }
        handleStaticModalAnimation()
      }
      const handleClick = e => {
        if (backdrop === "static") {
          handleStaticBackdropClick(e)
          return
        }
        if (ignoreBackdropClickRef.current || e.target !== e.currentTarget) {
          ignoreBackdropClickRef.current = false
          return
        }
        onHide?.()
      }
      const handleEscapeKeyDown = e => {
        if (!keyboard && backdrop === "static") {
          e.preventDefault()
          handleStaticModalAnimation()
        } else if (keyboard && onEscapeKeyDown) {
          onEscapeKeyDown(e)
        }
      }
      const handleEnter = (node, isAppearing) => {
        if (node) {
          node.style.display = "block"
          updateDialogStyle(node)
        }
        onEnter?.(node, isAppearing)
      }
      const handleExit = node => {
        removeStaticModalAnimationRef.current?.()
        onExit?.(node)
      }
      const handleEntering = (node, isAppearing) => {
        onEntering?.(node, isAppearing)
        addEventListener(window as any, "resize", handleWindowResize)
      }
      const handleExited = node => {
        if (node) node.style.display = ""
        onExited?.(node)
        removeEventListener(window as any, "resize", handleWindowResize)
      }
      const renderBackdrop = useCallback(
        backdropProps => (
          <div
            {...backdropProps}
            className={classNames(
              `${bsPrefix}-backdrop`,
              backdropClassName,
              !animation && "show"
            )}
          />
        ),
        [animation, backdropClassName, bsPrefix]
      )
      const baseModalStyle = { ...style, ...modalStyle }
      if (!animation) {
        baseModalStyle.display = "block"
      }
      const renderDialog = dialogProps => (
        <div
          role="dialog"
          {...dialogProps}
          style={baseModalStyle}
          className={classNames(
            className,
            bsPrefix,
            animateStaticModal && `${bsPrefix}-static`
          )}
          onClick={backdrop ? handleClick : undefined}
          onMouseUp={handleMouseUp}
          aria-labelledby={ariaLabelledby}
        >
          {/*
        // @ts-ignore */}
          <Dialog
            {...props}
            onMouseDown={handleDialogMouseDown}
            className={dialogClassName}
            contentClassName={contentClassName}
          >
            {children}
          </Dialog>
        </div>
      )
      return (
        <ModalContext.Provider value={modalContext}>
          <BaseModal
            show={show}
            ref={mergedRef}
            backdrop={backdrop}
            container={container}
            keyboard
            autoFocus={autoFocus}
            enforceFocus={enforceFocus}
            restoreFocus={restoreFocus}
            restoreFocusOptions={restoreFocusOptions}
            onEscapeKeyDown={handleEscapeKeyDown}
            onShow={onShow}
            onHide={onHide}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={onEntered}
            onExit={handleExit}
            onExiting={onExiting}
            onExited={handleExited}
            manager={getModalManager()}
            transition={animation ? DialogTransition : undefined}
            backdropTransition={animation ? BackdropTransition : undefined}
            renderBackdrop={renderBackdrop}
            renderDialog={renderDialog}
          />
        </ModalContext.Provider>
      )
    }
  )
Modal.displayName = "Modal"
Modal.propTypes = propTypes
Modal.defaultProps = defaultProps
export default Object.assign(Modal, {
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  Footer: ModalFooter,
  Dialog: ModalDialog,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
})
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("modal-body")
import * as React from "react"
interface ModalContextType {
  onHide: () => void
}
const ModalContext = React.createContext<ModalContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHide() {},
})
export default ModalContext
import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps } from "./helpers"
export interface ModalDialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  size?: "sm" | "lg" | "xl"
  fullscreen?: true | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down"
  centered?: boolean
  scrollable?: boolean
  contentClassName?: string
}
const propTypes = {

  bsPrefix?: string,
  contentClassName?: string,
  size?: string,
  fullscreen?: boolean | string,
  centered?: boolean,
  scrollable?: boolean,
}
const ModalDialog = React.forwardRef<HTMLDivElement, ModalDialogProps>(
  (
    {
      bsPrefix,
      className,
      contentClassName,
      centered,
      size,
      fullscreen,
      children,
      scrollable,
      ...props
    }: ModalDialogProps,
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "modal")
    const dialogClass = `${bsPrefix}-dialog`
    const fullScreenClass =
      typeof fullscreen === "string"
        ? `${bsPrefix}-fullscreen-${fullscreen}`
        : `${bsPrefix}-fullscreen`
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(
          dialogClass,
          className,
          size && `${bsPrefix}-${size}`,
          centered && `${dialogClass}-centered`,
          scrollable && `${dialogClass}-scrollable`,
          fullscreen && fullScreenClass
        )}
      >
        <div className={classNames(`${bsPrefix}-content`, contentClassName)}>
          {children}
        </div>
      </div>
    )
  }
)
ModalDialog.displayName = "ModalDialog"
ModalDialog.propTypes = propTypes as any
export default ModalDialog
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("modal-footer")
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { CloseButtonVariant } from "./CloseButton"
import AbstractModalHeader, {
  AbstractModalHeaderProps,
} from "./AbstractModalHeader"
import { BsPrefixOnlyProps } from "./helpers"
export interface ModalHeaderProps
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
const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "modal-header")
    return (
      <AbstractModalHeader
        ref={ref}
        {...props}
        className={classNames(className, bsPrefix)}
      />
    )
  }
)
ModalHeader.displayName = "ModalHeader"
ModalHeader.propTypes = propTypes
ModalHeader.defaultProps = defaultProps
export default ModalHeader
import createWithBsPrefix from "./createWithBsPrefix"
import divWithClassName from "./divWithClassName"
const DivStyledAsH4 = divWithClassName("h4")
export default createWithBsPrefix("modal-title", { Component: DivStyledAsH4 })
