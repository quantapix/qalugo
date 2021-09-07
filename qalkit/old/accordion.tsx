import classNames from "classnames"
import * as React from "react"
import { useMemo } from "react"
import { useUncontrolled } from "uncontrollable"
import { useBootstrapPrefix } from "./utils"
import {
  BsPrefixProps,
  BsPrefixOnlyProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from "./helpers"
import { useContext } from "react"
import { Transition } from "react-transition-group"
import { Collapse, CollapseProps } from "./utils"

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect">,
    BsPrefixProps {
  activeKey?: string
  defaultActiveKey?: string
  onSelect?: SelectCallback
  flush?: boolean
}
const propTypes = {
  as: elementType,
  /** @default 'accordion' */
  bsPrefix: string,
  activeKey: string,
  defaultActiveKey: string,
  flush: bool,
}
export const Accordion: BsPrefixRefForwardingComponent<
  "div",
  AccordionProps
> = React.forwardRef<HTMLElement, AccordionProps>((props, ref) => {
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
Object.assign(Accordion, {
  Button: AccordionButton,
  Collapse: AccordionCollapse,
  Item: AccordionItem,
  Header: AccordionHeader,
  Body: AccordionBody,
})
export interface AccordionBodyProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  as: elementType,
  /** @default 'accordion-body' */
  bsPrefix: string,
}
export const AccordionBody: BsPrefixRefForwardingComponent<
  "div",
  AccordionBodyProps
> = React.forwardRef<HTMLElement, AccordionBodyProps>(
  ({ as: Component = "div", bsPrefix, className, ...props }, ref) => {
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
type EventHandler = React.EventHandler<React.SyntheticEvent>
export interface AccordionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BsPrefixProps {}
const propTypes = {
  as: elementType,
  /** @default 'accordion-button' */
  bsPrefix: string,
  onClick: func,
}
export function useAccordionButton(
  eventKey: string,
  onClick?: EventHandler
): EventHandler {
  const { activeEventKey, onSelect } = useContext(AccordionContext)
  return e => {
    const eventKeyPassed = eventKey === activeEventKey ? null : eventKey
    if (onSelect) onSelect(eventKeyPassed, e)
    if (onClick) onClick(e)
  }
}
export const AccordionButton: BsPrefixRefForwardingComponent<
  "div",
  AccordionButtonProps
> = React.forwardRef<HTMLButtonElement, AccordionButtonProps>(
  (
    { as: Component = "button", bsPrefix, className, onClick, ...props },
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
export interface AccordionCollapseProps
  extends BsPrefixOnlyProps,
    CollapseProps {
  eventKey: string
}
const propTypes = {
  eventKey: string.isRequired,
  children: element.isRequired,
}
export const AccordionCollapse: BsPrefixRefForwardingComponent<
  "div",
  AccordionCollapseProps
> = React.forwardRef<Transition<any>, AccordionCollapseProps>(
  ({ bsPrefix, className, children, eventKey, ...props }, ref) => {
    const { activeEventKey } = useContext(AccordionContext)
    bsPrefix = useBootstrapPrefix(bsPrefix, "accordion-collapse")
    return (
      <Collapse
        ref={ref}
        in={activeEventKey === eventKey}
        {...props}
        className={classNames(className, bsPrefix)}
      >
        <div>{React.Children.only(children)}</div>
      </Collapse>
    )
  }
) as any
AccordionCollapse.propTypes = propTypes
AccordionCollapse.displayName = "AccordionCollapse"
export interface AccordionContextValue {
  activeEventKey?: string
  onSelect?: SelectCallback
}
export const context = React.createContext<AccordionContextValue>({})
context.displayName = "AccordionContext"
export interface AccordionHeaderProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {}
const propTypes = {
  as: elementType,
  /** @default 'accordion-header' */
  bsPrefix: string,
  onClick: func,
}
export const AccordionHeader: BsPrefixRefForwardingComponent<
  "h2",
  AccordionHeaderProps
> = React.forwardRef<HTMLElement, AccordionHeaderProps>(
  (
    { as: Component = "h2", bsPrefix, className, children, onClick, ...props },
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
export interface AccordionItemProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  eventKey: string
}
const propTypes = {
  as: elementType,
  /** @default 'accordion-item' */
  bsPrefix: string,
  /** @required */
  eventKey: string.isRequired,
}
export const AccordionItem: BsPrefixRefForwardingComponent<
  "div",
  AccordionItemProps
> = React.forwardRef<HTMLElement, AccordionItemProps>(
  ({ as: Component = "div", bsPrefix, className, eventKey, ...props }, ref) => {
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
export interface AccordionItemContextValue {
  eventKey: string
}
export const context = React.createContext<AccordionItemContextValue>({
  eventKey: "",
})
context.displayName = "AccordionItemContext"
