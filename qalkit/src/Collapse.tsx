import classNames from "classnames"
import css from "dom-helpers/css"
import PropTypes from "prop-types"
import React, { useMemo } from "react"
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
  EXITED,
  EXITING,
} from "react-transition-group/Transition"
import { TransitionCallbacks } from "@restart/ui/types"
import transitionEndListener from "./transitionEndListener"
import createChainedFunction from "./utils"
import triggerBrowserReflow from "./triggerBrowserReflow"
import TransitionWrapper from "./TransitionWrapper"
type Dimension = "height" | "width"
export interface CollapseProps
  extends TransitionCallbacks,
    Pick<React.HTMLAttributes<HTMLElement>, "role"> {
  className?: string
  in?: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  appear?: boolean
  timeout?: number
  dimension?: Dimension | (() => Dimension)
  getDimensionValue?: (dimension: Dimension, element: HTMLElement) => number
  children: React.ReactElement
}
const MARGINS: { [d in Dimension]: string[] } = {
  height: ["marginTop", "marginBottom"],
  width: ["marginLeft", "marginRight"],
}
function getDefaultDimensionValue(
  dimension: Dimension,
  elem: HTMLElement
): number {
  const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`
  const value = elem[offset]
  const margins = MARGINS[dimension]
  return (
    value +
    // @ts-ignore
    parseInt(css(elem, margins[0]), 10) +
    // @ts-ignore
    parseInt(css(elem, margins[1]), 10)
  )
}
const collapseStyles = {
  [EXITED]: "collapse",
  [EXITING]: "collapsing",
  [ENTERING]: "collapsing",
  [ENTERED]: "collapse show",
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
  dimension?: "height" | "width" |
    PropTypes.func,
  
  getDimensionValue?: () => void,
  role?: string,
  children: PropTypes.element.isRequired,
}
const defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  getDimensionValue: getDefaultDimensionValue,
}
const Collapse = React.forwardRef<Transition<any>, CollapseProps>(
  (
    {
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      className,
      children,
      dimension = "height",
      getDimensionValue = getDefaultDimensionValue,
      ...props
    },
    ref
  ) => {
    /* Compute dimension */
    const computedDimension =
      typeof dimension === "function" ? dimension() : dimension
    /* -- Expanding -- */
    const handleEnter = useMemo(
      () =>
        createChainedFunction(elem => {
          elem.style[computedDimension] = "0"
        }, onEnter),
      [computedDimension, onEnter]
    )
    const handleEntering = useMemo(
      () =>
        createChainedFunction(elem => {
          const scroll = `scroll${computedDimension[0].toUpperCase()}${computedDimension.slice(
            1
          )}`
          elem.style[computedDimension] = `${elem[scroll]}px`
        }, onEntering),
      [computedDimension, onEntering]
    )
    const handleEntered = useMemo(
      () =>
        createChainedFunction(elem => {
          elem.style[computedDimension] = null
        }, onEntered),
      [computedDimension, onEntered]
    )
    /* -- Collapsing -- */
    const handleExit = useMemo(
      () =>
        createChainedFunction(elem => {
          elem.style[computedDimension] = `${getDimensionValue(
            computedDimension,
            elem
          )}px`
          triggerBrowserReflow(elem)
        }, onExit),
      [onExit, getDimensionValue, computedDimension]
    )
    const handleExiting = useMemo(
      () =>
        createChainedFunction(elem => {
          elem.style[computedDimension] = null
        }, onExiting),
      [computedDimension, onExiting]
    )
    return (
      <TransitionWrapper
        ref={ref}
        addEndListener={transitionEndListener}
        {...props}
        aria-expanded={props.role ? props.in : null}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExiting={handleExiting}
        childRef={(children as any).ref}
      >
        {(state: TransitionStatus, innerProps: Record<string, unknown>) =>
          React.cloneElement(children, {
            ...innerProps,
            className: classNames(
              className,
              children.props.className,
              collapseStyles[state],
              computedDimension === "width" && "collapse-horizontal"
            ),
          })
        }
      </TransitionWrapper>
    )
  }
)
// @ts-ignore
Collapse.propTypes = propTypes
// @ts-ignore
Collapse.defaultProps = defaultProps
export default Collapse
