import classNames from 'classnames';
import * as React from 'react';

import isRequiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import { useBootstrapPrefix } from './utils';
import PopoverHeader from './PopoverHeader';
import PopoverBody from './PopoverBody';
import { ArrowProps, Placement } from './types';
import { BsPrefixProps } from './helpers';

export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  id: string;
  placement?: Placement;
  title?: string;
  arrowProps?: ArrowProps;
  body?: boolean;
  popper?: any;
  show?: boolean;
}

const propTypes = {
  /**
   * @default 'popover'
   */
  bsPrefix: string,

  /**
   * An html id attribute, necessary for accessibility
   * @type {string|number}
   * @required
   */
  id: isRequiredForA11y(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),

  
  placement: oneOf<Placement>([
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ]),

  
  arrowProps: shape({
    ref: any,
    style: object,
  }),

  
  body: bool,

  /** @private */
  popper: object,

  /** @private */
  show: bool,
};

const defaultProps: Partial<PopoverProps> = {
  placement: 'right',
};

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      bsPrefix,
      placement,
      className,
      style,
      children,
      body,
      arrowProps,
      popper: _,
      show: _1,
      ...props
    },
    ref,
  ) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'popover');
    const [primaryPlacement] = placement?.split('-') || [];
    let bsDirection = primaryPlacement;
    if (primaryPlacement === 'left') {
      bsDirection = 'start';
    } else if (primaryPlacement === 'right') {
      bsDirection = 'end';
    }

    return (
      <div
        ref={ref}
        role="tooltip"
        style={style}
        x-placement={primaryPlacement}
        className={classNames(
          className,
          decoratedBsPrefix,
          primaryPlacement && `bs-popover-${bsDirection}`,
        )}
        {...props}
      >
        <div className="popover-arrow" {...arrowProps} />
        {body ? <PopoverBody>{children}</PopoverBody> : children}
      </div>
    );
  },
);

Popover.propTypes = propTypes as any;
Popover.defaultProps = defaultProps;

export Object.assign(Popover, {
  Header: PopoverHeader,
  Body: PopoverBody,

  // Default popover offset.
  // https://github.com/twbs/bootstrap/blob/5c32767e0e0dbac2d934bcdee03719a65d3f1187/js/src/popover.js#L28
  POPPER_OFFSET: [0, 8] as const,
});


import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('popover-body');

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('popover-header');

