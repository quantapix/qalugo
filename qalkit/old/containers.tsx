import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface ContainerProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  fluid?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const containerSizes = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'xxl']),
]);

const propTypes = {
  /**
   * @default 'container'
   */
  bsPrefix: string,

  /**
   * Allow the Container to fill all of its available horizontal space.
   * @type {(true|"sm"|"md"|"lg"|"xl"|"xxl")}
   */
  fluid: containerSizes,
  
  as: elementType,
};

const defaultProps = {
  fluid: false,
};

const Container: BsPrefixRefForwardingComponent<'div', ContainerProps> =
  React.forwardRef<HTMLElement, ContainerProps>(
    (
      {
        bsPrefix,
        fluid,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        className,
        ...props
      },
      ref,
    ) => {
      const prefix = useBootstrapPrefix(bsPrefix, 'container');
      const suffix = typeof fluid === 'string' ? `-${fluid}` : '-fluid';
      return (
        <Component
          ref={ref}
          {...props}
          className={classNames(
            className,
            fluid ? `${prefix}${suffix}` : prefix,
          )}
        />
      );
    },
  );

Container.displayName = 'Container';
Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export Container;

import * as React from 'react';
import { useMemo } from 'react';
import PropTypes, { Validator } from 'prop-types';
import { useUncontrolled } from 'uncontrollable';

import TabContext, { TabContextType } from './TabContext';
import SelectableContext from './SelectableContext';
import { SelectCallback, TransitionType } from './helpers';
import { EventKey } from './types';

export interface TabContainerProps extends React.PropsWithChildren<unknown> {
  id?: string;
  transition?: TransitionType;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  generateChildId?: (eventKey: EventKey, type: 'tab' | 'pane') => string;
  onSelect?: SelectCallback;
  activeKey?: EventKey;
  defaultActiveKey?: EventKey;
}

const validateId: Validator<string> = (props, ...args) => {
  let error: Error | null = null;

  if (!props.generateChildId) {
    error = PropTypes.string(props, ...args);

    if (!error && !props.id) {
      error = new Error(
        'In order to properly initialize Tabs in a way that is accessible ' +
          'to assistive technologies (such as screen readers) an `id` or a ' +
          '`generateChildId` prop to TabContainer is required',
      );
    }
  }

  return error;
};

/* eslint-disable react/no-unused-prop-types */
const propTypes = {
  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   *
   * @type {string}
   */
  id: validateId,

  /**
   * Sets a default animation strategy for all children `<TabPane>`s.
   * Defaults to `<Fade>` animation; else, use `false` to disable, or a
   * custom react-transition-group `<Transition/>` component.
   *
   * @type {{Transition | false}}
   * @default {Fade}
   */
  transition: oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.elementType,
  ]),
  
  mountOnEnter: bool,

  
  unmountOnExit: bool,

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
  generateChildId: func,

  /**
   * A callback fired when a tab is selected.
   *
   * @controllable activeKey
   */
  onSelect: func,

  /**
   * The `eventKey` of the currently active tab.
   *
   * @controllable onSelect
   */
  activeKey: oneOfType([PropTypes.string, PropTypes.number]),
};

const TabContainer = (props: TabContainerProps) => {
  const {
    id,
    generateChildId: generateCustomChildId,
    onSelect,
    activeKey,
    transition,
    mountOnEnter,
    unmountOnExit,
    children,
  } = useUncontrolled(props, { activeKey: 'onSelect' });

  const generateChildId = useMemo(
    () =>
      generateCustomChildId ||
      ((key: EventKey, type: string) => (id ? `${id}-${type}-${key}` : null)),
    [id, generateCustomChildId],
  );

  const tabContext: TabContextType = useMemo(
    () => ({
      onSelect,
      activeKey,
      transition,
      mountOnEnter: mountOnEnter || false,
      unmountOnExit: unmountOnExit || false,
      getControlledId: (key: EventKey) => generateChildId(key, 'tabpane'),
      getControllerId: (key: EventKey) => generateChildId(key, 'tab'),
    }),
    [
      onSelect,
      activeKey,
      transition,
      mountOnEnter,
      unmountOnExit,
      generateChildId,
    ],
  );

  return (
    <TabContext.Provider value={tabContext}>
      <SelectableContext.Provider value={onSelect || null}>
        {children}
      </SelectableContext.Provider>
    </TabContext.Provider>
  );
};

TabContainer.propTypes = propTypes;

export TabContainer;

import classNames from 'classnames';

import * as React from 'react';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export type ToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle-start'
  | 'middle-center'
  | 'middle-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export interface ToastContainerProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  position?: ToastPosition;
}

const propTypes = {
  /**
   * @default 'toast-container'
   */
  bsPrefix: string,

  
  position: oneOf<ToastPosition>([
    'top-start',
    'top-center',
    'top-end',
    'middle-start',
    'middle-center',
    'middle-end',
    'bottom-start',
    'bottom-center',
    'bottom-end',
  ]),
};

const positionClasses = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'middle-start': 'top-50 start-0 translate-middle-y',
  'middle-center': 'top-50 start-50 translate-middle',
  'middle-end': 'top-50 end-0 translate-middle-y',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0',
};

const ToastContainer: BsPrefixRefForwardingComponent<
  'div',
  ToastContainerProps
> = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  (
    {
      bsPrefix,
      position,
      className,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'toast-container');

    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(
          bsPrefix,
          position && `position-absolute ${positionClasses[position]}`,
          className,
        )}
      />
    );
  },
);

ToastContainer.displayName = 'ToastContainer';
ToastContainer.propTypes = propTypes;

export ToastContainer;
