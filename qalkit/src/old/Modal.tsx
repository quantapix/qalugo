import classNames from 'classnames';
import addEventListener from 'dom-helpers/addEventListener';
import canUseDOM from 'dom-helpers/canUseDOM';
import ownerDocument from 'dom-helpers/ownerDocument';
import removeEventListener from 'dom-helpers/removeEventListener';
import getScrollbarSize from 'dom-helpers/scrollbarSize';
import useCallbackRef from '@restart/hooks/useCallbackRef';
import useEventCallback from '@restart/hooks/useEventCallback';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import useWillUnmount from '@restart/hooks/useWillUnmount';
import transitionEnd from 'dom-helpers/transitionEnd';

import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import BaseModal, { ModalProps as BaseModalProps } from 'react-overlays/Modal';
import BootstrapModalManager from './BootstrapModalManager';
import Fade from './utils';
import ModalBody from './ModalBody';
import ModalContext from './ModalContext';
import ModalDialog from './ModalDialog';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalTitle from './ModalTitle';
import { BsPrefixRefForwardingComponent } from './helpers';
import { useBootstrapPrefix } from './utils';

export interface ModalProps
  extends Omit<
    BaseModalProps,
    | 'role'
    | 'renderBackdrop'
    | 'renderDialog'
    | 'transition'
    | 'backdropTransition'
  > {
  size?: 'sm' | 'lg' | 'xl';
  fullscreen?:
    | true
    | 'sm-down'
    | 'md-down'
    | 'lg-down'
    | 'xl-down'
    | 'xxl-down';
  bsPrefix?: string;
  centered?: boolean;
  backdropClassName?: string;
  animation?: boolean;
  dialogClassName?: string;
  contentClassName?: string;
  dialogAs?: React.ElementType;
  scrollable?: boolean;
}

let manager;

const propTypes = {
  /**
   * @default 'modal'
   */
  bsPrefix: string,

  /**
   * Render a large, extra large or small modal.
   * When not provided, the modal is rendered with medium (default) size.
   * @type ('sm'|'lg'|'xl')
   */
  size: string,

  /**
   * Renders a fullscreen modal. Specifying a breakpoint will render the modal
   * as fullscreen __below__ the breakpoint size.
   *
   * @type (true|'sm-down'|'md-down'|'lg-down'|'xl-down'|'xxl-down')
   */
  fullscreen: oneOfType([PropTypes.bool, PropTypes.string]),

  
  centered: bool,

  
  backdrop: oneOf(['static', true, false]),

  
  backdropClassName: string,

  
  keyboard: bool,

  
  scrollable: bool,

  
  animation: bool,

  
  dialogClassName: string,

  
  contentClassName: string,

  
  dialogAs: elementType,

  
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

  
  manager: object,

  /**
   * @private
   */
  container: any,

  'aria-labelledby': any,
};

const defaultProps = {
  show: false,
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  animation: true,
  dialogAs: ModalDialog,
};

/* eslint-disable no-use-before-define, react/no-multi-comp */
function DialogTransition(props) {
  return <Fade {...props} />;
}

function BackdropTransition(props) {
  return <Fade {...props} />;
}

/* eslint-enable no-use-before-define */
const Modal: BsPrefixRefForwardingComponent<'div', ModalProps> =
  React.forwardRef(
    (
      {
        bsPrefix,
        className,
        style,
        dialogClassName,
        contentClassName,
        children,
        dialogAs: Dialog,
        'aria-labelledby': ariaLabelledby,

        /* BaseModal props */

        show,
        animation,
        backdrop,
        keyboard,
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
      const [modalStyle, setStyle] = useState({});
      const [animateStaticModal, setAnimateStaticModal] = useState(false);
      const waitingForMouseUpRef = useRef(false);
      const ignoreBackdropClickRef = useRef(false);
      const removeStaticModalAnimationRef = useRef<(() => void) | null>(null);

      // TODO: what's this type
      const [modal, setModalRef] = useCallbackRef<{ dialog: any }>();
      const mergedRef = useMergedRefs(ref, setModalRef);
      const handleHide = useEventCallback(onHide);

      bsPrefix = useBootstrapPrefix(bsPrefix, 'modal');

      const modalContext = useMemo(
        () => ({
          onHide: handleHide,
        }),
        [handleHide],
      );

      function getModalManager() {
        if (propsManager) return propsManager;
        if (!manager) manager = new BootstrapModalManager();
        return manager;
      }

      function updateDialogStyle(node) {
        if (!canUseDOM) return;

        const containerIsOverflowing =
          getModalManager().isContainerOverflowing(modal);

        const modalIsOverflowing =
          node.scrollHeight > ownerDocument(node).documentElement.clientHeight;

        setStyle({
          paddingRight:
            containerIsOverflowing && !modalIsOverflowing
              ? getScrollbarSize()
              : undefined,
          paddingLeft:
            !containerIsOverflowing && modalIsOverflowing
              ? getScrollbarSize()
              : undefined,
        });
      }

      const handleWindowResize = useEventCallback(() => {
        if (modal) {
          updateDialogStyle(modal.dialog);
        }
      });

      useWillUnmount(() => {
        removeEventListener(window as any, 'resize', handleWindowResize);
        removeStaticModalAnimationRef.current?.();
      });

      // We prevent the modal from closing during a drag by detecting where the
      // the click originates from. If it starts in the modal and then ends outside
      // don't close.
      const handleDialogMouseDown = () => {
        waitingForMouseUpRef.current = true;
      };

      const handleMouseUp = (e) => {
        if (
          waitingForMouseUpRef.current &&
          modal &&
          e.target === modal.dialog
        ) {
          ignoreBackdropClickRef.current = true;
        }
        waitingForMouseUpRef.current = false;
      };

      const handleStaticModalAnimation = () => {
        setAnimateStaticModal(true);
        removeStaticModalAnimationRef.current = transitionEnd(
          modal!.dialog,
          () => {
            setAnimateStaticModal(false);
          },
        );
      };

      const handleStaticBackdropClick = (e) => {
        if (e.target !== e.currentTarget) {
          return;
        }

        handleStaticModalAnimation();
      };

      const handleClick = (e) => {
        if (backdrop === 'static') {
          handleStaticBackdropClick(e);
          return;
        }

        if (ignoreBackdropClickRef.current || e.target !== e.currentTarget) {
          ignoreBackdropClickRef.current = false;
          return;
        }

        onHide();
      };

      const handleEscapeKeyDown = (e) => {
        if (!keyboard && backdrop === 'static') {
          // Call preventDefault to stop modal from closing in react-overlays,
          // then play our animation.
          e.preventDefault();
          handleStaticModalAnimation();
        } else if (keyboard && onEscapeKeyDown) {
          onEscapeKeyDown(e);
        }
      };

      const handleEnter = (node, ...args) => {
        if (node) {
          node.style.display = 'block';
          updateDialogStyle(node);
        }

        onEnter?.(node, ...args);
      };

      const handleExit = (node, ...args) => {
        removeStaticModalAnimationRef.current?.();
        onExit?.(node, ...args);
      };

      const handleEntering = (node, ...args) => {
        onEntering?.(node, ...args);

        // FIXME: This should work even when animation is disabled.
        addEventListener(window as any, 'resize', handleWindowResize);
      };

      const handleExited = (node, ...args) => {
        if (node) node.style.display = ''; // RHL removes it sometimes
        onExited?.(...args);

        // FIXME: This should work even when animation is disabled.
        removeEventListener(window as any, 'resize', handleWindowResize);
      };

      const renderBackdrop = useCallback(
        (backdropProps) => (
          <div
            {...backdropProps}
            className={classNames(
              `${bsPrefix}-backdrop`,
              backdropClassName,
              !animation && 'show',
            )}
          />
        ),
        [animation, backdropClassName, bsPrefix],
      );

      const baseModalStyle = { ...style, ...modalStyle };

      // Sets `display` always block when `animation` is false
      if (!animation) {
        baseModalStyle.display = 'block';
      }

      const renderDialog = (dialogProps) => (
        <div
          role="dialog"
          {...dialogProps}
          style={baseModalStyle}
          className={classNames(
            className,
            bsPrefix,
            animateStaticModal && `${bsPrefix}-static`,
          )}
          onClick={backdrop ? handleClick : undefined}
          onMouseUp={handleMouseUp}
          aria-labelledby={ariaLabelledby}
        >
          {/*
        // @ts-ignore */}
          <Dialog
            {...props}
            onMouseDown={handleDialogMouseDown}
            className={dialogClassName}
            contentClassName={contentClassName}
          >
            {children}
          </Dialog>
        </div>
      );

      return (
        <ModalContext.Provider value={modalContext}>
          <BaseModal
            show={show}
            ref={mergedRef}
            backdrop={backdrop}
            container={container}
            keyboard // Always set true - see handleEscapeKeyDown
            autoFocus={autoFocus}
            enforceFocus={enforceFocus}
            restoreFocus={restoreFocus}
            restoreFocusOptions={restoreFocusOptions}
            onEscapeKeyDown={handleEscapeKeyDown}
            onShow={onShow}
            onHide={onHide}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={onEntered}
            onExit={handleExit}
            onExiting={onExiting}
            onExited={handleExited}
            manager={getModalManager()}
            containerClassName={`${bsPrefix}-open`}
            transition={animation ? DialogTransition : undefined}
            backdropTransition={animation ? BackdropTransition : undefined}
            renderBackdrop={renderBackdrop}
            renderDialog={renderDialog}
          />
        </ModalContext.Provider>
      );
    },
  );

Modal.displayName = 'Modal';
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export Object.assign(Modal, {
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  Footer: ModalFooter,
  Dialog: ModalDialog,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150,
});



import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import CloseButton, { CloseButtonVariant } from './close';
import ModalContext from './ModalContext';

export interface AbstractModalHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  closeLabel?: string;
  closeVariant?: CloseButtonVariant;
  closeButton?: boolean;
  onHide?: () => void;
}

const propTypes = {
  
  closeLabel: string,

  
  closeVariant: oneOf<CloseButtonVariant>(['white']),

  
  closeButton: bool,

  
  onHide: func,
};

const defaultProps = {
  closeLabel: 'Close',
  closeButton: false,
};

const AbstractModalHeader = React.forwardRef<
  HTMLDivElement,
  AbstractModalHeaderProps
>(
  (
    { closeLabel, closeVariant, closeButton, onHide, children, ...props },
    ref,
  ) => {
    const context = useContext(ModalContext);

    const handleClick = useEventCallback(() => {
      context?.onHide();
      onHide?.();
    });

    return (
      <div ref={ref} {...props}>
        {children}

        {closeButton && (
          <CloseButton
            aria-label={closeLabel}
            variant={closeVariant}
            onClick={handleClick}
          />
        )}
      </div>
    );
  },
);

AbstractModalHeader.propTypes = propTypes;
AbstractModalHeader.defaultProps = defaultProps;

export AbstractModalHeader;

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('modal-body');

import * as React from 'react';

interface ModalContextType {
  onHide: () => void;
}

const ModalContext = React.createContext<ModalContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHide() {},
});

export ModalContext;

import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';

import { BsPrefixProps } from './helpers';

export interface ModalDialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BsPrefixProps {
  size?: 'sm' | 'lg' | 'xl';
  fullscreen?:
    | true
    | 'sm-down'
    | 'md-down'
    | 'lg-down'
    | 'xl-down'
    | 'xxl-down';
  centered?: boolean;
  scrollable?: boolean;
  contentClassName?: string;
}

const propTypes = {
  /** @default 'modal' */
  bsPrefix: string,
  contentClassName: string,

  /**
   * Render a large, extra large or small modal.
   *
   * @type ('sm'|'lg','xl')
   */
  size: string,

  /**
   * Renders a fullscreen modal. Specifying a breakpoint will render the modal
   * as fullscreen __below__ the breakpoint size.
   *
   * @type (true|'sm-down'|'md-down'|'lg-down'|'xl-down'|'xxl-down')
   */
  fullscreen: oneOfType([PropTypes.bool, PropTypes.string]),

  
  centered: bool,

  
  scrollable: bool,
};

const ModalDialog = React.forwardRef<HTMLDivElement, ModalDialogProps>(
  (
    {
      bsPrefix,
      className,
      contentClassName,
      centered,
      size,
      fullscreen,
      children,
      scrollable,
      ...props
    }: ModalDialogProps,
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'modal');
    const dialogClass = `${bsPrefix}-dialog`;

    const fullScreenClass =
      typeof fullscreen === 'string'
        ? `${bsPrefix}-fullscreen-${fullscreen}`
        : `${bsPrefix}-fullscreen`;

    return (
      <div
        {...props}
        ref={ref}
        className={classNames(
          dialogClass,
          className,
          size && `${bsPrefix}-${size}`,
          centered && `${dialogClass}-centered`,
          scrollable && `${dialogClass}-scrollable`,
          fullscreen && fullScreenClass,
        )}
      >
        <div className={classNames(`${bsPrefix}-content`, contentClassName)}>
          {children}
        </div>
      </div>
    );
  },
);

ModalDialog.displayName = 'ModalDialog';
ModalDialog.propTypes = propTypes as any;

export ModalDialog;

import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('modal-footer');

import classNames from 'classnames';

import * as React from 'react';
import { useBootstrapPrefix } from './utils';
import { CloseButtonVariant } from './close';
import AbstractModalHeader, {
  AbstractModalHeaderProps,
} from './AbstractModalHeader';
import { BsPrefixOnlyProps } from './helpers';

export interface ModalHeaderProps
  extends AbstractModalHeaderProps,
    BsPrefixOnlyProps {}

const propTypes = {
  /**
   * @default 'modal-header'
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

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'modal-header');
    return (
      <AbstractModalHeader
        ref={ref}
        {...props}
        className={classNames(className, bsPrefix)}
      />
    );
  },
);

ModalHeader.displayName = 'ModalHeader';
ModalHeader.propTypes = propTypes;
ModalHeader.defaultProps = defaultProps;

export ModalHeader;


import createWithBsPrefix from './createWithBsPrefix';
import divWithClassName from './divWithClassName';

const DivStyledAsH4 = divWithClassName('h4');

export createWithBsPrefix('modal-title', { Component: DivStyledAsH4 });


import css from 'dom-helpers/css';
import qsa from 'dom-helpers/querySelectorAll';
import getScrollbarSize from 'dom-helpers/scrollbarSize';
import ModalManager from 'react-overlays/ModalManager';

const Selector = {
  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  STICKY_CONTENT: '.sticky-top',
  NAVBAR_TOGGLER: '.navbar-toggler',
};

export class BootstrapModalManager extends ModalManager {
  private adjustAndStore<T extends keyof CSSStyleDeclaration>(
    prop: T,
    element: HTMLElement,
    adjust: number,
  ) {
    const actual = element.style[prop];
    // TODO: DOMStringMap and CSSStyleDeclaration aren't strictly compatible
    // @ts-ignore
    element.dataset[prop] = actual;
    css(element, {
      [prop]: `${parseFloat(css(element, prop as any)) + adjust}px`,
    });
  }

  private restore<T extends keyof CSSStyleDeclaration>(
    prop: T,
    element: HTMLElement,
  ) {
    const value = element.dataset[prop];
    if (value !== undefined) {
      delete element.dataset[prop];
      css(element, { [prop]: value });
    }
  }

  setContainerStyle(containerState, container) {
    super.setContainerStyle(containerState, container);

    if (!containerState.overflowing) return;
    const size = getScrollbarSize();

    qsa(container, Selector.FIXED_CONTENT).forEach((el) =>
      this.adjustAndStore('paddingRight', el, size),
    );
    qsa(container, Selector.STICKY_CONTENT).forEach((el) =>
      this.adjustAndStore('marginRight', el, -size),
    );
    qsa(container, Selector.NAVBAR_TOGGLER).forEach((el) =>
      this.adjustAndStore('marginRight', el, size),
    );
  }

  removeContainerStyle(containerState, container) {
    super.removeContainerStyle(containerState, container);

    qsa(container, Selector.FIXED_CONTENT).forEach((el) =>
      this.restore('paddingRight', el),
    );
    qsa(container, Selector.STICKY_CONTENT).forEach((el) =>
      this.restore('marginRight', el),
    );
    qsa(container, Selector.NAVBAR_TOGGLER).forEach((el) =>
      this.restore('marginRight', el),
    );
  }
}
