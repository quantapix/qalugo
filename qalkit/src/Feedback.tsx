import classNames from "classnames"
import * as React from "react"
import { AsProp, BsPrefixRefForwardingComponent } from "./helpers"
export type FeedbackType = "valid" | "invalid"
export interface FeedbackProps
  extends AsProp,
    React.HTMLAttributes<HTMLElement> {
  bsPrefix?: never
  type?: FeedbackType
  tooltip?: boolean
}
const propTypes = {
  type?: string,

  tooltip?: boolean,
  as?: React.elementType,
}
const Feedback: BsPrefixRefForwardingComponent<"div", FeedbackProps> =
  React.forwardRef(
    (
      {
        as: Component = "div",
        className,
        type = "valid",
        tooltip = false,
        ...props
      },
      ref
    ) => (
      <Component
        {...props}
        ref={ref}
        className={classNames(
          className,
          `${type}-${tooltip ? "tooltip" : "feedback"}`
        )}
      />
    )
  )
Feedback.displayName = "Feedback"
Feedback.propTypes = propTypes
export default Feedback
