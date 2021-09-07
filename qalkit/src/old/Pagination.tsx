import classNames from 'classnames';

import * as React from 'react';

import { useBootstrapPrefix } from './utils';
import PageItem, { Ellipsis, First, Last, Next, Prev } from './PageItem';
import { BsPrefixProps } from './helpers';

type PaginationSize = 'sm' | 'lg';

export interface PaginationProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLUListElement> {
  size?: 'sm' | 'lg';
}

const propTypes = {
  /**
   * @default 'pagination'
   * */
  bsPrefix: string,

  /**
   * Set's the size of all PageItems.
   *
   * @type {('sm'|'lg')}
   */
  size: oneOf<PaginationSize>(['sm', 'lg']),
};

/**
 * @property {PageItem} Item
 * @property {PageItem} First
 * @property {PageItem} Prev
 * @property {PageItem} Ellipsis
 * @property {PageItem} Next
 * @property {PageItem} Last
 */
const Pagination = React.forwardRef<HTMLUListElement, PaginationProps>(
  ({ bsPrefix, className, size, ...props }, ref) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'pagination');
    return (
      <ul
        ref={ref}
        {...props}
        className={classNames(
          className,
          decoratedBsPrefix,
          size && `${decoratedBsPrefix}-${size}`,
        )}
      />
    );
  },
);

Pagination.propTypes = propTypes;
Pagination.displayName = 'Pagination';

export Object.assign(Pagination, {
  First,
  Prev,
  Ellipsis,
  Item: PageItem,
  Next,
  Last,
});

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames';

import * as React from 'react';
import { ReactNode } from 'react';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

import SafeAnchor from './SafeAnchor';

export interface PageItemProps
  extends React.HTMLAttributes<HTMLElement>,
    BsPrefixProps {
  disabled?: boolean;
  active?: boolean;
  activeLabel?: string;
  href?: string;
}

const propTypes = {
  
  disabled: bool,

  
  active: bool,

  
  activeLabel: string,

  
  onClick: func,
};

const defaultProps = {
  active: false,
  disabled: false,
  activeLabel: '(current)',
};

const PageItem: BsPrefixRefForwardingComponent<'li', PageItemProps> =
  React.forwardRef<HTMLLIElement, PageItemProps>(
    (
      {
        active,
        disabled,
        className,
        style,
        activeLabel,
        children,
        ...props
      }: PageItemProps,
      ref,
    ) => {
      const Component = active || disabled ? 'span' : SafeAnchor;
      return (
        <li
          ref={ref}
          style={style}
          className={classNames(className, 'page-item', { active, disabled })}
        >
          <Component className="page-link" disabled={disabled} {...props}>
            {children}
            {active && activeLabel && (
              <span className="visually-hidden">{activeLabel}</span>
            )}
          </Component>
        </li>
      );
    },
  );

PageItem.propTypes = propTypes;
PageItem.defaultProps = defaultProps;
PageItem.displayName = 'PageItem';

export PageItem;

function createButton(name: string, defaultValue: ReactNode, label = name) {
  function Button({ children, ...props }: PageItemProps) {
    return (
      <PageItem {...props}>
        <span aria-hidden="true">{children || defaultValue}</span>
        <span className="visually-hidden">{label}</span>
      </PageItem>
    );
  }

  Button.displayName = name;

  return Button;
}

export const First = createButton('First', '«');
export const Prev = createButton('Prev', '‹', 'Previous');
export const Ellipsis = createButton('Ellipsis', '…', 'More');
export const Next = createButton('Next', '›');
export const Last = createButton('Last', '»');
