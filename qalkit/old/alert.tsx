import classNames from "classnames"
import * as React from "react"
import { elementType } from "prop-types-extra"
import { useUncontrolled } from "uncontrollable"
import useEventCallback from "@restart/hooks/useEventCallback"
import { Fade, useBootstrapPrefix } from "./utils"
import { CloseButton, CloseButtonVariant } from "./close"
import { Variant } from "./types"
import { divWithClassName, createWithBsPrefix}  from "./functions"
import { SafeAnchor } from "./utils"
import { TransitionType } from "./helpers"
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  bsPrefix?: string
  variant?: Variant
  dismissible?: boolean
  show?: boolean
  onClose?: (a: any, b: any) => void
  closeLabel?: string
  closeVariant?: CloseButtonVariant
  transition?: TransitionType
}
const DivStyledAsH4 = divWithClassName("h4")
DivStyledAsH4.displayName = "DivStyledAsH4"
const AlertHeading = createWithBsPrefix("alert-heading", {
  Component: DivStyledAsH4,
})
const AlertLink = createWithBsPrefix("alert-link", {
  Component: SafeAnchor,
})
const propTypes = {
  /**
   * @default 'alert'
   */
  bsPrefix: string,
  /**
   * @type {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'}
   */
  variant: string,
  dismissible: bool,
  /**
   * @controllable onClose
   */
  show: bool,
  /**
   * @controllable show
   */
  onClose: func,
  closeLabel: string,
  closeVariant: oneOf<CloseButtonVariant>(["white"]),
  transition: oneOfType([PropTypes.bool, elementType]),
}
const defaultProps = {
  show: true,
  transition: Fade,
  closeLabel: "Close alert",
}
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (uncontrolledProps: AlertProps, ref) => {
    const {
      bsPrefix,
      show,
      closeLabel,
      closeVariant,
      className,
      children,
      variant,
      onClose,
      dismissible,
      transition,
      ...props
    } = useUncontrolled(uncontrolledProps, {
      show: "onClose",
    })
    const prefix = useBootstrapPrefix(bsPrefix, "alert")
    const handleClose = useEventCallback(e => {
      if (onClose) {
        onClose(false, e)
      }
    })
    const Transition = transition === true ? Fade : transition
    const alert = (
      <div
        role="alert"
        {...(!Transition ? props : undefined)}
        ref={ref}
        className={classNames(
          className,
          prefix,
          variant && `${prefix}-${variant}`,
          dismissible && `${prefix}-dismissible`
        )}
      >
        {dismissible && (
          <CloseButton
            onClick={handleClose}
            aria-label={closeLabel}
            variant={closeVariant}
          />
        )}
        {children}
      </div>
    )
    if (!Transition) return show ? alert : null
    return (
      <Transition unmountOnExit {...props} ref={undefined} in={show}>
        {alert}
      </Transition>
    )
  }
)
Alert.displayName = "Alert"
Alert.defaultProps = defaultProps
Alert.propTypes = propTypes
Object.assign(Alert, {
  Link: AlertLink,
  Heading: AlertHeading,
})
