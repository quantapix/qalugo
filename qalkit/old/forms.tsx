import classNames from 'classnames';

import * as React from 'react';
import FormCheck from './FormCheck';
import FormControl from './FormControl';
import FormFloating from './FormFloating';
import FormGroup from './FormGroup';
import FormLabel from './FormLabel';
import FormRange from './FormRange';
import FormSelect from './FormSelect';
import FormText from './FormText';
import Switch from './Switch';
import FloatingLabel from './FloatingLabel';
import { BsPrefixRefForwardingComponent, AsProp } from './helpers';

export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    AsProp {
  validated?: boolean;
}

const propTypes = {
  /**
   * The Form `ref` will be forwarded to the underlying element,
   * which means, unless it's rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,

  
  validated: bool,
  as: elementType,
};

const Form: BsPrefixRefForwardingComponent<'form', FormProps> =
  React.forwardRef<HTMLFormElement, FormProps>(
    (
      {
        className,
        validated,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'form',
        ...props
      },
      ref,
    ) => (
      <Component
        {...props}
        ref={ref}
        className={classNames(className, validated && 'was-validated')}
      />
    ),
  );

Form.displayName = 'Form';
Form.propTypes = propTypes as any;

export Object.assign(Form, {
  Group: FormGroup,
  Control: FormControl,
  Floating: FormFloating,
  Check: FormCheck,
  Switch,
  Label: FormLabel,
  Text: FormText,
  Range: FormRange,
  Select: FormSelect,
  FloatingLabel,
});

import classNames from 'classnames';

import * as React from 'react';
import { useContext, useMemo } from 'react';
import Feedback from './Feedback';
import FormCheckInput from './FormCheckInput';
import FormCheckLabel from './FormCheckLabel';
import FormContext from './FormContext';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export type FormCheckType = 'checkbox' | 'radio' | 'switch';

export interface FormCheckProps
  extends BsPrefixProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  inline?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  type?: FormCheckType;
  isValid?: boolean;
  isInvalid?: boolean;
  feedbackTooltip?: boolean;
  feedback?: React.ReactNode;
  bsSwitchPrefix?: string;
}

const propTypes = {
  /**
   * @default 'form-check'
   */
  bsPrefix: string,

  /**
   * bsPrefix override for the base switch class.
   *
   * @default 'form-switch'
   */
  bsSwitchPrefix: string,

  /**
   * The FormCheck `ref` will be forwarded to the underlying input element,
   * which means it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,

  /**
   * The underlying HTML element to use when rendering the FormCheck.
   *
   * @type {('input'|elementType)}
   */
  as: elementType,

  
  id: string,

  /**
   * Provide a function child to manually handle the layout of the FormCheck's inner components.
   *
   * ```jsx
   * <FormCheck>
   *   <FormCheck.Input isInvalid type={radio} />
   *   <FormCheck.Label>Allow us to contact you?</FormCheck.Label>
   *   <Feedback type="invalid">Yo this is required</Feedback>
   * </FormCheck>
   * ```
   */
  children: node,

  
  inline: bool,

  
  disabled: bool,

  
  title: string,

  
  label: node,

  /**
   * The type of checkable.
   * @type {('radio' | 'checkbox' | 'switch')}
   */
  type: oneOf(['radio', 'checkbox', 'switch']),

  
  isValid: bool,

  
  isInvalid: bool,

  
  feedbackTooltip: bool,

  
  feedback: node,
};

const FormCheck: BsPrefixRefForwardingComponent<'input', FormCheckProps> =
  React.forwardRef<HTMLInputElement, FormCheckProps>(
    (
      {
        id,
        bsPrefix,
        bsSwitchPrefix,
        inline = false,
        disabled = false,
        isValid = false,
        isInvalid = false,
        feedbackTooltip = false,
        feedback,
        className,
        style,
        title = '',
        type = 'checkbox',
        label,
        children,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as = 'input',
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check');
      bsSwitchPrefix = useBootstrapPrefix(bsSwitchPrefix, 'form-switch');

      const { controlId } = useContext(FormContext);
      const innerFormContext = useMemo(
        () => ({
          controlId: id || controlId,
        }),
        [controlId, id],
      );

      const hasLabel = label != null && label !== false && !children;

      const input = (
        <FormCheckInput
          {...props}
          type={type === 'switch' ? 'checkbox' : type}
          ref={ref}
          isValid={isValid}
          isInvalid={isInvalid}
          disabled={disabled}
          as={as}
        />
      );

      return (
        <FormContext.Provider value={innerFormContext}>
          <div
            style={style}
            className={classNames(
              className,
              label && bsPrefix,
              inline && `${bsPrefix}-inline`,
              type === 'switch' && bsSwitchPrefix,
            )}
          >
            {children || (
              <>
                {input}
                {hasLabel && (
                  <FormCheckLabel title={title}>{label}</FormCheckLabel>
                )}
                {(isValid || isInvalid) && (
                  <Feedback
                    type={isValid ? 'valid' : 'invalid'}
                    tooltip={feedbackTooltip}
                  >
                    {feedback}
                  </Feedback>
                )}
              </>
            )}
          </div>
        </FormContext.Provider>
      );
    },
  );

FormCheck.displayName = 'FormCheck';
FormCheck.propTypes = propTypes;

export Object.assign(FormCheck, {
  Input: FormCheckInput,
  Label: FormCheckLabel,
});


import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import FormContext from './FormContext';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

type FormCheckInputType = 'checkbox' | 'radio';

export interface FormCheckInputProps
  extends BsPrefixProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: FormCheckInputType;
  isValid?: boolean;
  isInvalid?: boolean;
}

const propTypes = {
  /**
   * @default 'form-check-input'
   */
  bsPrefix: string,

  /**
   * The underlying HTML element to use when rendering the FormCheckInput.
   *
   * @type {('input'|elementType)}
   */
  as: elementType,

  
  id: string,

  
  type: oneOf(['radio', 'checkbox']).isRequired,

  
  isValid: bool,

  
  isInvalid: bool,
};

const FormCheckInput: BsPrefixRefForwardingComponent<
  'input',
  FormCheckInputProps
> = React.forwardRef<HTMLInputElement, FormCheckInputProps>(
  (
    {
      id,
      bsPrefix,
      className,
      type = 'checkbox',
      isValid = false,
      isInvalid = false,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'input',
      ...props
    },
    ref,
  ) => {
    const { controlId } = useContext(FormContext);
    bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-input');

    return (
      <Component
        {...props}
        ref={ref}
        type={type}
        id={id || controlId}
        className={classNames(
          className,
          bsPrefix,
          isValid && 'is-valid',
          isInvalid && 'is-invalid',
        )}
      />
    );
  },
);

FormCheckInput.displayName = 'FormCheckInput';
FormCheckInput.propTypes = propTypes;

export FormCheckInput;


import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import FormContext from './FormContext';
import { useBootstrapPrefix } from './utils';

import { BsPrefixProps } from './helpers';

export interface FormCheckLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    BsPrefixProps {}

const propTypes = {
  /**
   * @default 'form-check-label'
   */
  bsPrefix: string,

  
  htmlFor: string,
};

const FormCheckLabel = React.forwardRef<HTMLLabelElement, FormCheckLabelProps>(
  ({ bsPrefix, className, htmlFor, ...props }, ref) => {
    const { controlId } = useContext(FormContext);

    bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-label');

    return (
      <label // eslint-disable-line jsx-a11y/label-has-associated-control
        {...props}
        ref={ref}
        htmlFor={htmlFor || controlId}
        className={classNames(className, bsPrefix)}
      />
    );
  },
);

FormCheckLabel.displayName = 'FormCheckLabel';
FormCheckLabel.propTypes = propTypes;

export FormCheckLabel;

import * as React from 'react';

// TODO
interface FormContextType {
  controlId?: any;
}

const FormContext = React.createContext<FormContextType>({});

export FormContext;


import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import warning from 'warning';
import Feedback from './Feedback';
import FormContext from './FormContext';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

export interface FormControlProps
  extends BsPrefixProps,
    React.HTMLAttributes<FormControlElement> {
  htmlSize?: number;
  size?: 'sm' | 'lg';
  plaintext?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string | string[] | number;
  onChange?: React.ChangeEventHandler<FormControlElement>;
  type?: string;
  id?: string;
  isValid?: boolean;
  isInvalid?: boolean;
}

const propTypes = {
  /**
   * @default {'form-control'}
   */
  bsPrefix: string,

  /**
   * The FormControl `ref` will be forwarded to the underlying input element,
   * which means unless `as` is a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,
  /**
   * Input size variants
   *
   * @type {('sm'|'lg')}
   */
  size: string,

  
  htmlSize: number,

  /**
   * The underlying HTML element to use when rendering the FormControl.
   *
   * @type {('input'|'textarea'|elementType)}
   */
  as: elementType,

  
  plaintext: bool,

  
  readOnly: bool,

  
  disabled: bool,

  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
  ]),

  
  onChange: func,

  
  type: string,

  
  id: string,

  
  isValid: bool,

  
  isInvalid: bool,
};

const FormControl: BsPrefixRefForwardingComponent<'input', FormControlProps> =
  React.forwardRef<FormControlElement, FormControlProps>(
    (
      {
        bsPrefix,
        type,
        size,
        htmlSize,
        id,
        className,
        isValid = false,
        isInvalid = false,
        plaintext,
        readOnly,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'input',
        ...props
      },
      ref,
    ) => {
      const { controlId } = useContext(FormContext);

      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-control');

      let classes;
      if (plaintext) {
        classes = { [`${bsPrefix}-plaintext`]: true };
      } else {
        classes = {
          [bsPrefix]: true,
          [`${bsPrefix}-${size}`]: size,
        };
      }

      warning(
        controlId == null || !id,
        '`controlId` is ignored on `<FormControl>` when `id` is specified.',
      );

      return (
        <Component
          {...props}
          type={type}
          size={htmlSize}
          ref={ref}
          readOnly={readOnly}
          id={id || controlId}
          className={classNames(
            className,
            classes,
            isValid && `is-valid`,
            isInvalid && `is-invalid`,
            type === 'color' && `${bsPrefix}-color`,
          )}
        />
      );
    },
  );

FormControl.displayName = 'FormControl';
FormControl.propTypes = propTypes;

export Object.assign(FormControl, { Feedback });


import createWithBsPrefix from './createWithBsPrefix';

export createWithBsPrefix('form-floating');



import * as React from 'react';
import { useMemo } from 'react';

import FormContext from './FormContext';
import { AsProp, BsPrefixRefForwardingComponent } from './helpers';

export interface FormGroupProps
  extends React.HTMLAttributes<HTMLElement>,
    AsProp {
  controlId?: string;
}

const propTypes = {
  as: elementType,

  
  controlId: string,

  /**
   * The FormGroup `ref` will be forwarded to the underlying element.
   * Unless the FormGroup is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,
};

const FormGroup: BsPrefixRefForwardingComponent<'div', FormGroupProps> =
  React.forwardRef(
    (
      {
        controlId,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        ...props
      },
      ref,
    ) => {
      const context = useMemo(() => ({ controlId }), [controlId]);

      return (
        <FormContext.Provider value={context}>
          <Component {...props} ref={ref} />
        </FormContext.Provider>
      );
    },
  );

FormGroup.displayName = 'FormGroup';
FormGroup.propTypes = propTypes;

export FormGroup;

import classNames from 'classnames';

import * as React from 'react';
import { useContext } from 'react';
import warning from 'warning';

import Col, { ColProps } from './Col';
import FormContext from './FormContext';
import { useBootstrapPrefix } from './utils';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

interface FormLabelBaseProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  htmlFor?: string;
  visuallyHidden?: boolean;
}

export interface FormLabelOwnProps extends FormLabelBaseProps {
  column?: false;
}

export interface FormLabelWithColProps extends FormLabelBaseProps, ColProps {
  column: true | 'sm' | 'lg';
}

export type FormLabelProps = FormLabelWithColProps | FormLabelOwnProps;

const propTypes = {
  /**
   * @default 'form-label'
   */
  bsPrefix: string,

  
  htmlFor: string,

  
  column: oneOfType([PropTypes.bool, PropTypes.oneOf(['sm', 'lg'])]),

  /**
   * The FormLabel `ref` will be forwarded to the underlying element.
   * Unless the FormLabel is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,

  
  visuallyHidden: bool,

  
  as: elementType,
};

const defaultProps = {
  column: false,
  visuallyHidden: false,
};

const FormLabel: BsPrefixRefForwardingComponent<'label', FormLabelProps> =
  React.forwardRef<HTMLElement, FormLabelProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'label',
        bsPrefix,
        column,
        visuallyHidden,
        className,
        htmlFor,
        ...props
      },
      ref,
    ) => {
      const { controlId } = useContext(FormContext);

      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-label');

      let columnClass = 'col-form-label';
      if (typeof column === 'string')
        columnClass = `${columnClass} ${columnClass}-${column}`;

      const classes = classNames(
        className,
        bsPrefix,
        visuallyHidden && 'visually-hidden',
        column && columnClass,
      );

      warning(
        controlId == null || !htmlFor,
        '`controlId` is ignored on `<FormLabel>` when `htmlFor` is specified.',
      );
      htmlFor = htmlFor || controlId;

      if (column)
        return (
          <Col as="label" className={classes} htmlFor={htmlFor} {...props} />
        );

      return (
        // eslint-disable-next-line jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control
        <Component ref={ref} className={classes} htmlFor={htmlFor} {...props} />
      );
    },
  );

FormLabel.displayName = 'FormLabel';
FormLabel.propTypes = propTypes;
FormLabel.defaultProps = defaultProps;

export FormLabel;


import classNames from 'classnames';

import * as React from 'react';
import { useBootstrapPrefix } from './utils';
import { BsPrefixOnlyProps } from './helpers';

export interface FormRangeProps
  extends BsPrefixOnlyProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const propTypes = {
  /**
   * @default {'form-range'}
   */
  bsPrefix: string,

  
  disabled: bool,

  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.number,
  ]),

  
  onChange: func,
};

const FormRange = React.forwardRef<HTMLInputElement, FormRangeProps>(
  ({ bsPrefix, className, ...props }, ref) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'form-range');

    return (
      <input
        {...props}
        type="range"
        ref={ref}
        className={classNames(className, bsPrefix)}
      />
    );
  },
);

FormRange.displayName = 'FormRange';
FormRange.propTypes = propTypes;

export FormRange;


import classNames from 'classnames';

import * as React from 'react';
import { useBootstrapPrefix } from './utils';
import { BsPrefixOnlyProps, BsPrefixRefForwardingComponent } from './helpers';

export interface FormSelectProps
  extends BsPrefixOnlyProps,
    React.HTMLAttributes<HTMLSelectElement> {
  htmlSize?: number;
  size?: 'sm' | 'lg';
  isValid?: boolean;
  isInvalid?: boolean;
}

const propTypes = {
  /**
   * @default {'form-select'}
   */
  bsPrefix: string,

  /**
   * Size variants
   *
   * @type {('sm'|'lg')}
   */
  size: string,

  
  htmlSize: number,

  
  disabled: bool,

  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
  ]),

  
  onChange: func,

  
  isValid: bool,

  
  isInvalid: bool,
};

const FormSelect: BsPrefixRefForwardingComponent<'select', FormSelectProps> =
  React.forwardRef<HTMLSelectElement, FormSelectProps>(
    (
      {
        bsPrefix,
        size,
        htmlSize,
        className,
        isValid = false,
        isInvalid = false,
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-select');

      return (
        <select
          {...props}
          size={htmlSize}
          ref={ref}
          className={classNames(
            className,
            bsPrefix,
            size && `${bsPrefix}-${size}`,
            isValid && `is-valid`,
            isInvalid && `is-invalid`,
          )}
        />
      );
    },
  );

FormSelect.displayName = 'FormSelect';
FormSelect.propTypes = propTypes;

export FormSelect;


import classNames from 'classnames';


import * as React from 'react';

import { useBootstrapPrefix } from './utils';

import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface FormTextProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  muted?: boolean;
}

const propTypes = {
  /** @default 'form-text' */
  bsPrefix: string,

  /**
   * The FormText `ref` will be forwarded to the underlying element.
   * Unless the FormText is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: any,

  
  muted: bool,
  as: elementType,
};

const FormText: BsPrefixRefForwardingComponent<'small', FormTextProps> =
  React.forwardRef<HTMLElement, FormTextProps>(
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    (
      { bsPrefix, className, as: Component = 'small', muted, ...props },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-text');

      return (
        <Component
          {...props}
          ref={ref}
          className={classNames(className, bsPrefix, muted && 'text-muted')}
        />
      );
    },
  );

FormText.displayName = 'FormText';
FormText.propTypes = propTypes;

export FormText;

import * as React from 'react';
import FormCheck, { FormCheckProps } from './FormCheck';
import { BsPrefixRefForwardingComponent } from './helpers';

type SwitchProps = Omit<FormCheckProps, 'type'>;

const Switch: BsPrefixRefForwardingComponent<typeof FormCheck, SwitchProps> =
  React.forwardRef<typeof FormCheck, SwitchProps>((props, ref) => (
    <FormCheck {...props} ref={ref} type="switch" />
  ));

Switch.displayName = 'Switch';

export Object.assign(Switch, {
  Input: FormCheck.Input,
  Label: FormCheck.Label,
});


import classNames from 'classnames';


import * as React from 'react';
import { useMemo } from 'react';

import createWithBsPrefix from './createWithBsPrefix';
import { useBootstrapPrefix } from './utils';
import FormCheckInput from './FormCheckInput';
import InputGroupContext from './InputGroupContext';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

const InputGroupText = createWithBsPrefix('input-group-text', {
  Component: 'span',
});

const InputGroupCheckbox = (props) => (
  <InputGroupText>
    <FormCheckInput type="checkbox" {...props} />
  </InputGroupText>
);

const InputGroupRadio = (props) => (
  <InputGroupText>
    <FormCheckInput type="radio" {...props} />
  </InputGroupText>
);

export interface InputGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'lg';
  hasValidation?: boolean;
}

const propTypes = {
  /** @default 'input-group' */
  bsPrefix: string,

  /**
   * Control the size of buttons and form elements from the top-level.
   *
   * @type {('sm'|'lg')}
   */
  size: string,

  
  hasValidation: bool,

  as: elementType,
};

/**
 *
 * @property {InputGroupText} Text
 * @property {InputGroupRadio} Radio
 * @property {InputGroupCheckbox} Checkbox
 */
const InputGroup: BsPrefixRefForwardingComponent<'div', InputGroupProps> =
  React.forwardRef<HTMLElement, InputGroupProps>(
    (
      {
        bsPrefix,
        size,
        hasValidation,
        className,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group');

      // Intentionally an empty object. Used in detecting if a dropdown
      // exists under an input group.
      const contextValue = useMemo(() => ({}), []);

      return (
        <InputGroupContext.Provider value={contextValue}>
          <Component
            ref={ref}
            {...props}
            className={classNames(
              className,
              bsPrefix,
              size && `${bsPrefix}-${size}`,
              hasValidation && 'has-validation',
            )}
          />
        </InputGroupContext.Provider>
      );
    },
  );

InputGroup.propTypes = propTypes;
InputGroup.displayName = 'InputGroup';

export Object.assign(InputGroup, {
  Text: InputGroupText,
  Radio: InputGroupRadio,
  Checkbox: InputGroupCheckbox,
});

import * as React from 'react';

const context = React.createContext<unknown | null>(null);
context.displayName = 'InputGroupContext';

export context;


import classNames from 'classnames';
import * as React from 'react';

import { AsProp, BsPrefixRefForwardingComponent } from './helpers';

export interface FeedbackProps
  extends AsProp,
    React.HTMLAttributes<HTMLElement> {
  // I think this is because we use BsPrefixRefForwardingComponent below
  // which includes bsPrefix.
  bsPrefix?: never;
  type?: 'valid' | 'invalid';
  tooltip?: boolean;
}

const propTypes = {
  /**
   * Specify whether the feedback is for valid or invalid fields
   *
   * @type {('valid'|'invalid')}
   */
  type: string,

  
  tooltip: bool,

  as: elementType,
};

const Feedback: BsPrefixRefForwardingComponent<'div', FeedbackProps> =
  React.forwardRef(
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    (
      {
        as: Component = 'div',
        className,
        type = 'valid',
        tooltip = false,
        ...props
      },
      ref,
    ) => (
      <Component
        {...props}
        ref={ref}
        className={classNames(
          className,
          `${type}-${tooltip ? 'tooltip' : 'feedback'}`,
        )}
      />
    ),
  );

Feedback.displayName = 'Feedback';
Feedback.propTypes = propTypes;

export Feedback;

import classNames from 'classnames';

import * as React from 'react';

import FormGroup, { FormGroupProps } from './FormGroup';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
import { useBootstrapPrefix } from './utils';

export interface FloatingLabelProps extends FormGroupProps, BsPrefixProps {
  controlId?: string;
  label: React.ReactNode;
}

const propTypes = {
  as: elementType,

  
  controlId: string,

  
  label: node.isRequired,
};

const FloatingLabel: BsPrefixRefForwardingComponent<'div', FloatingLabelProps> =
  React.forwardRef(
    ({ bsPrefix, className, children, controlId, label, ...props }, ref) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'form-floating');

      return (
        <FormGroup
          ref={ref}
          className={classNames(className, bsPrefix)}
          controlId={controlId}
          {...props}
        >
          {children}
          <label htmlFor={controlId}>{label}</label>
        </FormGroup>
      );
    },
  );

FloatingLabel.displayName = 'FloatingLabel';
FloatingLabel.propTypes = propTypes;

export FloatingLabel;
