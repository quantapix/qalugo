import classNames from 'classnames';
import * as React from 'react';

import isRequiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import { useBootstrapPrefix } from './utils';
import { ArrowProps, Placement } from './types';
import { BsPrefixProps } from './helpers';

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  id: string;
  placement?: Placement;
  arrowProps?: ArrowProps;
  show?: boolean;
  popper?: any;
}

const propTypes = {
  /**
   * @default 'tooltip'
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

  
  placement: oneOf([
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

  /**
   * An Overlay injected set of props for positioning the tooltip arrow.
   *
   * > This is generally provided by the `Overlay` component positioning the tooltip
   *
   * @type {{ ref: ReactRef, style: Object }}
   */
  arrowProps: shape({
    ref: any,
    style: object,
  }),

  /** @private */
  popper: object,

  /** @private */
  show: any,
};

const defaultProps = {
  placement: 'right',
};

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      bsPrefix,
      placement,
      className,
      style,
      children,
      arrowProps,
      popper: _,
      show: _2,
      ...props
    }: TooltipProps,
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'tooltip');

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
        style={style}
        role="tooltip"
        x-placement={primaryPlacement}
        className={classNames(className, bsPrefix, `bs-tooltip-${bsDirection}`)}
        {...props}
      >
        <div className="tooltip-arrow" {...arrowProps} />
        <div className={`${bsPrefix}-inner`}>{children}</div>
      </div>
    );
  },
);

Tooltip.propTypes = propTypes as any;
Tooltip.defaultProps = defaultProps as any;
Tooltip.displayName = 'Tooltip';

export Tooltip;
