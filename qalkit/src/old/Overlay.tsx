import * as React from 'react';
import { useRef } from 'react';
import classNames from 'classnames';

import BaseOverlay, {
  OverlayProps as BaseOverlayProps,
} from 'react-overlays/Overlay';
import safeFindDOMNode from 'react-overlays/safeFindDOMNode';
import { componentOrElement, elementType } from 'prop-types-extra';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import useOverlayOffset from './useOverlayOffset';
import Fade from './utils';
import { TransitionType } from './helpers';
import { ArrowProps, Placement, RootCloseEvent } from './types';

export interface OverlayInjectedProps {
  ref: React.RefCallback<HTMLElement>;
  style: React.CSSProperties;
  'aria-labelledby'?: string;

  arrowProps: ArrowProps;

  show: boolean;
  placement: Placement;
  popper: {
    state: any;
    outOfBoundaries: boolean;
    placement: Placement;
    scheduleUpdate: () => void;
  };
  [prop: string]: any;
}

export type OverlayChildren =
  | React.ReactElement<OverlayInjectedProps>
  | ((injected: OverlayInjectedProps) => React.ReactNode);

export interface OverlayProps
  extends Omit<BaseOverlayProps, 'children' | 'transition' | 'rootCloseEvent'> {
  children: OverlayChildren;
  transition?: TransitionType;
  placement?: Placement;
  rootCloseEvent?: RootCloseEvent;
}

const propTypes = {
  
  container: oneOfType([componentOrElement, PropTypes.func]),

  
  target: oneOfType([componentOrElement, PropTypes.func]),

  
  show: bool,

  
  popperConfig: object,

  
  rootClose: bool,

  
  rootCloseEvent: oneOf<RootCloseEvent>(['click', 'mousedown']),

  
  onHide: func,

  
  transition: oneOfType([PropTypes.bool, elementType]),

  
  onEnter: func,

  
  onEntering: func,

  
  onEntered: func,

  
  onExit: func,

  
  onExiting: func,

  
  onExited: func,

  
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
};

const defaultProps: Partial<OverlayProps> = {
  transition: Fade,
  rootClose: false,
  show: false,
  placement: 'top',
};

function wrapRefs(props, arrowProps) {
  const { ref } = props;
  const { ref: aRef } = arrowProps;

  props.ref = ref.__wrapped || (ref.__wrapped = (r) => ref(safeFindDOMNode(r)));
  arrowProps.ref =
    aRef.__wrapped || (aRef.__wrapped = (r) => aRef(safeFindDOMNode(r)));
}

const Overlay = React.forwardRef<HTMLElement, OverlayProps>(
  (
    { children: overlay, transition, popperConfig = {}, ...outerProps },
    outerRef,
  ) => {
    const popperRef = useRef({});
    const [ref, modifiers] = useOverlayOffset();
    const mergedRef = useMergedRefs(outerRef, ref);

    const actualTransition =
      transition === true ? Fade : transition || undefined;

    return (
      <BaseOverlay
        {...outerProps}
        ref={mergedRef}
        popperConfig={{
          ...popperConfig,
          modifiers: modifiers.concat(popperConfig.modifiers || []),
        }}
        transition={actualTransition}
      >
        {({
          props: overlayProps,
          arrowProps,
          show,
          update,
          forceUpdate: _,
          placement,
          state,
          ...props
        }) => {
          wrapRefs(overlayProps, arrowProps);
          const popper = Object.assign(popperRef.current, {
            state,
            scheduleUpdate: update,
            placement,
            outOfBoundaries:
              state?.modifiersData.hide?.isReferenceHidden || false,
          });

          if (typeof overlay === 'function')
            return overlay({
              ...props,
              ...overlayProps,
              placement,
              show,
              ...(!transition && show && { className: 'show' }),
              popper,
              arrowProps,
            });

          return React.cloneElement(overlay as React.ReactElement, {
            ...props,
            ...overlayProps,
            placement,
            arrowProps,
            popper,
            className: classNames(
              (overlay as React.ReactElement).props.className,
              !transition && show && 'show',
            ),
            style: {
              ...(overlay as React.ReactElement).props.style,
              ...overlayProps.style,
            },
          });
        }}
      </BaseOverlay>
    );
  },
);

Overlay.displayName = 'Overlay';
Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export Overlay;
import contains from 'dom-helpers/contains';

import * as React from 'react';
import { cloneElement, useCallback, useRef } from 'react';
import useTimeout from '@restart/hooks/useTimeout';
import safeFindDOMNode from 'react-overlays/safeFindDOMNode';
import warning from 'warning';
import { useUncontrolledProp } from 'uncontrollable';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import Overlay, { OverlayChildren, OverlayProps } from './overlay';

export type OverlayTriggerType = 'hover' | 'click' | 'focus';

export type OverlayDelay = number | { show: number; hide: number };

export type OverlayInjectedProps = {
  onFocus?: (...args: any[]) => any;
};

export type OverlayTriggerRenderProps = OverlayInjectedProps & {
  ref: React.Ref<any>;
};

export interface OverlayTriggerProps
  extends Omit<OverlayProps, 'children' | 'target'> {
  children:
    | React.ReactElement
    | ((props: OverlayTriggerRenderProps) => React.ReactNode);
  trigger?: OverlayTriggerType | OverlayTriggerType[];
  delay?: OverlayDelay;
  show?: boolean;
  defaultShow?: boolean;
  onToggle?: (nextShow: boolean) => void;
  flip?: boolean;
  overlay: OverlayChildren;

  target?: never;
  onHide?: never;
}

function normalizeDelay(delay?: OverlayDelay) {
  return delay && typeof delay === 'object'
    ? delay
    : {
        show: delay,
        hide: delay,
      };
}

// Simple implementation of mouseEnter and mouseLeave.
// React's built version is broken: https://github.com/facebook/react/issues/4251
// for cases when the trigger is disabled and mouseOut/Over can cause flicker
// moving from one child element to another.
function handleMouseOverOut(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  handler: (...args: [React.MouseEvent, ...any[]]) => any,
  args: [React.MouseEvent, ...any[]],
  relatedNative: 'fromElement' | 'toElement',
) {
  const [e] = args;
  const target = e.currentTarget;
  const related = e.relatedTarget || e.nativeEvent[relatedNative];

  if ((!related || related !== target) && !contains(target, related)) {
    handler(...args);
  }
}

const triggerType = PropTypes.oneOf(['click', 'hover', 'focus']);

const propTypes = {
  children: oneOfType([PropTypes.element, PropTypes.func]).isRequired,

  /**
   * Specify which action or actions trigger Overlay visibility
   *
   * @type {'hover' | 'click' |'focus' | Array<'hover' | 'click' |'focus'>}
   */
  trigger: oneOfType([triggerType, PropTypes.arrayOf(triggerType)]),

  
  delay: oneOfType([
    PropTypes.number,
    PropTypes.shape({
      show: number,
      hide: number,
    }),
  ]),

  /**
   * The visibility of the Overlay. `show` is a _controlled_ prop so should be paired
   * with `onToggle` to avoid breaking user interactions.
   *
   * Manually toggling `show` does **not** wait for `delay` to change the visibility.
   *
   * @controllable onToggle
   */
  show: bool,

  
  defaultShow: bool,

  /**
   * A callback that fires when the user triggers a change in tooltip visibility.
   *
   * `onToggle` is called with the desired next `show`, and generally should be passed
   * back to the `show` prop. `onToggle` fires _after_ the configured `delay`
   *
   * @controllable `show`
   */
  onToggle: func,

  
  flip: bool,

  
  overlay: oneOfType([PropTypes.func, PropTypes.element.isRequired]),

  
  popperConfig: object,

  // Overridden props from `<Overlay>`.
  /**
   * @private
   */
  target: oneOf([null]),

  /**
   * @private
   */
  onHide: oneOf([null]),

  
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
};

const defaultProps = {
  defaultShow: false,
  trigger: ['hover', 'focus'],
};

function OverlayTrigger({
  trigger,
  overlay,
  children,
  popperConfig = {},

  show: propsShow,
  defaultShow = false,
  onToggle,

  delay: propsDelay,
  placement,
  flip = placement && placement.indexOf('auto') !== -1,
  ...props
}: OverlayTriggerProps) {
  const triggerNodeRef = useRef(null);
  const mergedRef = useMergedRefs<unknown>(
    triggerNodeRef,
    (children as any).ref,
  );
  const timeout = useTimeout();
  const hoverStateRef = useRef<string>('');

  const [show, setShow] = useUncontrolledProp(propsShow, defaultShow, onToggle);

  const delay = normalizeDelay(propsDelay);

  const { onFocus, onBlur, onClick } =
    typeof children !== 'function'
      ? React.Children.only(children).props
      : ({} as any);

  const attachRef = (r: React.ComponentClass | Element | null | undefined) => {
    mergedRef(safeFindDOMNode(r));
  };

  const handleShow = useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'show';

    if (!delay.show) {
      setShow(true);
      return;
    }

    timeout.set(() => {
      if (hoverStateRef.current === 'show') setShow(true);
    }, delay.show);
  }, [delay.show, setShow, timeout]);

  const handleHide = useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'hide';

    if (!delay.hide) {
      setShow(false);
      return;
    }

    timeout.set(() => {
      if (hoverStateRef.current === 'hide') setShow(false);
    }, delay.hide);
  }, [delay.hide, setShow, timeout]);

  const handleFocus = useCallback(
    (...args: any[]) => {
      handleShow();
      onFocus?.(...args);
    },
    [handleShow, onFocus],
  );

  const handleBlur = useCallback(
    (...args: any[]) => {
      handleHide();
      onBlur?.(...args);
    },
    [handleHide, onBlur],
  );

  const handleClick = useCallback(
    (...args: any[]) => {
      setShow(!show);
      onClick?.(...args);
    },
    [onClick, setShow, show],
  );

  const handleMouseOver = useCallback(
    (...args: [React.MouseEvent, ...any[]]) => {
      handleMouseOverOut(handleShow, args, 'fromElement');
    },
    [handleShow],
  );

  const handleMouseOut = useCallback(
    (...args: [React.MouseEvent, ...any[]]) => {
      handleMouseOverOut(handleHide, args, 'toElement');
    },
    [handleHide],
  );

  const triggers: string[] = trigger == null ? [] : [].concat(trigger as any);
  const triggerProps: any = {
    ref: attachRef,
  };

  if (triggers.indexOf('click') !== -1) {
    triggerProps.onClick = handleClick;
  }

  if (triggers.indexOf('focus') !== -1) {
    triggerProps.onFocus = handleFocus;
    triggerProps.onBlur = handleBlur;
  }

  if (triggers.indexOf('hover') !== -1) {
    warning(
      triggers.length > 1,
      '[react-bootstrap] Specifying only the `"hover"` trigger limits the visibility of the overlay to just mouse users. Consider also including the `"focus"` trigger so that touch and keyboard only users can see the overlay as well.',
    );
    triggerProps.onMouseOver = handleMouseOver;
    triggerProps.onMouseOut = handleMouseOut;
  }

  return (
    <>
      {typeof children === 'function'
        ? children(triggerProps)
        : cloneElement(children, triggerProps)}
      <Overlay
        {...props}
        show={show}
        onHide={handleHide}
        flip={flip}
        placement={placement}
        popperConfig={popperConfig}
        target={triggerNodeRef.current}
      >
        {overlay}
      </Overlay>
    </>
  );
}

OverlayTrigger.propTypes = propTypes;
OverlayTrigger.defaultProps = defaultProps;

export OverlayTrigger;

import { useMemo, useRef } from 'react';
import hasClass from 'dom-helpers/hasClass';
import { Options } from 'react-overlays/usePopper';
import { useBootstrapPrefix } from './utils';
import Popover from './popover';

// This is meant for internal use.
// This applies a custom offset to the overlay if it's a popover.
export function useOverlayOffset(): [
  React.RefObject<HTMLElement>,
  Options['modifiers'],
] {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popoverClass = useBootstrapPrefix(undefined, 'popover');

  const offset = useMemo(
    () => ({
      name: 'offset',
      options: {
        offset: () => {
          if (
            overlayRef.current &&
            hasClass(overlayRef.current, popoverClass)
          ) {
            return Popover.POPPER_OFFSET;
          }
          return [0, 0];
        },
      },
    }),
    [popoverClass],
  );

  return [overlayRef, [offset]];
}
