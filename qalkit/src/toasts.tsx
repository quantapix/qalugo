import * as React from 'react';
import { useEffect, useMemo, useRef, useCallback } from 'react';

import classNames from 'classnames';

import useTimeout from '@restart/hooks/useTimeout';
import Fade from './utils';
import ToastHeader from './ToastHeader';
import ToastBody from './ToastBody';
import { useBootstrapPrefix } from './utils';
import ToastContext from './ToastContext';
import {
  BsPrefixProps,
  BsPrefixRefForwardingComponent,
  TransitionComponent,
} from './helpers';

export interface ToastProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  animation?: boolean;
  autohide?: boolean;
  delay?: number;
  onClose?: () => void;
  show?: boolean;
  transition?: TransitionComponent;
}

const propTypes = {
  /**
   * @default 'toast'
   */
  bsPrefix: string,

  
  animation: bool,

  
  autohide: bool,

  
  delay: number,

  
  onClose: func,

  
  show: bool,

  
  transition: elementType,
};

const Toast: BsPrefixRefForwardingComponent<'div', ToastProps> =
  React.forwardRef<HTMLDivElement, ToastProps>(
    (
      {
        bsPrefix,
        className,
        transition: Transition = Fade,
        show = true,
        animation = true,
        delay = 5000,
        autohide = false,
        onClose,
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'toast');

      // We use refs for these, because we don't want to restart the autohide
      // timer in case these values change.
      const delayRef = useRef(delay);
      const onCloseRef = useRef(onClose);

      useEffect(() => {
        delayRef.current = delay;
        onCloseRef.current = onClose;
      }, [delay, onClose]);

      const autohideTimeout = useTimeout();
      const autohideToast = !!(autohide && show);

      const autohideFunc = useCallback(() => {
        if (autohideToast) {
          onCloseRef.current?.();
        }
      }, [autohideToast]);

      useEffect(() => {
        // Only reset timer if show or autohide changes.
        autohideTimeout.set(autohideFunc, delayRef.current);
      }, [autohideTimeout, autohideFunc]);

      const toastContext = useMemo(
        () => ({
          onClose,
        }),
        [onClose],
      );

      const hasAnimation = !!(Transition && animation);

      const toast = (
        <div
          {...props}
          ref={ref}
          className={classNames(
            bsPrefix,
            className,
            !hasAnimation && (show ? 'show' : 'hide'),
          )}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        />
      );

      return (
        <ToastContext.Provider value={toastContext}>
          {hasAnimation && Transition ? (
            <Transition in={show} unmountOnExit>
              {toast}
            </Transition>
          ) : (
            toast
          )}
        </ToastContext.Provider>
      );
    },
  );

Toast.propTypes = propTypes;
Toast.displayName = 'Toast';

export Object.assign(Toast, {
  Body: ToastBody,
  Header: ToastHeader,
});

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('toast-body');


import * as React from 'react';

// TODO: check
export interface ToastContextType {
  onClose?: (e: Event) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose() {},
});

export ToastContext;


import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';

import { useBootstrapPrefix } from './utils';
import CloseButton, { CloseButtonVariant } from './close';
import ToastContext from './ToastContext';
import { BsPrefixOnlyProps } from './helpers';

export interface ToastHeaderProps
  extends BsPrefixOnlyProps,
    React.HTMLAttributes<HTMLDivElement> {
  closeLabel?: string;
  closeVariant?: CloseButtonVariant;
  closeButton?: boolean;
}

const propTypes = {
  bsPrefix: string,

  
  closeLabel: string,

  
  closeVariant: oneOf<CloseButtonVariant>(['white']),

  
  closeButton: bool,
};

const defaultProps = {
  closeLabel: 'Close',
  closeButton: true,
};

const ToastHeader = React.forwardRef<HTMLDivElement, ToastHeaderProps>(
  (
    {
      bsPrefix,
      closeLabel,
      closeVariant,
      closeButton,
      className,
      children,
      ...props
    }: ToastHeaderProps,
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'toast-header');

    const context = useContext(ToastContext);

    const handleClick = useEventCallback((e) => {
      context?.onClose?.(e);
    });

    return (
      <div ref={ref} {...props} className={classNames(bsPrefix, className)}>
        {children}

        {closeButton && (
          <CloseButton
            aria-label={closeLabel}
            variant={closeVariant}
            onClick={handleClick}
            data-dismiss="toast"
          />
        )}
      </div>
    );
  },
);

ToastHeader.displayName = 'ToastHeader';
ToastHeader.propTypes = propTypes;
ToastHeader.defaultProps = defaultProps;

export ToastHeader;
