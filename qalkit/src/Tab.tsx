import PropTypes from "prop-types"
import * as React from "react"
import TabContainer from "./TabContainer"
import TabContent from "./TabContent"
import TabPane, { TabPaneProps } from "./TabPane"
export interface TabProps extends Omit<TabPaneProps, "title"> {
  title: React.ReactNode
  disabled?: boolean
  tabClassName?: string
}
/* eslint-disable react/no-unused-prop-types */
const propTypes = {
  eventKey?: string | number,
  title: React.ReactNode,
  disabled?: boolean,
  tabClassName?: string,
}
const Tab: React.FC<TabProps> = () => {
  throw new Error(
    "ReactBootstrap: The `Tab` component is not meant to be rendered! " +
      "It's an abstract component that is only valid as a direct Child of the `Tabs` Component. " +
      "For custom tabs components use TabPane and TabsContainer directly"
  )
  return <></>
}
Tab.propTypes = propTypes
export default Object.assign(Tab, {
  Container: TabContainer,
  Content: TabContent,
  Pane: TabPane,
})
import * as React from "react"
import PropTypes from "prop-types"
import Tabs, { TabsProps } from "@restart/ui/Tabs"
import getTabTransitionComponent from "./getTabTransitionComponent"
import { TransitionType } from "./helpers"
export interface TabContainerProps extends Omit<TabsProps, "transition"> {
  transition?: TransitionType
}
const propTypes = {
  id?: string,
  /**
   * @type {{Transition | false}}
   * @default {Fade}
   */
  transition?: false | PropTypes.elementType,
  mountOnEnter?: boolean,
  unmountOnExit?: boolean,
  generateChildId?: () => void,
  onSelect?: () => void,
  activeKey?: string | number,
}
const TabContainer = ({ transition, ...props }: TabContainerProps) => (
  <Tabs {...props} transition={getTabTransitionComponent(transition)} />
)
TabContainer.propTypes = propTypes
TabContainer.displayName = "TabContainer"
export default TabContainer
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("tab-content")
import classNames from "classnames"
import * as React from "react"
import PropTypes from "prop-types"
import NoopTransition from "@restart/ui/NoopTransition"
import SelectableContext from "@restart/ui/SelectableContext"
import TabContext from "@restart/ui/TabContext"
import { useTabPanel } from "@restart/ui/TabPanel"
import { EventKey, TransitionCallbacks } from "@restart/ui/types"
import { useBootstrapPrefix } from "./ThemeProvider"
import getTabTransitionComponent from "./getTabTransitionComponent"
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  TransitionType,
} from "./helpers"
export interface TabPaneProps
  extends TransitionCallbacks,
    BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  eventKey?: EventKey
  active?: boolean
  transition?: TransitionType
  mountOnEnter?: boolean
  unmountOnExit?: boolean
}
const propTypes = {
  bsPrefix?: string,
  as: PropTypes.elementType,
  eventKey?: string | number,
  active?: boolean,
  transition?: boolean | PropTypes.elementType,
  onEnter?: () => void,
  onEntering?: () => void,
  onEntered?: () => void,
  onExit?: () => void,
  onExiting?: () => void,
  onExited?: () => void,
  mountOnEnter?: boolean,
  unmountOnExit?: boolean,

  id?: string,

  "aria-labelledby"?: string,
}
const TabPane: BsPrefixRefForwardingComponent<"div", TabPaneProps> =
  React.forwardRef<HTMLElement, TabPaneProps>(
    ({ bsPrefix, transition, ...props }, ref) => {
      const [
        {
          className,
          as: Component = "div",
          ...rest
        },
        {
          isActive,
          onEnter,
          onEntering,
          onEntered,
          onExit,
          onExiting,
          onExited,
          mountOnEnter,
          unmountOnExit,
          transition: Transition = NoopTransition,
        },
      ] = useTabPanel({
        ...props,
        transition: getTabTransitionComponent(transition),
      } as any)
      const prefix = useBootstrapPrefix(bsPrefix, "tab-pane")
      return (
        <TabContext.Provider value={null}>
          <SelectableContext.Provider value={null}>
            <Transition
              in={isActive}
              onEnter={onEnter}
              onEntering={onEntering}
              onEntered={onEntered}
              onExit={onExit}
              onExiting={onExiting}
              onExited={onExited}
              mountOnEnter={mountOnEnter}
              unmountOnExit={unmountOnExit as any}
            >
              <Component
                {...rest}
                ref={ref}
                className={classNames(className, prefix, isActive && "active")}
              />
            </Transition>
          </SelectableContext.Provider>
        </TabContext.Provider>
      )
    }
  )
TabPane.displayName = "TabPane"
TabPane.propTypes = propTypes
export default TabPane
