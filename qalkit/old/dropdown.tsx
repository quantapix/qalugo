import classNames from 'classnames';

import * as React from 'react';
import { useContext, useMemo } from 'react';
import BaseDropdown from 'react-overlays/Dropdown';
import { DropDirection } from 'react-overlays/DropdownContext';
import { useUncontrolled } from 'uncontrollable';
import useEventCallback from '@restart/hooks/useEventCallback';
import DropdownContext from './DropdownContext';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import InputGroupContext from './InputGroupContext';
import SelectableContext from './SelectableContext';
import { useBootstrapPrefix } from './utils';
import createWithBsPrefix from './createWithBsPrefix';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { AlignType, alignPropType } from './types';

const DropdownHeader = createWithBsPrefix('dropdown-header', {
  defaultProps: { role: 'heading' },
});
const DropdownDivider = createWithBsPrefix('dropdown-divider', {
  Component: 'hr',
  defaultProps: { role: 'separator' },
});
const DropdownItemText = createWithBsPrefix('dropdown-item-text', {
  Component: 'span',
});

export interface DropdownProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  drop?: 'up' | 'start' | 'end' | 'down';
  align?: AlignType;
  show?: boolean;
  flip?: boolean;
  onToggle?: (
    isOpen: boolean,
    event: React.SyntheticEvent,
    metadata: { source: 'select' | 'click' | 'rootClose' | 'keydown' },
  ) => void;
  focusFirstItemOnShow?: boolean | 'keyboard';
  onSelect?: SelectCallback;
  navbar?: boolean;
}

const propTypes = {
  /** @default 'dropdown' */
  bsPrefix: string,
  
  drop: oneOf(['up', 'start', 'end', 'down']),

  as: elementType,

  /**
   * Aligns the dropdown menu to the specified side of the Dropdown toggle. You can
   * also align the menu responsively for breakpoints starting at `sm` and up.
   * The alignment direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  show: bool,

  /**
   * Allow Dropdown to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/docs/v2/modifiers/flip/).
   *
   */
  flip: bool,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `show` value, the DOM event, and the source that fired it: `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
   *
   * ```js
   * function(
   *   isOpen: boolean,
   *   event: SyntheticEvent,
   *   metadata: {
   *     source: 'select' | 'click' | 'rootClose' | 'keydown'
   *   }
   * ): void
   * ```
   *
   * @controllable show
   */
  onToggle: func,

  
  onSelect: func,

  /**
   * Controls the focus behavior for when the Dropdown is opened. Set to
   * `true` to always focus the first menu item, `keyboard` to focus only when
   * navigating via the keyboard, or `false` to disable completely
   *
   * The Default behavior is `false` **unless** the Menu has a `role="menu"`
   * where it will default to `keyboard` to match the recommended [ARIA Authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).
   */
  focusFirstItemOnShow: oneOf([false, true, 'keyboard']),

  /** @private */
  navbar: bool,
};

const defaultProps: Partial<DropdownProps> = {
  navbar: false,
  align: 'start',
};

const Dropdown: BsPrefixRefForwardingComponent<'div', DropdownProps> =
  React.forwardRef<HTMLElement, DropdownProps>((pProps, ref) => {
    const {
      bsPrefix,
      drop,
      show,
      className,
      align,
      onSelect,
      onToggle,
      focusFirstItemOnShow,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      navbar: _4,
      ...props
    } = useUncontrolled(pProps, { show: 'onToggle' });

    const onSelectCtx = useContext(SelectableContext);
    const isInputGroup = useContext(InputGroupContext);
    const prefix = useBootstrapPrefix(bsPrefix, 'dropdown');

    const handleToggle = useEventCallback(
      (nextShow, event, source = event.type) => {
        if (
          event.currentTarget === document &&
          (source !== 'keydown' || event.key === 'Escape')
        )
          source = 'rootClose';
        onToggle?.(nextShow, event, { source });
      },
    );

    const handleSelect = useEventCallback((key, event) => {
      onSelectCtx?.(key, event);
      onSelect?.(key, event);
      handleToggle(false, event, 'select');
    });

    // TODO RTL: Flip directions based on RTL setting.
    let direction: DropDirection = drop as DropDirection;
    if (drop === 'start') {
      direction = 'left';
    } else if (drop === 'end') {
      direction = 'right';
    }

    const contextValue = useMemo(
      () => ({
        align,
      }),
      [align],
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <SelectableContext.Provider value={handleSelect}>
          <BaseDropdown
            drop={direction}
            show={show}
            alignEnd={align === 'end'}
            onToggle={handleToggle}
            focusFirstItemOnShow={focusFirstItemOnShow}
            itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
          >
            {isInputGroup ? (
              props.children
            ) : (
              <Component
                {...props}
                ref={ref}
                className={classNames(
                  className,
                  show && 'show',
                  (!drop || drop === 'down') && prefix,
                  drop === 'up' && 'dropup',
                  drop === 'end' && 'dropend',
                  drop === 'start' && 'dropstart',
                )}
              />
            )}
          </BaseDropdown>
        </SelectableContext.Provider>
      </DropdownContext.Provider>
    );
  });

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export Object.assign(Dropdown, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemText: DropdownItemText,
  Divider: DropdownDivider,
  Header: DropdownHeader,
});

import * as React from 'react';


import Dropdown, { DropdownProps } from './dropdown';
import DropdownToggle, { PropsFromToggle } from './DropdownToggle';
import DropdownMenu, { DropdownMenuVariant } from './DropdownMenu';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
import { alignPropType } from './types';

export interface DropdownButtonProps
  extends Omit<DropdownProps, 'title'>,
    PropsFromToggle,
    BsPrefixProps {
  title: React.ReactNode;
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

  
  href: string,

  
  onClick: func,

  
  title: node.isRequired,

  
  disabled: bool,

  /**
   * Aligns the dropdown menu.
   *
   * _see [DropdownMenu](#dropdown-menu-props) for more details_
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,

  
  menuRole: string,

  
  renderMenuOnMount: bool,

  
  rootCloseEvent: string,

  
  menuVariant: oneOf<DropdownMenuVariant>(['dark']),

  /** @ignore */
  bsPrefix: string,
  /** @ignore */
  variant: string,
  /** @ignore */
  size: string,
};


const DropdownButton: BsPrefixRefForwardingComponent<
  'div',
  DropdownButtonProps
> = React.forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      title,
      children,
      bsPrefix,
      rootCloseEvent,
      variant,
      size,
      menuRole,
      renderMenuOnMount,
      disabled,
      href,
      id,
      menuVariant,
      ...props
    },
    ref,
  ) => (
    <Dropdown ref={ref} {...props}>
      <DropdownToggle
        id={id}
        href={href}
        size={size}
        variant={variant}
        disabled={disabled}
        childBsPrefix={bsPrefix}
      >
        {title}
      </DropdownToggle>
      <DropdownMenu
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
        variant={menuVariant}
      >
        {children}
      </DropdownMenu>
    </Dropdown>
  ),
);

DropdownButton.displayName = 'DropdownButton';
DropdownButton.propTypes = propTypes;

export DropdownButton;

import * as React from 'react';
import { AlignType } from './types';

export type DropdownContextValue = {
  align?: AlignType;
};

const DropdownContext = React.createContext<DropdownContextValue>({});
DropdownContext.displayName = 'DropdownContext';

export DropdownContext;


import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';

import SelectableContext, { makeEventKey } from './SelectableContext';
import { useBootstrapPrefix } from './utils';
import NavContext from './NavContext';
import SafeAnchor from './SafeAnchor';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface DropdownItemProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  active?: boolean;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onSelect?: SelectCallback;
}

const propTypes = {
  /** @default 'dropdown-item' */
  bsPrefix: string,

  
  active: bool,

  
  disabled: bool,

  
  eventKey: oneOfType([PropTypes.string, PropTypes.number]),

  
  href: string,

  
  onClick: func,

  
  onSelect: func,

  as: elementType,
};

const defaultProps = {
  as: SafeAnchor,
  disabled: false,
};

const DropdownItem: BsPrefixRefForwardingComponent<
  typeof SafeAnchor,
  DropdownItemProps
> = React.forwardRef(
  (
    {
      bsPrefix,
      className,
      eventKey,
      disabled,
      href,
      onClick,
      onSelect,
      active: propActive,
      as: Component,
      ...props
    }: DropdownItemProps,
    ref,
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-item');
    const onSelectCtx = useContext(SelectableContext);
    const navContext = useContext(NavContext);

    const { activeKey } = navContext || {};
    const key = makeEventKey(eventKey, href);

    const active =
      propActive == null && key != null
        ? makeEventKey(activeKey) === key
        : propActive;

    const handleClick = useEventCallback((event) => {
      // SafeAnchor handles the disabled case, but we handle it here
      // for other components
      if (disabled) return;
      onClick?.(event);
      onSelectCtx?.(key, event);
      onSelect?.(key, event);
    });

    return (
      // "TS2604: JSX element type 'Component' does not have any construct or call signatures."
      // @ts-ignore
      <Component
        {...props}
        ref={ref}
        href={href}
        disabled={disabled}
        className={classNames(
          className,
          prefix,
          active && 'active',
          disabled && 'disabled',
        )}
        onClick={handleClick}
      />
    );
  },
);

DropdownItem.displayName = 'DropdownItem';
DropdownItem.propTypes = propTypes;
DropdownItem.defaultProps = defaultProps;

export DropdownItem;

import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import {
  useDropdownMenu,
  UseDropdownMenuOptions,
} from 'react-overlays/DropdownMenu';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import warning from 'warning';
import DropdownContext from './DropdownContext';
import InputGroupContext from './InputGroupContext';
import NavbarContext from './NavbarContext';
import { useBootstrapPrefix } from './utils';
import useWrappedRefWithWarning from './useWrappedRefWithWarning';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { AlignType, AlignDirection, alignPropType } from './types';

export type DropdownMenuVariant = 'dark' | string;

export interface DropdownMenuProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  show?: boolean;
  renderOnMount?: boolean;
  flip?: boolean;
  align?: AlignType;
  onSelect?: SelectCallback;
  rootCloseEvent?: 'click' | 'mousedown';
  popperConfig?: UseDropdownMenuOptions['popperConfig'];
  variant?: DropdownMenuVariant;
}

const propTypes = {
  /**
   * @default 'dropdown-menu'
   */
  bsPrefix: string,

  
  show: bool,

  
  renderOnMount: bool,

  
  flip: bool,

  /**
   * Aligns the dropdown menu to the specified side of the container. You can also align
   * the menu responsively for breakpoints starting at `sm` and up. The alignment
   * direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,

  onSelect: func,

  /**
   * Which event when fired outside the component will cause it to be closed
   *
   * *Note: For custom dropdown components, you will have to pass the
   * `rootCloseEvent` to `<RootCloseWrapper>` in your custom dropdown menu
   * component ([similarly to how it is implemented in `<Dropdown.Menu>`](https://github.com/react-bootstrap/react-bootstrap/blob/v0.31.5/src/DropdownMenu.js#L115-L119)).*
   */
  rootCloseEvent: oneOf(['click', 'mousedown']),

  
  as: elementType,

  
  popperConfig: object,

  
  variant: string,
};

const defaultProps: Partial<DropdownMenuProps> = {
  flip: true,
};

const DropdownMenu: BsPrefixRefForwardingComponent<'div', DropdownMenuProps> =
  React.forwardRef<HTMLElement, DropdownMenuProps>(
    (
      {
        bsPrefix,
        className,
        align,
        rootCloseEvent,
        flip,
        show: showProps,
        renderOnMount,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        popperConfig,
        variant,
        ...props
      },
      ref,
    ) => {
      let alignRight = false;
      const isNavbar = useContext(NavbarContext);
      const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-menu');
      const { align: contextAlign } = useContext(DropdownContext);
      align = align || contextAlign;
      const isInputGroup = useContext(InputGroupContext);

      const alignClasses: string[] = [];
      if (align) {
        if (typeof align === 'object') {
          const keys = Object.keys(align);

          warning(
            keys.length === 1,
            'There should only be 1 breakpoint when passing an object to `align`',
          );

          if (keys.length) {
            const brkPoint = keys[0];
            const direction: AlignDirection = align[brkPoint];

            // .dropdown-menu-end is required for responsively aligning
            // left in addition to align left classes.
            // Reuse alignRight to toggle the class below.
            alignRight = direction === 'start';
            alignClasses.push(`${prefix}-${brkPoint}-${direction}`);
          }
        } else if (align === 'end') {
          alignRight = true;
        }
      }

      const [menuProps, { hasShown, popper, show, alignEnd, toggle }] =
        useDropdownMenu({
          flip,
          rootCloseEvent,
          show: showProps,
          alignEnd: alignRight,
          usePopper: !isNavbar && alignClasses.length === 0,
          offset: [0, 2],
          popperConfig,
        });

      menuProps.ref = useMergedRefs(
        useWrappedRefWithWarning(ref, 'DropdownMenu'),
        menuProps.ref,
      );

      if (!hasShown && !renderOnMount && !isInputGroup) return null;

      // For custom components provide additional, non-DOM, props;
      if (typeof Component !== 'string') {
        menuProps.show = show;
        menuProps.close = () => toggle?.(false);
        menuProps.align = align;
      }

      let style = props.style;
      if (popper?.placement) {
        // we don't need the default popper style,
        // menus are display: none when not shown.
        style = { ...props.style, ...menuProps.style };
        props['x-placement'] = popper.placement;
      }

      return (
        <Component
          {...props}
          {...menuProps}
          style={style}
          // Bootstrap css requires this data attrib to style responsive menus.
          {...(alignClasses.length && { 'data-bs-popper': 'static' })}
          className={classNames(
            className,
            prefix,
            show && 'show',
            alignEnd && `${prefix}-end`,
            variant && `${prefix}-${variant}`,
            ...alignClasses,
          )}
        />
      );
    },
  );

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export DropdownMenu;

import classNames from 'classnames';

import isRequiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import * as React from 'react';
import { useContext } from 'react';
import { useDropdownToggle } from 'react-overlays/DropdownToggle';
import DropdownContext from 'react-overlays/DropdownContext';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import Button, { ButtonProps, CommonButtonProps } from './buttons';
import InputGroupContext from './InputGroupContext';
import { useBootstrapPrefix } from './utils';
import useWrappedRefWithWarning from './useWrappedRefWithWarning';
import { BsPrefixRefForwardingComponent } from './helpers';

export interface DropdownToggleProps extends ButtonProps {
  split?: boolean;
  childBsPrefix?: string;
}

type DropdownToggleComponent = BsPrefixRefForwardingComponent<
  'button',
  DropdownToggleProps
>;

export type PropsFromToggle = Partial<
  Pick<React.ComponentPropsWithRef<DropdownToggleComponent>, CommonButtonProps>
>;

const propTypes = {
  /**
   * @default 'dropdown-toggle'
   */
  bsPrefix: string,

  /**
   * An html id attribute, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   * @required
   */
  id: isRequiredForA11y(PropTypes.any),

  split: bool,

  as: elementType,

  /**
   * to passthrough to the underlying button or whatever from DropdownButton
   * @private
   */
  childBsPrefix: string,
};

const DropdownToggle: DropdownToggleComponent = React.forwardRef(
  (
    {
      bsPrefix,
      split,
      className,
      childBsPrefix,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = Button,
      ...props
    }: DropdownToggleProps,
    ref,
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-toggle');
    const dropdownContext = useContext(DropdownContext);
    const isInputGroup = useContext(InputGroupContext);

    if (childBsPrefix !== undefined) {
      (props as any).bsPrefix = childBsPrefix;
    }

    const [toggleProps] = useDropdownToggle();

    toggleProps.ref = useMergedRefs(
      toggleProps.ref,
      useWrappedRefWithWarning(ref, 'DropdownToggle'),
    );

    // This intentionally forwards size and variant (if set) to the
    // underlying component, to allow it to render size and style variants.
    return (
      <Component
        className={classNames(
          className,
          prefix,
          split && `${prefix}-split`,
          !!isInputGroup && dropdownContext?.show && 'show',
        )}
        {...toggleProps}
        {...props}
      />
    );
  },
);

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = propTypes;

export DropdownToggle;

