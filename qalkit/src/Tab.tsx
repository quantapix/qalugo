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
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  tabClassName: PropTypes.string,
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
  id: PropTypes.string,
  /**
   * @type {{Transition | false}}
   * @default {Fade}
   */
  transition: PropTypes.oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.elementType,
  ]),
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  generateChildId: PropTypes.func,
  onSelect: PropTypes.func,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  bsPrefix: PropTypes.string,
  as: PropTypes.elementType,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  transition: PropTypes.oneOfType([PropTypes.bool, PropTypes.elementType]),
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,

  id: PropTypes.string,

  "aria-labelledby": PropTypes.string,
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
