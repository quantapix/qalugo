
import * as React from 'react';

import TabContainer from './TabContainer';
import TabContent from './TabContent';
import TabPane, { TabPaneProps } from './TabPane';
import { EventKey } from './types';

export interface TabProps extends Omit<TabPaneProps, 'title'> {
  eventKey?: EventKey;
  title: React.ReactNode;
  disabled?: boolean;
  tabClassName?: string;
}

/* eslint-disable react/no-unused-prop-types */
const propTypes = {
  eventKey: oneOfType([PropTypes.string, PropTypes.number]),

  
  title: node.isRequired,

  
  disabled: bool,

  
  tabClassName: string,
};

const Tab: React.FC<TabProps> = () => {
  throw new Error(
    'ReactBootstrap: The `Tab` component is not meant to be rendered! ' +
      "It's an abstract component that is only valid as a direct Child of the `Tabs` Component. " +
      'For custom tabs components use TabPane and TabsContainer directly',
  );
  // Needed otherwise docs error out.
  return <></>;
};

Tab.propTypes = propTypes;

export Object.assign(Tab, {
  Container: TabContainer,
  Content: TabContent,
  Pane: TabPane,
});

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('tab-content');


import * as React from 'react';

export interface TabContextType {
  onSelect: any;
  activeKey: any;
  transition: any;
  mountOnEnter: boolean;
  unmountOnExit: boolean;
  getControlledId: (key) => any;
  getControllerId: (key) => any;
}

const TabContext = React.createContext<TabContextType | null>(null);

export TabContext;


import classNames from 'classnames';
import * as React from 'react';
import { useContext } from 'react';


import { useBootstrapPrefix } from './utils';
import TabContext from './TabContext';
import SelectableContext, { makeEventKey } from './SelectableContext';
import Fade from './utils';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  TransitionCallbacks,
  TransitionType,
} from './helpers';
import { EventKey } from './types';

export interface TabPaneProps
  extends TransitionCallbacks,
    BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  eventKey?: EventKey;
  active?: boolean;
  transition?: TransitionType;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const propTypes = {
  /**
   * @default 'tab-pane'
   */
  bsPrefix: string,

  as: elementType,

  
  eventKey: oneOfType([PropTypes.string, PropTypes.number]),

  
  active: bool,

  /**
   * Use animation when showing or hiding `<TabPane>`s. Defaults to `<Fade>`
   * animation, else use `false` to disable or a react-transition-group
   * `<Transition/>` component.
   */
  transition: oneOfType([PropTypes.bool, PropTypes.elementType]),

  
  onEnter: func,

  
  onEntering: func,

  
  onEntered: func,

  
  onExit: func,

  
  onExiting: func,

  
  onExited: func,

  
  mountOnEnter: bool,

  
  unmountOnExit: bool,

  /** @ignore * */
  id: string,

  /** @ignore * */
  'aria-labelledby': string,
};

function useTabContext(props: TabPaneProps) {
  const context = useContext(TabContext);

  if (!context) return props;

  const { activeKey, getControlledId, getControllerId, ...rest } = context;
  const shouldTransition =
    props.transition !== false && rest.transition !== false;

  const key = makeEventKey(props.eventKey);

  return {
    ...props,
    active:
      props.active == null && key != null
        ? makeEventKey(activeKey) === key
        : props.active,
    id: getControlledId(props.eventKey),
    'aria-labelledby': getControllerId(props.eventKey),
    transition:
      shouldTransition && (props.transition || rest.transition || Fade),
    mountOnEnter:
      props.mountOnEnter != null ? props.mountOnEnter : rest.mountOnEnter,
    unmountOnExit:
      props.unmountOnExit != null ? props.unmountOnExit : rest.unmountOnExit,
  };
}

const TabPane: BsPrefixRefForwardingComponent<'div', TabPaneProps> =
  React.forwardRef<HTMLElement, TabPaneProps>((props, ref) => {
    const {
      bsPrefix,
      className,
      active,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      mountOnEnter,
      unmountOnExit,
      transition: Transition,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      eventKey: _,
      ...rest
    } = useTabContext(props);

    const prefix = useBootstrapPrefix(bsPrefix, 'tab-pane');

    if (!active && !Transition && unmountOnExit) return null;

    let pane = (
      <Component
        {...rest}
        ref={ref}
        role="tabpanel"
        aria-hidden={!active}
        className={classNames(className, prefix, { active })}
      />
    );

    if (Transition)
      pane = (
        <Transition
          in={active}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={onEntered}
          onExit={onExit}
          onExiting={onExiting}
          onExited={onExited}
          mountOnEnter={mountOnEnter}
          unmountOnExit={unmountOnExit}
        >
          {pane}
        </Transition>
      );

    // We provide an empty the TabContext so `<Nav>`s in `<TabPane>`s don't
    // conflict with the top level one.
    return (
      <TabContext.Provider value={null}>
        <SelectableContext.Provider value={null}>
          {pane}
        </SelectableContext.Provider>
      </TabContext.Provider>
    );
  });

TabPane.displayName = 'TabPane';
TabPane.propTypes = propTypes;

export TabPane;

import * as React from 'react';


import requiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import { useUncontrolled } from 'uncontrollable';

import Nav from './nav';
import NavLink from './NavLink';
import NavItem from './NavItem';
import TabContainer from './TabContainer';
import TabContent from './TabContent';
import TabPane from './TabPane';

import { forEach, map } from './ElementChildren';
import { SelectCallback, TransitionType } from './helpers';
import { EventKey } from './types';

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  defaultActiveKey?: EventKey;
  onSelect?: SelectCallback;
  variant?: 'tabs' | 'pills';
  transition?: TransitionType;
  id?: string;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const propTypes = {
  /**
   * Mark the Tab with a matching `eventKey` as active.
   *
   * @controllable onSelect
   */
  activeKey: oneOfType([PropTypes.string, PropTypes.number]),
  
  defaultActiveKey: oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Navigation style
   *
   * @type {('tabs'| 'pills')}
   */
  variant: string,

  /**
   * Sets a default animation strategy for all children `<TabPane>`s.
   * Defaults to `<Fade>` animation, else use `false` to disable or a
   * react-transition-group `<Transition/>` component.
   *
   * @type {Transition | false}
   * @default {Fade}
   */
  transition: oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.elementType,
  ]),

  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   *
   * @type {string}
   */
  id: requiredForA11y(PropTypes.string),

  /**
   * Callback fired when a Tab is selected.
   *
   * ```js
   * function (
   *   Any eventKey,
   *   SyntheticEvent event?
   * )
   * ```
   *
   * @controllable activeKey
   */
  onSelect: func,

  
  mountOnEnter: bool,

  
  unmountOnExit: bool,
};

const defaultProps = {
  variant: 'tabs',
  mountOnEnter: false,
  unmountOnExit: false,
};

function getDefaultActiveKey(children) {
  let defaultActiveKey;
  forEach(children, (child) => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}

function renderTab(child) {
  const { title, eventKey, disabled, tabClassName, id } = child.props;
  if (title == null) {
    return null;
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
  );
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
    activeKey: 'onSelect',
  });

  return (
    <TabContainer
      id={id}
      activeKey={activeKey}
      onSelect={onSelect}
      transition={transition}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
    >
      <Nav {...controlledProps} role="tablist" as="ul">
        {map(children, renderTab)}
      </Nav>

      <TabContent>
        {map(children, (child) => {
          const childProps = { ...child.props };

          delete childProps.title;
          delete childProps.disabled;
          delete childProps.tabClassName;

          return <TabPane {...childProps} />;
        })}
      </TabContent>
    </TabContainer>
  );
};

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;
Tabs.displayName = 'Tabs';

export Tabs;
