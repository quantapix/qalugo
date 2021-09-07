import classNames from 'classnames';
import * as React from 'react';
import { useCallback, useMemo } from 'react';


import { useUncontrolled } from 'uncontrollable';

import createWithBsPrefix from './createWithBsPrefix';
import NavbarBrand from './NavbarBrand';
import NavbarCollapse from './NavbarCollapse';
import NavbarToggle from './NavbarToggle';
import { useBootstrapPrefix } from './utils';
import NavbarContext, { NavbarContextType } from './NavbarContext';
import SelectableContext from './SelectableContext';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';

const NavbarText = createWithBsPrefix('navbar-text', {
  Component: 'span',
});

export interface NavbarProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  variant?: 'light' | 'dark';
  expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  bg?: string;
  fixed?: 'top' | 'bottom';
  sticky?: 'top';
  onToggle?: (expanded: boolean) => void;
  onSelect?: SelectCallback;
  collapseOnSelect?: boolean;
  expanded?: boolean;
}

const propTypes = {
  /** @default 'navbar' */
  bsPrefix: string,

  /**
   * The general visual variant a the Navbar.
   * Use in combination with the `bg` prop, `background-color` utilities,
   * or your own background styles.
   *
   * @type {('light'|'dark')}
   */
  variant: string,

  
  expand: oneOf([true, 'sm', 'md', 'lg', 'xl', 'xxl']).isRequired,

  
  bg: string,

  
  fixed: oneOf(['top', 'bottom']),

  
  sticky: oneOf(['top']),

  
  as: elementType,

  /**
   * A callback fired when the `<Navbar>` body collapses or expands. Fired when
   * a `<Navbar.Toggle>` is clicked and called with the new `expanded`
   * boolean value.
   *
   * @controllable expanded
   */
  onToggle: func,

  
  onSelect: func,

  
  collapseOnSelect: bool,

  /**
   * Controls the visiblity of the navbar body
   *
   * @controllable onToggle
   */
  expanded: bool,

  /**
   * The ARIA role for the navbar, will default to 'navigation' for
   * Navbars whose `as` is something other than `<nav>`.
   *
   * @default 'navigation'
   */
  role: string,
};

const defaultProps = {
  expand: true,
  variant: 'light' as const,
  collapseOnSelect: false,
};

const Navbar: BsPrefixRefForwardingComponent<'nav', NavbarProps> =
  React.forwardRef<HTMLElement, NavbarProps>((props, ref) => {
    const {
      bsPrefix: initialBsPrefix,
      expand,
      variant,
      bg,
      fixed,
      sticky,
      className,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'nav',
      expanded,
      onToggle,
      onSelect,
      collapseOnSelect,
      ...controlledProps
    } = useUncontrolled(props, {
      expanded: 'onToggle',
    });

    const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'navbar');

    const handleCollapse = useCallback<SelectCallback>(
      (...args) => {
        onSelect?.(...args);
        if (collapseOnSelect && expanded) {
          onToggle?.(false);
        }
      },
      [onSelect, collapseOnSelect, expanded, onToggle],
    );

    // will result in some false positives but that seems better
    // than false negatives. strict `undefined` check allows explicit
    // "nulling" of the role if the user really doesn't want one
    if (controlledProps.role === undefined && Component !== 'nav') {
      controlledProps.role = 'navigation';
    }
    let expandClass = `${bsPrefix}-expand`;
    if (typeof expand === 'string') expandClass = `${expandClass}-${expand}`;

    const navbarContext = useMemo<NavbarContextType>(
      () => ({
        onToggle: () => onToggle?.(!expanded),
        bsPrefix,
        expanded: !!expanded,
      }),
      [bsPrefix, expanded, onToggle],
    );

    return (
      <NavbarContext.Provider value={navbarContext}>
        <SelectableContext.Provider value={handleCollapse}>
          <Component
            ref={ref}
            {...controlledProps}
            className={classNames(
              className,
              bsPrefix,
              expand && expandClass,
              variant && `${bsPrefix}-${variant}`,
              bg && `bg-${bg}`,
              sticky && `sticky-${sticky}`,
              fixed && `fixed-${fixed}`,
            )}
          />
        </SelectableContext.Provider>
      </NavbarContext.Provider>
    );
  });

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;
Navbar.displayName = 'Navbar';

export Object.assign(Navbar, {
  Brand: NavbarBrand,
  Toggle: NavbarToggle,
  Collapse: NavbarCollapse,
  Text: NavbarText,
});

import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavbarBrandProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  href?: string;
}

const propTypes = {
  /** @default 'navbar' */
  bsPrefix: string,

  
  href: string,

  
  as: elementType,
};

const NavbarBrand: BsPrefixRefForwardingComponent<'a', NavbarBrandProps> =
  React.forwardRef<HTMLElement, NavbarBrandProps>(
    ({ bsPrefix, className, as, ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-brand');

      const Component = as || (props.href ? 'a' : 'span');

      return (
        <Component
          {...props}
          ref={ref}
          className={classNames(className, bsPrefix)}
        />
      );
    },
  );

NavbarBrand.displayName = 'NavbarBrand';
NavbarBrand.propTypes = propTypes;

export NavbarBrand;

import * as React from 'react';
import { useContext } from 'react';


import Collapse, { CollapseProps } from './Collapse';
import { useBootstrapPrefix } from './utils';
import NavbarContext from './NavbarContext';
import { BsPrefixProps } from './helpers';

export interface NavbarCollapseProps
  extends Omit<CollapseProps, 'children'>,
    React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {}

const propTypes = {
  /** @default 'navbar-collapse' */
  bsPrefix: string,
};

const NavbarCollapse = React.forwardRef<HTMLDivElement, NavbarCollapseProps>(
  ({ children, bsPrefix, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-collapse');
    const context = useContext(NavbarContext);

    return (
      <Collapse in={!!(context && context.expanded)} {...props}>
        <div ref={ref} className={bsPrefix}>
          {children}
        </div>
      </Collapse>
    );
  },
);

NavbarCollapse.displayName = 'NavbarCollapse';
NavbarCollapse.propTypes = propTypes;

export NavbarCollapse;

import * as React from 'react';

// TODO: check
export interface NavbarContextType {
  onToggle: () => void;
  bsPrefix?: string;
  expanded: boolean;
}

const context = React.createContext<NavbarContextType | null>(null);
context.displayName = 'NavbarContext';

export context;


import classNames from 'classnames';
import * as React from 'react';
import { useContext } from 'react';

import useEventCallback from '@restart/hooks/useEventCallback';

import { useBootstrapPrefix } from './utils';
import NavbarContext from './NavbarContext';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavbarToggleProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  label?: string;
}

const propTypes = {
  /** @default 'navbar-toggler' */
  bsPrefix: string,

  
  label: string,

  /** @private */
  onClick: func,

  
  children: node,

  as: elementType,
};

const defaultProps = {
  label: 'Toggle navigation',
};

const NavbarToggle: BsPrefixRefForwardingComponent<
  'button',
  NavbarToggleProps
> = React.forwardRef<HTMLElement, NavbarToggleProps>(
  (
    {
      bsPrefix,
      className,
      children,
      label,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'button',
      onClick,
      ...props
    },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-toggler');

    const { onToggle, expanded } = useContext(NavbarContext) || {};

    const handleClick = useEventCallback((e) => {
      if (onClick) onClick(e);
      if (onToggle) onToggle();
    });

    if (Component === 'button') {
      (props as any).type = 'button';
    }

    return (
      <Component
        {...props}
        ref={ref}
        onClick={handleClick}
        aria-label={label}
        className={classNames(className, bsPrefix, !expanded && 'collapsed')}
      >
        {children || <span className={`${bsPrefix}-icon`} />}
      </Component>
    );
  },
);

NavbarToggle.displayName = 'NavbarToggle';
NavbarToggle.propTypes = propTypes;
NavbarToggle.defaultProps = defaultProps;

export NavbarToggle;
