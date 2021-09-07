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
  /**
   * Content for the tab title.
   */
  title: PropTypes.node.isRequired,
  /**
   * The disabled state of the tab.
   */
  disabled: PropTypes.bool,
  /**
   * Class to pass to the underlying nav link.
   */
  tabClassName: PropTypes.string,
}
const Tab: React.FC<TabProps> = () => {
  throw new Error(
    "ReactBootstrap: The `Tab` component is not meant to be rendered! " +
      "It's an abstract component that is only valid as a direct Child of the `Tabs` Component. " +
      "For custom tabs components use TabPane and TabsContainer directly"
  )
  // Needed otherwise docs error out.
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
  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   *
   * @type {string}
   */
  id: PropTypes.string,
  /**
   * Sets a default animation strategy for all children `<TabPane>`s.
   * Defaults to `<Fade>` animation; else, use `false` to disable, or a
   * custom react-transition-group `<Transition/>` component.
   *
   * @type {{Transition | false}}
   * @default {Fade}
   */
  transition: PropTypes.oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.elementType,
  ]),
  /**
   * Wait until the first "enter" transition to mount tabs (add them to the DOM)
   */
  mountOnEnter: PropTypes.bool,
  /**
   * Unmount tabs (remove it from the DOM) when they are no longer visible
   */
  unmountOnExit: PropTypes.bool,
  /**
   * A function that takes an `eventKey` and `type` and returns a unique id for
   * child tab `<NavItem>`s and `<TabPane>`s. The function _must_ be a pure
   * function, meaning it should always return the _same_ id for the same set
   * of inputs. The default value requires that an `id` to be set for the
   * `<TabContainer>`.
   *
   * The `type` argument will either be `"tab"` or `"pane"`.
   *
   * @defaultValue (eventKey, type) => `${props.id}-${type}-${eventKey}`
   */
  generateChildId: PropTypes.func,
  /**
   * A callback fired when a tab is selected.
   *
   * @controllable activeKey
   */
  onSelect: PropTypes.func,
  /**
   * The `eventKey` of the currently active tab.
   *
   * @controllable onSelect
   */
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
  /**
   * @default 'tab-pane'
   */
  bsPrefix: PropTypes.string,
  as: PropTypes.elementType,
  /**
   * A key that associates the `TabPane` with it's controlling `NavLink`.
   */
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Toggles the active state of the TabPane, this is generally controlled by a
   * TabContainer.
   */
  active: PropTypes.bool,
  /**
   * Use animation when showing or hiding `<TabPane>`s. Defaults to `<Fade>`
   * animation, else use `false` to disable or a react-transition-group
   * `<Transition/>` component.
   */
  transition: PropTypes.oneOfType([PropTypes.bool, PropTypes.elementType]),
  /**
   * Transition onEnter callback when animation is not `false`
   */
  onEnter: PropTypes.func,
  /**
   * Transition onEntering callback when animation is not `false`
   */
  onEntering: PropTypes.func,
  /**
   * Transition onEntered callback when animation is not `false`
   */
  onEntered: PropTypes.func,
  /**
   * Transition onExit callback when animation is not `false`
   */
  onExit: PropTypes.func,
  /**
   * Transition onExiting callback when animation is not `false`
   */
  onExiting: PropTypes.func,
  /**
   * Transition onExited callback when animation is not `false`
   */
  onExited: PropTypes.func,
  /**
   * Wait until the first "enter" transition to mount the tab (add it to the DOM)
   */
  mountOnEnter: PropTypes.bool,
  /**
   * Unmount the tab (remove it from the DOM) when it is no longer visible
   */
  unmountOnExit: PropTypes.bool,
  /** @ignore * */
  id: PropTypes.string,
  /** @ignore * */
  "aria-labelledby": PropTypes.string,
}
const TabPane: BsPrefixRefForwardingComponent<"div", TabPaneProps> =
  React.forwardRef<HTMLElement, TabPaneProps>(
    ({ bsPrefix, transition, ...props }, ref) => {
      const [
        {
          className,
          // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
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
      // We provide an empty the TabContext so `<Nav>`s in `<TabPanel>`s don't
      // conflict with the top level one.
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
