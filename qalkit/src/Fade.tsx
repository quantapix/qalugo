import classNames from "classnames"
import * as React from "react"
import { useCallback } from "react"
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
} from "react-transition-group/Transition"
import { TransitionCallbacks } from "@restart/ui/types"
import transitionEndListener from "./transitionEndListener"
import triggerBrowserReflow from "./triggerBrowserReflow"
import TransitionWrapper from "./TransitionWrapper"
export interface FadeProps extends TransitionCallbacks {
  className?: string
  in?: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  appear?: boolean
  timeout?: number
  children: React.ReactElement
  transitionClasses?: Record<string, string>
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
  children: React.element,
  transitionClasses?: object,
}
const defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
}
const fadeStyles = {
  [ENTERING]: "show",
  [ENTERED]: "show",
}
const Fade = React.forwardRef<Transition<any>, FadeProps>(
  ({ className, children, transitionClasses = {}, ...props }, ref) => {
    const handleEnter = useCallback(
      (node, isAppearing) => {
        triggerBrowserReflow(node)
        props.onEnter?.(node, isAppearing)
      },
      [props]
    )
    return (
      <TransitionWrapper
        ref={ref}
        addEndListener={transitionEndListener}
        {...props}
        onEnter={handleEnter}
        childRef={(children as any).ref}
      >
        {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
          React.cloneElement(children, {
            ...innerProps,
            className: classNames(
              "fade",
              className,
              children.props.className,
              fadeStyles[status],
              transitionClasses[status]
            ),
          })
        }
      </TransitionWrapper>
    )
  }
)
Fade.propTypes = propTypes as any
Fade.defaultProps = defaultProps
Fade.displayName = "Fade"
export default Fade