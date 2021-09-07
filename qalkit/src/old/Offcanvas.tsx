import classNames from 'classnames';
import useCallbackRef from '@restart/hooks/useCallbackRef';
import useEventCallback from '@restart/hooks/useEventCallback';

import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import BaseModal, {
  ModalProps as BaseModalProps,
  ModalHandle,
} from 'react-overlays/Modal';
import ModalManager from 'react-overlays/ModalManager';
import useRootClose from 'react-overlays/useRootClose';
import Fade from './utils';
import OffcanvasBody from './OffcanvasBody';
import OffcanvasToggling from './OffcanvasToggling';
import ModalContext from './ModalContext';
import OffcanvasHeader from './OffcanvasHeader';
import OffcanvasTitle from './OffcanvasTitle';
import { BsPrefixRefForwardingComponent } from './helpers';
import { useBootstrapPrefix } from './utils';

export type OffcanvasPlacement = 'start' | 'end' | 'bottom';

export interface OffcanvasProps
  extends Omit<
    BaseModalProps,
    | 'role'
    | 'renderBackdrop'
    | 'renderDialog'
    | 'transition'
    | 'backdrop'
    | 'backdropTransition'
  > {
  bsPrefix?: string;
  backdropClassName?: string;
  scroll?: boolean;
  placement?: OffcanvasPlacement;
}

const propTypes = {
  /**
   * @default 'offcanvas'
   */
  bsPrefix: string,

  
  backdrop: bool,

  
  backdropClassName: string,

  
  keyboard: bool,

  
  scroll: bool,

  
  placement: oneOf<OffcanvasPlacement>(['start', 'end', 'bottom']),

  
  autoFocus: bool,

  
  enforceFocus: bool,

  
  restoreFocus: bool,

  /**
   * Options passed to focus function when `restoreFocus` is set to `true`
   *
   * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
   */
  restoreFocusOptions: shape({
    preventScroll: bool,
  }),

  
  show: bool,

  
  onShow: func,

  
  onHide: func,

  
  onEscapeKeyDown: func,

  
  onEnter: func,

  
  onEntering: func,

  
  onEntered: func,

  
  onExit: func,

  
  onExiting: func,

  
  onExited: func,

  /**
   * @private
   */
  container: any,

  'aria-labelledby': string,
};

const defaultProps: Partial<OffcanvasProps> = {
  show: false,
  backdrop: true,
  keyboard: true,
  scroll: false,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  placement: 'start',
};

function DialogTransition(props) {
  return <OffcanvasToggling {...props} />;
}

function BackdropTransition(props) {
  return <Fade {...props} />;
}

const Offcanvas: BsPrefixRefForwardingComponent<'div', OffcanvasProps> =
  React.forwardRef<ModalHandle, OffcanvasProps>(
    (
      {
        bsPrefix,
        className,
        children,
        'aria-labelledby': ariaLabelledby,
        placement,

        /* BaseModal props */

        show,
        backdrop,
        keyboard,
        scroll,
        onEscapeKeyDown,
        onShow,
        onHide,
        container,
        autoFocus,
        enforceFocus,
        restoreFocus,
        restoreFocusOptions,
        onEntered,
        onExit,
        onExiting,
        onEnter,
        onEntering,
        onExited,
        backdropClassName,
        manager: propsManager,
        ...props
      },
      ref,
    ) => {
      const [dialogElement, setDialogElement] = useCallbackRef<HTMLElement>();
      const modalManager = useRef<ModalManager>();
      const handleHide = useEventCallback(onHide);

      bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');
      const modalBsPrefix = useBootstrapPrefix(undefined, 'modal');

      // If there's a backdrop, let BaseModal handle closing.
      useRootClose(dialogElement, handleHide, {
        disabled: backdrop,
      });

      const modalContext = useMemo(
        () => ({
          onHide: handleHide,
        }),
        [handleHide],
      );

      function getModalManager() {
        if (propsManager) return propsManager;
        if (!modalManager.current)
          modalManager.current = new ModalManager({
            handleContainerOverflow: !scroll,
          });
        return modalManager.current;
      }

      const handleEnter = (node, ...args) => {
        if (node) node.style.visibility = 'visible';
        onEnter?.(node, ...args);
        setDialogElement(node);
      };

      const handleExited = (node, ...args) => {
        if (node) node.style.visibility = '';
        onExited?.(...args);
        setDialogElement(null);
      };

      const renderBackdrop = useCallback(
        (backdropProps) => (
          <div
            {...backdropProps}
            className={classNames(
              `${modalBsPrefix}-backdrop`,
              backdropClassName,
            )}
          />
        ),
        [backdropClassName, modalBsPrefix],
      );

      const renderDialog = (dialogProps) => (
        <div
          role="dialog"
          {...dialogProps}
          {...props}
          className={classNames(
            className,
            bsPrefix,
            `${bsPrefix}-${placement}`,
          )}
          aria-labelledby={ariaLabelledby}
        >
          {children}
        </div>
      );

      return (
        <ModalContext.Provider value={modalContext}>
          <BaseModal
            show={show}
            ref={ref}
            backdrop={backdrop}
            container={container}
            keyboard={keyboard}
            autoFocus={autoFocus}
            enforceFocus={enforceFocus}
            restoreFocus={restoreFocus}
            restoreFocusOptions={restoreFocusOptions}
            onEscapeKeyDown={onEscapeKeyDown}
            onShow={onShow}
            onHide={onHide}
            onEnter={handleEnter}
            onEntering={onEntering}
            onEntered={onEntered}
            onExit={onExit}
            onExiting={onExiting}
            onExited={handleExited}
            manager={getModalManager()}
            containerClassName={`${bsPrefix}-open`}
            transition={DialogTransition}
            backdropTransition={BackdropTransition}
            renderBackdrop={renderBackdrop}
            renderDialog={renderDialog}
          />
        </ModalContext.Provider>
      );
    },
  );

Offcanvas.displayName = 'Offcanvas';
Offcanvas.propTypes = propTypes;
Offcanvas.defaultProps = defaultProps;

export Object.assign(Offcanvas, {
  Body: OffcanvasBody,
  Header: OffcanvasHeader,
  Title: OffcanvasTitle,
});


import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('offcanvas-body');


import classNames from 'classnames';

import * as React from 'react';
import { useBootstrapPrefix } from './utils';
import { CloseButtonVariant } from './close';
import AbstractModalHeader, {
  AbstractModalHeaderProps,
} from './AbstractModalHeader';
import { BsPrefixOnlyProps } from './helpers';

export interface OffcanvasHeaderProps
  extends AbstractModalHeaderProps,
    BsPrefixOnlyProps {}

const propTypes = {
  /**
   * @default 'offcanvas-header'
   */
  bsPrefix: string,

  
  closeLabel: string,

  
  closeVariant: oneOf<CloseButtonVariant>(['white']),

  
  closeButton: bool,

  
  onHide: func,
};

const defaultProps = {
  closeLabel: 'Close',
  closeButton: false,
};

const OffcanvasHeader = React.forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas-header');
    return (
      <AbstractModalHeader
        ref={ref}
        {...props}
        className={classNames(className, bsPrefix)}
      />
    );
  },
);

OffcanvasHeader.displayName = 'OffcanvasHeader';
OffcanvasHeader.propTypes = propTypes;
OffcanvasHeader.defaultProps = defaultProps;

export OffcanvasHeader;


import createWithBsPrefix from './createWithBsPrefix';
import divWithClassName from './divWithClassName';

const DivStyledAsH5 = divWithClassName('h5');

export createWithBsPrefix('offcanvas-title', {
  Component: DivStyledAsH5,
});

import classNames from 'classnames';

import * as React from 'react';
import Transition, {
  TransitionStatus,
  ENTERED,
  ENTERING,
  EXITING,
} from 'react-transition-group/Transition';
import transitionEndListener from './transitionEndListener';
import { TransitionCallbacks, BsPrefixOnlyProps } from './helpers';
import TransitionWrapper from './transitions';
import { useBootstrapPrefix } from './utils';

export interface OffcanvasTogglingProps
  extends TransitionCallbacks,
    BsPrefixOnlyProps {
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
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
};

const transitionStyles = {
  [ENTERING]: 'show',
  [ENTERED]: 'show',
};

const OffcanvasToggling = React.forwardRef<
  Transition<any>,
  OffcanvasTogglingProps
>(({ bsPrefix, className, children, ...props }, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');

  return (
    <TransitionWrapper
      ref={ref}
      addEndListener={transitionEndListener}
      {...props}
      childRef={(children as any).ref}
    >
      {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
        React.cloneElement(children, {
          ...innerProps,
          className: classNames(
            className,
            children.props.className,
            (status === ENTERING || status === EXITING) &&
              `${bsPrefix}-toggling`,
            transitionStyles[status],
          ),
        })
      }
    </TransitionWrapper>
  );
});

OffcanvasToggling.propTypes = propTypes as any;
OffcanvasToggling.defaultProps = defaultProps;
OffcanvasToggling.displayName = 'OffcanvasToggling';

export OffcanvasToggling;
