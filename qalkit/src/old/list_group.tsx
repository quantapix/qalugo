import classNames from 'classnames';
import * as React from 'react';

import warning from 'warning';

import { useUncontrolled } from 'uncontrollable';

import { useBootstrapPrefix } from './utils';
import AbstractNav from './AbstractNav';
import ListGroupItem from './ListGroupItem';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface ListGroupProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  variant?: 'flush';
  horizontal?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  activeKey?: EventKey;
  defaultActiveKey?: EventKey;
  onSelect?: SelectCallback;
}

const propTypes = {
  /**
   * @default 'list-group'
   */
  bsPrefix: string,

  /**
   * Adds a variant to the list-group
   *
   * @type {('flush')}
   */
  variant: oneOf(['flush']),

  /**
   * Changes the flow of the list group items from vertical to horizontal.
   * A value of `null` (the default) sets it to vertical for all breakpoints;
   * Just including the prop sets it for all breakpoints, while `{sm|md|lg|xl|xxl}`
   * makes the list group horizontal starting at that breakpoint’s `min-width`.
   * @type {(true|'sm'|'md'|'lg'|'xl'|'xxl')}
   */
  horizontal: oneOf([true, 'sm', 'md', 'lg', 'xl', 'xxl']),

  
  as: elementType,
};

const ListGroup: BsPrefixRefForwardingComponent<'div', ListGroupProps> =
  React.forwardRef<HTMLElement, ListGroupProps>((props, ref) => {
    const {
      className,
      bsPrefix: initialBsPrefix,
      variant,
      horizontal,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as = 'div',
      ...controlledProps
    } = useUncontrolled(props, {
      activeKey: 'onSelect',
    });

    const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'list-group');

    let horizontalVariant: string | undefined;
    if (horizontal) {
      horizontalVariant =
        horizontal === true ? 'horizontal' : `horizontal-${horizontal}`;
    }

    warning(
      !(horizontal && variant === 'flush'),
      '`variant="flush"` and `horizontal` should not be used together.',
    );

    return (
      <AbstractNav
        ref={ref}
        {...controlledProps}
        as={as}
        className={classNames(
          className,
          bsPrefix,
          variant && `${bsPrefix}-${variant}`,
          horizontalVariant && `${bsPrefix}-${horizontalVariant}`,
        )}
      />
    );
  });

ListGroup.propTypes = propTypes;
ListGroup.displayName = 'ListGroup';

export Object.assign(ListGroup, {
  Item: ListGroupItem,
});


import classNames from 'classnames';
import * as React from 'react';
import { useCallback } from 'react';


import AbstractNavItem from './AbstractNavItem';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
import { Variant, EventKey } from './types';

export interface ListGroupItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'>,
    BsPrefixProps {
  action?: boolean;
  active?: boolean;
  disabled?: boolean;
  eventKey?: EventKey;
  href?: string;
  onClick?: React.MouseEventHandler;
  variant?: Variant;
}

const propTypes = {
  /**
   * @default 'list-group-item'
   */
  bsPrefix: string,

  /**
   * Sets contextual classes for list item
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  variant: string,
  
  action: bool,
  
  active: bool,

  
  disabled: bool,

  eventKey: oneOfType([PropTypes.string, PropTypes.number]),

  onClick: func,

  href: string,

  /**
   * You can use a custom element type for this component. For none `action` items, items render as `li`.
   * For actions the default is an achor or button element depending on whether a `href` is provided.
   *
   * @default {'div' | 'a' | 'button'}
   */
  as: elementType,
};

const defaultProps = {
  variant: undefined,
  active: false,
  disabled: false,
};

const ListGroupItem: BsPrefixRefForwardingComponent<'a', ListGroupItemProps> =
  React.forwardRef<HTMLElement, ListGroupItemProps>(
    (
      {
        bsPrefix,
        active,
        disabled,
        className,
        variant,
        action,
        as,
        onClick,
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'list-group-item');

      const handleClick = useCallback(
        (event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          onClick?.(event);
        },
        [disabled, onClick],
      );

      if (disabled && props.tabIndex === undefined) {
        props.tabIndex = -1;
        props['aria-disabled'] = true;
      }

      return (
        <AbstractNavItem
          ref={ref}
          {...props}
          // eslint-disable-next-line no-nested-ternary
          as={as || (action ? (props.href ? 'a' : 'button') : 'div')}
          onClick={handleClick}
          className={classNames(
            className,
            bsPrefix,
            active && 'active',
            disabled && 'disabled',
            variant && `${bsPrefix}-${variant}`,
            action && `${bsPrefix}-action`,
          )}
        />
      );
    },
  );

ListGroupItem.propTypes = propTypes;
ListGroupItem.defaultProps = defaultProps;
ListGroupItem.displayName = 'ListGroupItem';

export ListGroupItem;
