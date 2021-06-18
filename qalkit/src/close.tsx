
import * as React from 'react';
import classNames from 'classnames';

export type CloseButtonVariant = 'white';

export interface CloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CloseButtonVariant;
}

const propTypes = {
  'aria-label': string,
  onClick: func,

  
  variant: oneOf<CloseButtonVariant>(['white']),
};

const defaultProps = {
  'aria-label': 'Close',
};

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={classNames(
        'btn-close',
        variant && `btn-close-${variant}`,
        className,
      )}
      {...props}
    />
  ),
);

CloseButton.displayName = 'CloseButton';
CloseButton.propTypes = propTypes;
CloseButton.defaultProps = defaultProps;

export CloseButton;
