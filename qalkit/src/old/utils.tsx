
import * as React from 'react';
import { useContext, useMemo } from 'react';
import classNames from 'classnames';

import * as React from 'react';
import { useCallback } from 'react';
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
} from 'react-transition-group/Transition';
import transitionEndListener from './transitionEndListener';
import { TransitionCallbacks } from './helpers';
import triggerBrowserReflow from './triggerBrowserReflow';
import {TransitionWrapper} from './transitions';

export interface ThemeProviderProps {
  prefixes: Record<string, unknown>;
}

const ThemeContext = React.createContext({});
const { Consumer, Provider } = ThemeContext;
export Consumer as ThemeConsumer;

export function ThemeProvider({ prefixes, children }) {
  const copiedPrefixes = useMemo(() => ({ ...prefixes }), [prefixes]);

  return <Provider value={copiedPrefixes}>{children}</Provider>;
}

ThemeProvider.propTypes = {
  prefixes: object.isRequired,
};

export function useBootstrapPrefix(
  prefix: string | undefined,
  defaultPrefix: string,
): string {
  const prefixes = useContext(ThemeContext);
  return prefix || prefixes[defaultPrefix] || defaultPrefix;
}

export function createBootstrapComponent(Component, opts) {
  if (typeof opts === 'string') opts = { prefix: opts };
  const isClassy = Component.prototype && Component.prototype.isReactComponent;
  // If it's a functional component make sure we don't break it with a ref
  const { prefix, forwardRefAs = isClassy ? 'ref' : 'innerRef' } = opts;

  const Wrapped = React.forwardRef(({ ...props }, ref) => {
    props[forwardRefAs] = ref;
    const bsPrefix = useBootstrapPrefix((props as any).bsPrefix, prefix);
    return <Component {...props} bsPrefix={bsPrefix} />;
  });

  Wrapped.displayName = `Bootstrap(${Component.displayName || Component.name})`;
  return Wrapped;
}



export interface FadeProps extends TransitionCallbacks {
  className?: string;
  in?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  appear?: boolean;
  timeout?: number;
  children: React.ReactElement;
}

const propTypes = {
  
  in: bool,

  
  mountOnEnter: bool,

  
  unmountOnExit: bool,

  
  appear: bool,

  
  timeout: number,

  
  onEnter: func,
  
  onEntering: func,
  
  onEntered: func,
  
  onExit: func,
  
  onExiting: func,
  
  onExited: func,
};

const defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
};

const fadeStyles = {
  [ENTERING]: 'show',
  [ENTERED]: 'show',
};

const Fade = React.forwardRef<Transition<any>, FadeProps>(
  ({ className, children, ...props }, ref) => {
    const handleEnter = useCallback(
      (node) => {
        triggerBrowserReflow(node);
        props.onEnter?.(node);
      },
      [props],
    );

    return (
      <TransitionWrapper
        ref={ref}
        addEndListener={transitionEndListener}
        {...props}
        onEnter={handleEnter}
        childRef={(children as any).ref}
      >
        {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
          React.cloneElement(children, {
            ...innerProps,
            className: classNames(
              'fade',
              className,
              children.props.className,
              fadeStyles[status],
            ),
          })
        }
      </TransitionWrapper>
    );
  },
);

Fade.propTypes = propTypes as any;
Fade.defaultProps = defaultProps;
Fade.displayName = 'Fade';

export Fade;

import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import { BsPrefixProps } from './helpers';

export type AspectRatio = '1x1' | '4x3' | '16x9' | '21x9' | string;

export interface RatioProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactChild;
  aspectRatio?: AspectRatio | number;
}

const propTypes = {
  /**
   * @default 'ratio'
   */
  bsPrefix: string,

  
  children: element.isRequired,

  
  aspectRatio: oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
  aspectRatio: '1x1' as const,
};

function toPercent(num: number): string {
  if (num <= 0 || num > 100) return '100%';
  if (num < 1) return `${num * 100}%`;
  return `${num}%`;
}

const Ratio = React.forwardRef<HTMLDivElement, RatioProps>(
  ({ bsPrefix, className, children, aspectRatio, style, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'ratio');
    const isCustomRatio = typeof aspectRatio === 'number';

    return (
      <div
        ref={ref}
        {...props}
        style={{
          ...style,
          ...(isCustomRatio && {
            '--bs-aspect-ratio': toPercent(aspectRatio as number),
          }),
        }}
        className={classNames(
          bsPrefix,
          className,
          !isCustomRatio && `${bsPrefix}-${aspectRatio}`,
        )}
      >
        {React.Children.only(children)}
      </div>
    );
  },
);

Ratio.propTypes = propTypes;
Ratio.defaultProps = defaultProps;

export Ratio;


import classNames from 'classnames';


import * as React from 'react';

import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

type RowColWidth =
  | number
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'auto';
type RowColumns = RowColWidth | { cols?: RowColWidth };

export interface RowProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  xs?: RowColumns;
  sm?: RowColumns;
  md?: RowColumns;
  lg?: RowColumns;
  xl?: RowColumns;
  xxl?: RowColumns;
}

const DEVICE_SIZES = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
const rowColWidth = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

const rowColumns = PropTypes.oneOfType([
  rowColWidth,
  PropTypes.shape({
    cols: rowColWidth,
  }),
]);

const propTypes = {
  /**
   * @default 'row'
   */
  bsPrefix: string,

  as: elementType,

  /**
   * The number of columns that will fit next to each other on extra small devices (<576px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  xs: rowColumns,

  /**
   * The number of columns that will fit next to each other on small devices (≥576px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  sm: rowColumns,

  /**
   * The number of columns that will fit next to each other on medium devices (≥768px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  md: rowColumns,

  /**
   * The number of columns that will fit next to each other on large devices (≥992px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  lg: rowColumns,

  /**
   * The number of columns that will fit next to each other on extra large devices (≥1200px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  xl: rowColumns,

  /**
   * The number of columns that will fit next to each other on extra extra large devices (≥1400px).
   * Use `auto` to give columns their natural widths.
   *
   * @type {(number|'auto'|{ cols: number|'auto' })}
   */
  xxl: rowColumns,
};

const Row: BsPrefixRefForwardingComponent<'div', RowProps> = React.forwardRef<
  HTMLDivElement,
  RowProps
>(
  (
    {
      bsPrefix,
      className,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      ...props
    }: RowProps,
    ref,
  ) => {
    const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'row');
    const sizePrefix = `${decoratedBsPrefix}-cols`;
    const classes: string[] = [];

    DEVICE_SIZES.forEach((brkPoint) => {
      const propValue = props[brkPoint];
      delete props[brkPoint];

      let cols;
      if (propValue != null && typeof propValue === 'object') {
        ({ cols } = propValue);
      } else {
        cols = propValue;
      }

      const infix = brkPoint !== 'xs' ? `-${brkPoint}` : '';

      if (cols != null) classes.push(`${sizePrefix}${infix}-${cols}`);
    });

    return (
      <Component
        ref={ref}
        {...props}
        className={classNames(className, decoratedBsPrefix, ...classes)}
      />
    );
  },
);

Row.displayName = 'Row';
Row.propTypes = propTypes;

export Row;

import * as React from 'react';
import { SelectCallback } from './helpers';

const SelectableContext = React.createContext<SelectCallback | null>(null);

export const makeEventKey = (
  eventKey?: string | number | null,
  href: string | null = null,
): string | null => {
  if (eventKey != null) return String(eventKey);
  return href || null;
};

export SelectableContext;

import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

type NumberAttr =
  | number
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

type ColOrderNumber = number | '1' | '2' | '3' | '4' | '5';
type ColOrder = ColOrderNumber | 'first' | 'last';
type ColSize = boolean | 'auto' | NumberAttr;
type ColSpec =
  | ColSize
  | { span?: ColSize; offset?: NumberAttr; order?: ColOrder };

export interface ColProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  xs?: ColSpec;
  sm?: ColSpec;
  md?: ColSpec;
  lg?: ColSpec;
  xl?: ColSpec;
  xxl?: ColSpec;
}

const DEVICE_SIZES = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
const colSize = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
  PropTypes.oneOf(['auto']),
]);

const stringOrNumber = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
]);

const column = PropTypes.oneOfType([
  colSize,
  PropTypes.shape({
    size: colSize,
    order: stringOrNumber,
    offset: stringOrNumber,
  }),
]);

const propTypes = {
  /**
   * @default 'col'
   */
  bsPrefix: string,

  as: elementType,

  /**
   * The number of columns to span on extra small devices (<576px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  xs: column,

  /**
   * The number of columns to span on small devices (≥576px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  sm: column,

  /**
   * The number of columns to span on medium devices (≥768px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  md: column,

  /**
   * The number of columns to span on large devices (≥992px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  lg: column,

  /**
   * The number of columns to span on extra large devices (≥1200px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  xl: column,

  /**
   * The number of columns to span on extra extra large devices (≥1400px)
   *
   * @type {(boolean|"auto"|number|{ span: boolean|"auto"|number, offset: number, order: "first"|"last"|number })}
   */
  xxl: column,
};

const Col: BsPrefixRefForwardingComponent<'div', ColProps> = React.forwardRef<
  HTMLElement,
  ColProps
>(
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  ({ bsPrefix, className, as: Component = 'div', ...props }, ref) => {
    const prefix = useBootstrapPrefix(bsPrefix, 'col');
    const spans: string[] = [];
    const classes: string[] = [];

    DEVICE_SIZES.forEach((brkPoint) => {
      const propValue = props[brkPoint];
      delete props[brkPoint];

      let span: ColSize | undefined;
      let offset: NumberAttr | undefined;
      let order: ColOrder | undefined;

      if (typeof propValue === 'object' && propValue != null) {
        ({ span = true, offset, order } = propValue);
      } else {
        span = propValue;
      }

      const infix = brkPoint !== 'xs' ? `-${brkPoint}` : '';

      if (span)
        spans.push(
          span === true ? `${prefix}${infix}` : `${prefix}${infix}-${span}`,
        );

      if (order != null) classes.push(`order${infix}-${order}`);
      if (offset != null) classes.push(`offset${infix}-${offset}`);
    });

    if (!spans.length) {
      spans.push(prefix); // plain 'col'
    }

    return (
      <Component
        {...props}
        ref={ref}
        className={classNames(className, ...spans, ...classes)}
      />
    );
  },
);

Col.displayName = 'Col';
Col.propTypes = propTypes;

export Col;


import classNames from 'classnames';
import css from 'dom-helpers/css';

import React, { useMemo } from 'react';
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
  EXITED,
  EXITING,
} from 'react-transition-group/Transition';
import transitionEndListener from './transitionEndListener';
import { TransitionCallbacks } from './helpers';
import createChainedFunction from './functions';
import triggerBrowserReflow from './triggerBrowserReflow';
import TransitionWrapper from './transitions';

type Dimension = 'height' | 'width';

export interface CollapseProps extends TransitionCallbacks {
  className?: string;
  in?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  appear?: boolean;
  timeout?: number;
  dimension?: Dimension | (() => Dimension);
  getDimensionValue?: (dimension: Dimension, element: HTMLElement) => number;
  children: React.ReactElement;
  role?: string;
}

const MARGINS: { [d in Dimension]: string[] } = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight'],
};

function getDefaultDimensionValue(
  dimension: Dimension,
  elem: HTMLElement,
): number {
  const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`;
  const value = elem[offset];
  const margins = MARGINS[dimension];

  return (
    value +
    // @ts-ignore
    parseInt(css(elem, margins[0]), 10) +
    // @ts-ignore
    parseInt(css(elem, margins[1]), 10)
  );
}

const collapseStyles = {
  [EXITED]: 'collapse',
  [EXITING]: 'collapsing',
  [ENTERING]: 'collapsing',
  [ENTERED]: 'collapse show',
};

const propTypes = {
  
  in: bool,

  
  mountOnEnter: bool,

  
  unmountOnExit: bool,

  
  appear: bool,

  
  timeout: number,

  
  onEnter: func,
  
  onEntering: func,
  
  onEntered: func,
  
  onExit: func,
  
  onExiting: func,
  
  onExited: func,

  
  dimension: oneOfType([
    PropTypes.oneOf(['height', 'width']),
    PropTypes.func,
  ]),

  /**
   * Function that returns the height or width of the animating DOM node
   *
   * Allows for providing some custom logic for how much the Collapse component
   * should animate in its specified dimension. Called with the current
   * dimension prop value and the DOM node.
   *
   * @default element.offsetWidth | element.offsetHeight
   */
  getDimensionValue: func,

  
  role: string,
};

const defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  getDimensionValue: getDefaultDimensionValue,
};

const Collapse = React.forwardRef<Transition<any>, CollapseProps>(
  (
    {
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      className,
      children,
      dimension = 'height',
      getDimensionValue = getDefaultDimensionValue,
      ...props
    },
    ref,
  ) => {
    /* Compute dimension */
    const computedDimension =
      typeof dimension === 'function' ? dimension() : dimension;

    /* -- Expanding -- */
    const handleEnter = useMemo(
      () =>
        createChainedFunction((elem) => {
          elem.style[computedDimension] = '0';
        }, onEnter),
      [computedDimension, onEnter],
    );

    const handleEntering = useMemo(
      () =>
        createChainedFunction((elem) => {
          const scroll = `scroll${computedDimension[0].toUpperCase()}${computedDimension.slice(
            1,
          )}`;
          elem.style[computedDimension] = `${elem[scroll]}px`;
        }, onEntering),
      [computedDimension, onEntering],
    );

    const handleEntered = useMemo(
      () =>
        createChainedFunction((elem) => {
          elem.style[computedDimension] = null;
        }, onEntered),
      [computedDimension, onEntered],
    );

    /* -- Collapsing -- */
    const handleExit = useMemo(
      () =>
        createChainedFunction((elem) => {
          elem.style[computedDimension] = `${getDimensionValue(
            computedDimension,
            elem,
          )}px`;
          triggerBrowserReflow(elem);
        }, onExit),
      [onExit, getDimensionValue, computedDimension],
    );
    const handleExiting = useMemo(
      () =>
        createChainedFunction((elem) => {
          elem.style[computedDimension] = null;
        }, onExiting),
      [computedDimension, onExiting],
    );

    return (
      <TransitionWrapper
        ref={ref}
        addEndListener={transitionEndListener}
        {...props}
        aria-expanded={props.role ? props.in : null}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExiting={handleExiting}
        childRef={(children as any).ref}
      >
        {(state: TransitionStatus, innerProps: Record<string, unknown>) =>
          React.cloneElement(children, {
            ...innerProps,
            className: classNames(
              className,
              children.props.className,
              collapseStyles[state],
              computedDimension === 'width' && 'width',
            ),
          })
        }
      </TransitionWrapper>
    );
  },
);

// @ts-ignore
Collapse.propTypes = propTypes;
// @ts-ignore
Collapse.defaultProps = defaultProps;

export Collapse;


import * as React from 'react';


import createChainedFunction from './functions';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface SafeAnchorProps
  extends React.HTMLAttributes<HTMLElement>,
    BsPrefixProps {
  href?: string;
  disabled?: boolean;
  role?: string;
  tabIndex?: number;
}

const propTypes = {
  href: string,
  onClick: func,
  onKeyDown: func,
  disabled: bool,
  role: string,
  tabIndex: oneOfType([PropTypes.number, PropTypes.string]),

  
  as: elementType,
};

function isTrivialHref(href) {
  return !href || href.trim() === '#';
}


const SafeAnchor: BsPrefixRefForwardingComponent<'a', SafeAnchorProps> =
  React.forwardRef<HTMLElement, SafeAnchorProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'a',
        disabled,
        onKeyDown,
        ...props
      }: SafeAnchorProps,
      ref,
    ) => {
      const handleClick = (event) => {
        const { href, onClick } = props;

        if (disabled || isTrivialHref(href)) {
          event.preventDefault();
        }

        if (disabled) {
          event.stopPropagation();
          return;
        }

        onClick?.(event);
      };

      const handleKeyDown = (event) => {
        if (event.key === ' ') {
          event.preventDefault();
          handleClick(event);
        }
      };

      if (isTrivialHref(props.href)) {
        props.role = props.role || 'button';
        // we want to make sure there is a href attribute on the node
        // otherwise, the cursor incorrectly styled (except with role='button')
        props.href = props.href || '#';
      }

      if (disabled) {
        props.tabIndex = -1;
        props['aria-disabled'] = true;
      }

      return (
        <Component
          ref={ref}
          {...props}
          onClick={handleClick}
          onKeyDown={createChainedFunction(handleKeyDown, onKeyDown)}
        />
      );
    },
  );

SafeAnchor.propTypes = propTypes;
SafeAnchor.displayName = 'SafeAnchor';

export SafeAnchor;
