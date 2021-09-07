import classNames from "classnames"
import * as React from "react"
import { useMemo } from "react"
import PropTypes from "prop-types"
import { SelectCallback } from "@restart/ui/types"
import { useUncontrolled } from "uncontrollable"
import { useBootstrapPrefix } from "./ThemeProvider"
import AccordionBody from "./AccordionBody"
import AccordionButton from "./AccordionButton"
import AccordionCollapse from "./AccordionCollapse"
import AccordionContext from "./AccordionContext"
import AccordionHeader from "./AccordionHeader"
import AccordionItem from "./AccordionItem"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect">,
    BsPrefixProps {
  activeKey?: string
  defaultActiveKey?: string
  onSelect?: SelectCallback
  flush?: boolean
}
const propTypes = {
  as: PropTypes.elementType,
  bsPrefix: PropTypes.string,
  activeKey: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  flush: PropTypes.bool,
}
const Accordion: BsPrefixRefForwardingComponent<"div", AccordionProps> =
  React.forwardRef<HTMLElement, AccordionProps>((props, ref) => {
    const {
      as: Component = "div",
      activeKey,
      bsPrefix,
      className,
      onSelect,
      flush,
      ...controlledProps
    } = useUncontrolled(props, {
      activeKey: "onSelect",
    })
    const prefix = useBootstrapPrefix(bsPrefix, "accordion")
    const contextValue = useMemo(
      () => ({
        activeEventKey: activeKey,
        onSelect,
      }),
      [activeKey, onSelect]
    )
    return (
      <AccordionContext.Provider value={contextValue}>
        <Component
          ref={ref}
          {...controlledProps}
          className={classNames(className, prefix, flush && `${prefix}-flush`)}
        />
      </AccordionContext.Provider>
    )
  })
Accordion.displayName = "Accordion"
Accordion.propTypes = propTypes
export default Object.assign(Accordion, {
  Button: AccordionButton,
  Collapse: AccordionCollapse,
  Item: AccordionItem,
  Header: AccordionHeader,
  Body: AccordionBody,
})
import classNames from "classnames"
import * as React from "react"
import { useContext } from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import AccordionCollapse from "./AccordionCollapse"
import AccordionItemContext from "./AccordionItemContext"
import { BsPrefixRefForwardingComponent, BsPrefixProps } from "./helpers"
export interface AccordionBodyProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  as: PropTypes.elementType,
  bsPrefix: PropTypes.string,
}
const AccordionBody: BsPrefixRefForwardingComponent<"div", AccordionBodyProps> =
  React.forwardRef<HTMLElement, AccordionBodyProps>(
    (
      {
        as: Component = "div",
        bsPrefix,
        className,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-body")
      const { eventKey } = useContext(AccordionItemContext)
      return (
        <AccordionCollapse eventKey={eventKey}>
          <Component
            ref={ref}
            {...props}
            className={classNames(className, bsPrefix)}
          />
        </AccordionCollapse>
      )
    }
  )
AccordionBody.propTypes = propTypes
AccordionBody.displayName = "AccordionBody"
export default AccordionBody
import * as React from "react"
import { useContext } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import AccordionContext from "./AccordionContext"
import AccordionItemContext from "./AccordionItemContext"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { useBootstrapPrefix } from "./ThemeProvider"
type EventHandler = React.EventHandler<React.SyntheticEvent>
export interface AccordionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BsPrefixProps {}
const propTypes = {
  as: PropTypes.elementType,
  bsPrefix: PropTypes.string,
  onClick: PropTypes.func,
}
export function useAccordionButton(
  eventKey: string,
  onClick?: EventHandler
): EventHandler {
  const { activeEventKey, onSelect } = useContext(AccordionContext)
  return e => {
    /*
      Compare the event key in context with the given event key.
      If they are the same, then collapse the component.
    */
    const eventKeyPassed = eventKey === activeEventKey ? null : eventKey
    if (onSelect) onSelect(eventKeyPassed, e)
    if (onClick) onClick(e)
  }
}
const AccordionButton: BsPrefixRefForwardingComponent<
  "div",
  AccordionButtonProps
> = React.forwardRef<HTMLButtonElement, AccordionButtonProps>(
  (
    {
      as: Component = "button",
      bsPrefix,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-button")
    const { eventKey } = useContext(AccordionItemContext)
    const accordionOnClick = useAccordionButton(eventKey, onClick)
    const { activeEventKey } = useContext(AccordionContext)
    if (Component === "button") {
      props.type = "button"
    }
    return (
      <Component
        ref={ref}
        onClick={accordionOnClick}
        {...props}
        aria-expanded={eventKey === activeEventKey}
        className={classNames(
          className,
          bsPrefix,
          eventKey !== activeEventKey && "collapsed"
        )}
      />
    )
  }
)
AccordionButton.propTypes = propTypes
AccordionButton.displayName = "AccordionButton"
export default AccordionButton
import classNames from "classnames"
import * as React from "react"
import { useContext } from "react"
import PropTypes from "prop-types"
import { Transition } from "react-transition-group"
import { useBootstrapPrefix } from "./ThemeProvider"
import Collapse, { CollapseProps } from "./Collapse"
import AccordionContext from "./AccordionContext"
import { BsPrefixRefForwardingComponent, BsPrefixProps } from "./helpers"
export interface AccordionCollapseProps extends BsPrefixProps, CollapseProps {
  eventKey: string
}
const propTypes = {
  as: PropTypes.elementType,
  eventKey: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}
const AccordionCollapse: BsPrefixRefForwardingComponent<
  "div",
  AccordionCollapseProps
> = React.forwardRef<Transition<any>, AccordionCollapseProps>(
  (
    {
      as: Component = "div",
      bsPrefix,
      className,
      children,
      eventKey,
      ...props
    },
    ref
  ) => {
    const { activeEventKey } = useContext(AccordionContext)
    bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-collapse")
    return (
      <Collapse
        ref={ref}
        in={activeEventKey === eventKey}
        {...props}
        className={classNames(className, bsPrefix)}
      >
        <Component>{React.Children.only(children)}</Component>
      </Collapse>
    )
  }
) as any
AccordionCollapse.propTypes = propTypes
AccordionCollapse.displayName = "AccordionCollapse"
export default AccordionCollapse
import * as React from "react"
import { SelectCallback } from "@restart/ui/types"
export interface AccordionContextValue {
  activeEventKey?: string
  onSelect?: SelectCallback
}
const context = React.createContext<AccordionContextValue>({})
context.displayName = "AccordionContext"
export default context
import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import AccordionButton from "./AccordionButton"
import { BsPrefixRefForwardingComponent, BsPrefixProps } from "./helpers"
export interface AccordionHeaderProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  as: PropTypes.elementType,
  bsPrefix: PropTypes.string,
  onClick: PropTypes.func,
}
const AccordionHeader: BsPrefixRefForwardingComponent<
  "h2",
  AccordionHeaderProps
> = React.forwardRef<HTMLElement, AccordionHeaderProps>(
  (
    {
      as: Component = "h2",
      bsPrefix,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-header")
    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(className, bsPrefix)}
      >
        <AccordionButton onClick={onClick}>{children}</AccordionButton>
      </Component>
    )
  }
)
AccordionHeader.propTypes = propTypes
AccordionHeader.displayName = "AccordionHeader"
export default AccordionHeader
import classNames from "classnames"
import * as React from "react"
import { useMemo } from "react"
import PropTypes from "prop-types"
import { useBootstrapPrefix } from "./ThemeProvider"
import AccordionItemContext, {
  AccordionItemContextValue,
} from "./AccordionItemContext"
import { BsPrefixRefForwardingComponent, BsPrefixProps } from "./helpers"
export interface AccordionItemProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  eventKey: string
}
const propTypes = {
  as: PropTypes.elementType,
  bsPrefix: PropTypes.string,
  eventKey: PropTypes.string.isRequired,
}
const AccordionItem: BsPrefixRefForwardingComponent<"div", AccordionItemProps> =
  React.forwardRef<HTMLElement, AccordionItemProps>(
    (
      {
        as: Component = "div",
        bsPrefix,
        className,
        eventKey,
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-item")
      const contextValue = useMemo<AccordionItemContextValue>(
        () => ({
          eventKey,
        }),
        [eventKey]
      )
      return (
        <AccordionItemContext.Provider value={contextValue}>
          <Component
            ref={ref}
            {...props}
            className={classNames(className, bsPrefix)}
          />
        </AccordionItemContext.Provider>
      )
    }
  )
AccordionItem.propTypes = propTypes
AccordionItem.displayName = "AccordionItem"
export default AccordionItem
import * as React from "react"
export interface AccordionItemContextValue {
  eventKey: string
}
const context = React.createContext<AccordionItemContextValue>({
  eventKey: "",
})
context.displayName = "AccordionItemContext"
export default context
