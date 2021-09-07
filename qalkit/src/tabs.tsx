import * as React from "react"
import PropTypes from "prop-types"
import { useUncontrolled } from "uncontrollable"
import BaseTabs, { TabsProps as BaseTabsProps } from "@restart/ui/Tabs"
import Nav from "./Nav"
import NavLink from "./NavLink"
import NavItem from "./NavItem"
import TabContent from "./TabContent"
import TabPane from "./TabPane"
import { forEach, map } from "./ElementChildren"
import getTabTransitionComponent from "./getTabTransitionComponent"
import { TransitionType } from "./helpers"
export interface TabsProps
  extends Omit<BaseTabsProps, "transition">,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  variant?: "tabs" | "pills"
  transition?: TransitionType
}
const propTypes = {
  activeKey?: string | number,
  defaultActiveKey?: string | number,
  variant?: 'tabs'| 'pills',
  /**
   * @type {Transition | false}
   * @default {Fade}
   */
  transition?: false | PropTypes.elementType,
  id?: string,
  onSelect?: () => void,
  mountOnEnter?: boolean,
  unmountOnExit?: boolean,
}
const defaultProps = {
  variant: "tabs",
  mountOnEnter: false,
  unmountOnExit: false,
}
function getDefaultActiveKey(children) {
  let defaultActiveKey
  forEach(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey
    }
  })
  return defaultActiveKey
}
function renderTab(child) {
  const { title, eventKey, disabled, tabClassName, id } = child.props
  if (title == null) {
    return null
  }
  return (
    <NavItem as="li" role="presentation">
      <NavLink
        as="button"
        type="button"
        eventKey={eventKey}
        disabled={disabled}
        id={id}
        className={tabClassName}
      >
        {title}
      </NavLink>
    </NavItem>
  )
}
const Tabs = (props: TabsProps) => {
  const {
    id,
    onSelect,
    transition,
    mountOnEnter,
    unmountOnExit,
    children,
    activeKey = getDefaultActiveKey(children),
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: "onSelect",
  })
  return (
    <BaseTabs
      id={id}
      activeKey={activeKey}
      onSelect={onSelect}
      transition={getTabTransitionComponent(transition)}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
    >
      <Nav {...controlledProps} role="tablist" as="ul">
        {map(children, renderTab)}
      </Nav>
      <TabContent>
        {map(children, child => {
          const childProps = { ...child.props }
          delete childProps.title
          delete childProps.disabled
          delete childProps.tabClassName
          return <TabPane {...childProps} />
        })}
      </TabContent>
    </BaseTabs>
  )
}
Tabs.propTypes = propTypes
Tabs.defaultProps = defaultProps
Tabs.displayName = "Tabs"
export default Tabs
