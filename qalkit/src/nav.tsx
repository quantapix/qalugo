import classNames from 'classnames';


import all from 'prop-types-extra/lib/all';
import * as React from 'react';
import { useContext } from 'react';
import { useUncontrolled } from 'uncontrollable';

import { useBootstrapPrefix } from './utils';
import NavbarContext from './NavbarContext';
import CardHeaderContext from './CardHeaderContext';
import AbstractNav from './AbstractNav';
import NavItem from './NavItem';
import NavLink from './NavLink';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface NavProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  navbarBsPrefix?: string;
  cardHeaderBsPrefix?: string;
  variant?: 'tabs' | 'pills';
  activeKey?: EventKey;
  defaultActiveKey?: EventKey;
  fill?: boolean;
  justify?: boolean;
  onSelect?: SelectCallback;
  navbar?: boolean;
  navbarScroll?: boolean;
}

const propTypes = {
  /**
   * @default 'nav'
   */
  bsPrefix: string,

  /** @private */
  navbarBsPrefix: string,
  /** @private */
  cardHeaderBsPrefix: string,

  /**
   * The visual variant of the nav items.
   *
   * @type {('tabs'|'pills')}
   */
  variant: string,

  
  activeKey: oneOfType([PropTypes.string, PropTypes.number]),

  
  fill: bool,

  /**
   * Have all `NavItem`s evenly fill all available width.
   *
   * @type {boolean}
   */
  justify: all(PropTypes.bool, ({ justify, navbar }) =>
    justify && navbar ? Error('justify navbar `Nav`s are not supported') : null,
  ),

  
  onSelect: func,

  /**
   * ARIA role for the Nav, in the context of a TabContainer, the default will
   * be set to "tablist", but can be overridden by the Nav when set explicitly.
   *
   * When the role is "tablist", NavLink focus is managed according to
   * the ARIA authoring practices for tabs:
   * https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel
   */
  role: string,

  
  navbar: bool,

  
  navbarScroll: bool,

  as: elementType,

  /** @private */
  onKeyDown: func,
};

const defaultProps = {
  justify: false,
  fill: false,
};

const Nav: BsPrefixRefForwardingComponent<'div', NavProps> = React.forwardRef<
  HTMLElement,
  NavProps
>((uncontrolledProps, ref) => {
  const {
    as = 'div',
    bsPrefix: initialBsPrefix,
    variant,
    fill,
    justify,
    navbar,
    navbarScroll,
    className,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, { activeKey: 'onSelect' });

  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav');

  let navbarBsPrefix;
  let cardHeaderBsPrefix;
  let isNavbar = false;

  const navbarContext = useContext(NavbarContext);
  const cardHeaderContext = useContext(CardHeaderContext);

  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix;
    isNavbar = navbar == null ? true : navbar;
  } else if (cardHeaderContext) {
    ({ cardHeaderBsPrefix } = cardHeaderContext);
  }

  return (
    <AbstractNav
      as={as}
      ref={ref}
      activeKey={activeKey}
      className={classNames(className, {
        [bsPrefix]: !isNavbar,
        [`${navbarBsPrefix}-nav`]: isNavbar,
        [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
        [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
        [`${bsPrefix}-${variant}`]: !!variant,
        [`${bsPrefix}-fill`]: fill,
        [`${bsPrefix}-justified`]: justify,
      })}
      {...props}
    />
  );
});

Nav.displayName = 'Nav';
Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export Object.assign(Nav, {
  Item: NavItem,
  Link: NavLink,
});

import qsa from 'dom-helpers/querySelectorAll';

import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import useForceUpdate from '@restart/hooks/useForceUpdate';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import NavContext from './NavContext';
import SelectableContext, { makeEventKey } from './SelectableContext';
import TabContext from './TabContext';
import { BsPrefixRefForwardingComponent, SelectCallback } from './helpers';
import { EventKey } from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const propTypes = {
  onSelect: func,

  as: elementType,

  role: string,

  /** @private */
  onKeyDown: func,
  /** @private */
  parentOnSelect: func,
  /** @private */
  activeKey: oneOfType([PropTypes.string, PropTypes.number]),
};

interface AbstractNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  activeKey?: EventKey;
  as?: React.ElementType;
  onSelect?: SelectCallback;
  parentOnSelect?: SelectCallback;
}

const AbstractNav: BsPrefixRefForwardingComponent<'ul', AbstractNavProps> =
  React.forwardRef<HTMLElement, AbstractNavProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'ul',
        onSelect,
        activeKey,
        role,
        onKeyDown,
        ...props
      },
      ref,
    ) => {
      // A ref and forceUpdate for refocus, b/c we only want to trigger when needed
      // and don't want to reset the set in the effect
      const forceUpdate = useForceUpdate();
      const needsRefocusRef = useRef(false);

      const parentOnSelect = useContext(SelectableContext);
      const tabContext = useContext(TabContext);

      let getControlledId, getControllerId;

      if (tabContext) {
        role = role || 'tablist';
        activeKey = tabContext.activeKey;
        getControlledId = tabContext.getControlledId;
        getControllerId = tabContext.getControllerId;
      }

      const listNode = useRef<HTMLElement>(null);

      const getNextActiveChild = (offset: number) => {
        const currentListNode = listNode.current;
        if (!currentListNode) return null;

        const items = qsa(
          currentListNode,
          '[data-rb-event-key]:not(.disabled)',
        );
        const activeChild =
          currentListNode.querySelector<HTMLElement>('.active');
        if (!activeChild) return null;

        const index = items.indexOf(activeChild);
        if (index === -1) return null;

        let nextIndex = index + offset;
        if (nextIndex >= items.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = items.length - 1;
        return items[nextIndex];
      };

      const handleSelect = (key, event) => {
        if (key == null) return;
        onSelect?.(key, event);
        parentOnSelect?.(key, event);
      };

      const handleKeyDown = (event) => {
        onKeyDown?.(event);

        let nextActiveChild;
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            nextActiveChild = getNextActiveChild(-1);
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            nextActiveChild = getNextActiveChild(1);
            break;
          default:
            return;
        }
        if (!nextActiveChild) return;

        event.preventDefault();
        handleSelect(nextActiveChild.dataset.rbEventKey, event);
        needsRefocusRef.current = true;
        forceUpdate();
      };

      useEffect(() => {
        if (listNode.current && needsRefocusRef.current) {
          const activeChild = listNode.current.querySelector<HTMLElement>(
            '[data-rb-event-key].active',
          );

          activeChild?.focus();
        }

        needsRefocusRef.current = false;
      });

      const mergedRef = useMergedRefs(ref, listNode);

      return (
        <SelectableContext.Provider value={handleSelect}>
          <NavContext.Provider
            value={{
              role, // used by NavLink to determine it's role
              activeKey: makeEventKey(activeKey),
              getControlledId: getControlledId || noop,
              getControllerId: getControllerId || noop,
            }}
          >
            <Component
              {...props}
              onKeyDown={handleKeyDown}
              ref={mergedRef}
              role={role}
            />
          </NavContext.Provider>
        </SelectableContext.Provider>
      );
    },
  );

AbstractNav.propTypes = propTypes;

export AbstractNav;

import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';

import warning from 'warning';
import NavContext from './NavContext';
import SelectableContext, { makeEventKey } from './SelectableContext';
import { BsPrefixRefForwardingComponent } from './helpers';
import { EventKey } from './types';

export interface AbstractNavItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  as: React.ElementType;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  tabIndex?: number;
  onSelect?: (navKey: string, e: any) => void;
}

const propTypes = {
  id: string,
  active: bool,
  role: string,

  href: string,
  tabIndex: oneOfType([PropTypes.number, PropTypes.string]),
  eventKey: oneOfType([PropTypes.string, PropTypes.number]),
  onclick: func,

  as: any,
  onClick: func,
  onSelect: func,

  'aria-controls': string,
};

const defaultProps = {
  disabled: false,
};

const AbstractNavItem: BsPrefixRefForwardingComponent<
  'div',
  AbstractNavItemProps
> = React.forwardRef<HTMLElement, AbstractNavItemProps>(
  (
    { active, className, eventKey, onSelect, onClick, as: Component, ...props },
    ref,
  ) => {
    const navKey = makeEventKey(eventKey, props.href);
    const parentOnSelect = useContext(SelectableContext);
    const navContext = useContext(NavContext);

    let isActive = active;
    if (navContext) {
      if (!props.role && navContext.role === 'tablist') props.role = 'tab';

      const contextControllerId = navContext.getControllerId(navKey);
      const contextControlledId = navContext.getControlledId(navKey);

      warning(
        !contextControllerId || !props.id,
        `[react-bootstrap] The provided id '${props.id}' was overwritten by the current navContext with '${contextControllerId}'.`,
      );
      warning(
        !contextControlledId || !props['aria-controls'],
        `[react-bootstrap] The provided aria-controls value '${props['aria-controls']}' was overwritten by the current navContext with '${contextControlledId}'.`,
      );

      props['data-rb-event-key'] = navKey;
      props.id = contextControllerId || props.id;
      props['aria-controls'] = contextControlledId || props['aria-controls'];

      isActive =
        active == null && navKey != null
          ? navContext.activeKey === navKey
          : active;
    }

    if (props.role === 'tab') {
      if (props.disabled) {
        props.tabIndex = -1;
        props['aria-disabled'] = true;
      }
      props['aria-selected'] = isActive;
    }

    const handleOnclick = useEventCallback((e) => {
      onClick?.(e);
      if (navKey == null) return;
      onSelect?.(navKey, e);
      parentOnSelect?.(navKey, e);
    });

    return (
      <Component
        {...props}
        ref={ref}
        onClick={handleOnclick}
        className={classNames(className, isActive && 'active')}
      />
    );
  },
);

AbstractNavItem.propTypes = propTypes;
AbstractNavItem.defaultProps = defaultProps;

export AbstractNavItem;


import * as React from 'react';
import { EventKey } from './types';

interface NavContextType {
  role?: string; // used by NavLink to determine it's role
  activeKey: EventKey | null;
  getControlledId: (key: EventKey | null) => string;
  getControllerId: (key: EventKey | null) => string;
}

const NavContext = React.createContext<NavContextType | null>(null);
NavContext.displayName = 'NavContext';

export NavContext;

import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import Dropdown, { DropdownProps } from './dropdown';
import { DropdownMenuVariant } from './DropdownMenu';
import NavLink from './NavLink';
import { BsPrefixRefForwardingComponent } from './helpers';

export interface NavDropdownProps
  extends Omit<DropdownProps, 'onSelect' | 'title'> {
  id: string;
  title: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  menuRole?: string;
  renderMenuOnMount?: boolean;
  rootCloseEvent?: 'click' | 'mousedown';
  menuVariant?: DropdownMenuVariant;
}

const propTypes = {
  /**
   * An html id attribute for the Toggle button, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   * @required
   */
  id: any,

  
  onClick: func,

  
  title: node.isRequired,

  
  disabled: bool,

  
  active: bool,

  
  menuRole: string,

  
  renderMenuOnMount: bool,

  
  rootCloseEvent: string,

  
  menuVariant: oneOf<DropdownMenuVariant>(['dark']),

  /** @ignore */
  bsPrefix: string,
};

const NavDropdown: BsPrefixRefForwardingComponent<'div', NavDropdownProps> =
  React.forwardRef(
    (
      {
        id,
        title,
        children,
        bsPrefix,
        className,
        rootCloseEvent,
        menuRole,
        disabled,
        active,
        renderMenuOnMount,
        menuVariant,
        ...props
      }: NavDropdownProps,
      ref,
    ) => {
      /* NavItem has no additional logic, it's purely presentational. Can set nav item class here to support "as" */
      const navItemPrefix = useBootstrapPrefix(undefined, 'nav-item');

      return (
        <Dropdown
          ref={ref}
          {...props}
          className={classNames(className, navItemPrefix)}
        >
          <Dropdown.Toggle
            id={id}
            eventKey={null}
            active={active}
            disabled={disabled}
            childBsPrefix={bsPrefix}
            as={NavLink}
          >
            {title}
          </Dropdown.Toggle>

          <Dropdown.Menu
            role={menuRole}
            renderOnMount={renderMenuOnMount}
            rootCloseEvent={rootCloseEvent}
            variant={menuVariant}
          >
            {children}
          </Dropdown.Menu>
        </Dropdown>
      );
    },
  );

NavDropdown.displayName = 'NavDropdown';
NavDropdown.propTypes = propTypes;

export Object.assign(NavDropdown, {
  Item: Dropdown.Item,
  ItemText: Dropdown.ItemText,
  Divider: Dropdown.Divider,
  Header: Dropdown.Header,
});

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('nav-item');

import classNames from 'classnames';


import * as React from 'react';

import SafeAnchor from './SafeAnchor';
import AbstractNavItem, { AbstractNavItemProps } from './AbstractNavItem';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavLinkProps
  extends BsPrefixProps,
    Omit<AbstractNavItemProps, 'as'> {}

const propTypes = {
  /**
   * @default 'nav-link'
   */
  bsPrefix: string,

  
  active: bool,

  
  disabled: bool,

  
  role: string,

  
  href: string,

  /** A callback fired when the `NavLink` is selected.
   *
   * ```js
   * function (eventKey: any, event: SyntheticEvent) {}
   * ```
   */
  onSelect: func,

  
  eventKey: oneOfType([PropTypes.string, PropTypes.number]),

  /** @default 'a' */
  as: elementType,
};

const defaultProps = {
  disabled: false,
  as: SafeAnchor,
};

const NavLink: BsPrefixRefForwardingComponent<'a', NavLinkProps> =
  React.forwardRef<HTMLElement, NavLinkProps>(
    ({ bsPrefix, disabled, className, as, ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-link');
      return (
        <AbstractNavItem
          {...props}
          ref={ref}
          as={as as any}
          disabled={disabled}
          className={classNames(className, bsPrefix, disabled && 'disabled')}
        />
      );
    },
  );

NavLink.displayName = 'NavLink';
NavLink.propTypes = propTypes;
NavLink.defaultProps = defaultProps;

export NavLink;
