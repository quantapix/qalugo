import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import FormCheck from "./FormCheck"
import FormControl from "./FormControl"
import FormFloating from "./FormFloating"
import FormGroup from "./FormGroup"
import FormLabel from "./FormLabel"
import FormRange from "./FormRange"
import FormSelect from "./FormSelect"
import FormText from "./FormText"
import Switch from "./Switch"
import FloatingLabel from "./FloatingLabel"
import { BsPrefixRefForwardingComponent, AsProp } from "./helpers"
export interface FormProps
  extends React.FormHTMLAttributes<HTMLFormElement>,
    AsProp {
  validated?: boolean
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
  _ref: PropTypes.any,
  /**
   * Mark a form as having been validated. Setting it to `true` will
   * toggle any validation styles on the forms elements.
   */
  validated: PropTypes.bool,
  as: PropTypes.elementType,
}
const Form: BsPrefixRefForwardingComponent<"form", FormProps> =
  React.forwardRef<HTMLFormElement, FormProps>(
    (
      {
        className,
        validated,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = "form",
        ...props
      },
      ref
    ) => (
      <Component
        {...props}
        ref={ref}
        className={classNames(className, validated && "was-validated")}
      />
    )
  )
Form.displayName = "Form"
Form.propTypes = propTypes as any
export default Object.assign(Form, {
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
})
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext, useMemo } from "react"
import Feedback, { FeedbackType } from "./Feedback"
import FormCheckInput from "./FormCheckInput"
import FormCheckLabel from "./FormCheckLabel"
import FormContext from "./FormContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export type FormCheckType = "checkbox" | "radio" | "switch"
export interface FormCheckProps
  extends BsPrefixProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  inline?: boolean
  disabled?: boolean
  label?: React.ReactNode
  type?: FormCheckType
  isValid?: boolean
  isInvalid?: boolean
  feedbackTooltip?: boolean
  feedback?: React.ReactNode
  feedbackType?: FeedbackType
  bsSwitchPrefix?: string
}
const propTypes = {
  /**
   * @default 'form-check'
   */
  bsPrefix: PropTypes.string,
  /**
   * bsPrefix override for the base switch class.
   *
   * @default 'form-switch'
   */
  bsSwitchPrefix: PropTypes.string,
  /**
   * The FormCheck `ref` will be forwarded to the underlying input element,
   * which means it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
  /**
   * The underlying HTML element to use when rendering the FormCheck.
   *
   * @type {('input'|elementType)}
   */
  as: PropTypes.elementType,
  /**
   * A HTML id attribute, necessary for proper form accessibility.
   * An id is recommended for allowing label clicks to toggle the check control.
   *
   * This is **required** when `type="switch"` due to how they are rendered.
   */
  id: PropTypes.string,
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
  children: PropTypes.node,
  /**
   * Groups controls horizontally with other `FormCheck`s.
   */
  inline: PropTypes.bool,
  /**
   * Disables the control.
   */
  disabled: PropTypes.bool,
  /**
   * `title` attribute for the underlying `FormCheckLabel`.
   */
  title: PropTypes.string,
  /**
   * Label for the control.
   */
  label: PropTypes.node,
  /**
   * The type of checkable.
   * @type {('radio' | 'checkbox' | 'switch')}
   */
  type: PropTypes.oneOf(["radio", "checkbox", "switch"]),
  /** Manually style the input as valid */
  isValid: PropTypes.bool,
  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,
  /** Display feedback as a tooltip. */
  feedbackTooltip: PropTypes.bool,
  /** A message to display when the input is in a validation state */
  feedback: PropTypes.node,
}
const FormCheck: BsPrefixRefForwardingComponent<"input", FormCheckProps> =
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
        feedbackType,
        className,
        style,
        title = "",
        type = "checkbox",
        label,
        children,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as = "input",
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "form-check")
      bsSwitchPrefix = useBootstrapPrefix(bsSwitchPrefix, "form-switch")
      const { controlId } = useContext(FormContext)
      const innerFormContext = useMemo(
        () => ({
          controlId: id || controlId,
        }),
        [controlId, id]
      )
      const hasLabel = label != null && label !== false && !children
      const input = (
        <FormCheckInput
          {...props}
          type={type === "switch" ? "checkbox" : type}
          ref={ref}
          isValid={isValid}
          isInvalid={isInvalid}
          disabled={disabled}
          as={as}
        />
      )
      return (
        <FormContext.Provider value={innerFormContext}>
          <div
            style={style}
            className={classNames(
              className,
              label && bsPrefix,
              inline && `${bsPrefix}-inline`,
              type === "switch" && bsSwitchPrefix
            )}
          >
            {children || (
              <>
                {input}
                {hasLabel && (
                  <FormCheckLabel title={title}>{label}</FormCheckLabel>
                )}
                {feedback && (
                  <Feedback type={feedbackType} tooltip={feedbackTooltip}>
                    {feedback}
                  </Feedback>
                )}
              </>
            )}
          </div>
        </FormContext.Provider>
      )
    }
  )
FormCheck.displayName = "FormCheck"
FormCheck.propTypes = propTypes
export default Object.assign(FormCheck, {
  Input: FormCheckInput,
  Label: FormCheckLabel,
})
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import FormContext from "./FormContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
type FormCheckInputType = "checkbox" | "radio"
export interface FormCheckInputProps
  extends BsPrefixProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  type?: FormCheckInputType
  isValid?: boolean
  isInvalid?: boolean
}
const propTypes = {
  /**
   * @default 'form-check-input'
   */
  bsPrefix: PropTypes.string,
  /**
   * The underlying HTML element to use when rendering the FormCheckInput.
   *
   * @type {('input'|elementType)}
   */
  as: PropTypes.elementType,
  /** A HTML id attribute, necessary for proper form accessibility. */
  id: PropTypes.string,
  /** The type of checkable. */
  type: PropTypes.oneOf(["radio", "checkbox"]).isRequired,
  /** Manually style the input as valid */
  isValid: PropTypes.bool,
  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,
}
const FormCheckInput: BsPrefixRefForwardingComponent<
  "input",
  FormCheckInputProps
> = React.forwardRef<HTMLInputElement, FormCheckInputProps>(
  (
    {
      id,
      bsPrefix,
      className,
      type = "checkbox",
      isValid = false,
      isInvalid = false,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "input",
      ...props
    },
    ref
  ) => {
    const { controlId } = useContext(FormContext)
    bsPrefix = useBootstrapPrefix(bsPrefix, "form-check-input")
    return (
      <Component
        {...props}
        ref={ref}
        type={type}
        id={id || controlId}
        className={classNames(
          className,
          bsPrefix,
          isValid && "is-valid",
          isInvalid && "is-invalid"
        )}
      />
    )
  }
)
FormCheckInput.displayName = "FormCheckInput"
FormCheckInput.propTypes = propTypes
export default FormCheckInput
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import FormContext from "./FormContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps } from "./helpers"
export interface FormCheckLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    BsPrefixProps {}
const propTypes = {
  /**
   * @default 'form-check-label'
   */
  bsPrefix: PropTypes.string,
  /** The HTML for attribute for associating the label with an input */
  htmlFor: PropTypes.string,
}
const FormCheckLabel = React.forwardRef<HTMLLabelElement, FormCheckLabelProps>(
  ({ bsPrefix, className, htmlFor, ...props }, ref) => {
    const { controlId } = useContext(FormContext)
    bsPrefix = useBootstrapPrefix(bsPrefix, "form-check-label")
    return (
      <label // eslint-disable-line jsx-a11y/label-has-associated-control
        {...props}
        ref={ref}
        htmlFor={htmlFor || controlId}
        className={classNames(className, bsPrefix)}
      />
    )
  }
)
FormCheckLabel.displayName = "FormCheckLabel"
FormCheckLabel.propTypes = propTypes
export default FormCheckLabel
import * as React from "react"
// TODO
interface FormContextType {
  controlId?: any
}
const FormContext = React.createContext<FormContextType>({})
export default FormContext
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import warning from "warning"
import Feedback from "./Feedback"
import FormContext from "./FormContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
type FormControlElement = HTMLInputElement | HTMLTextAreaElement
export interface FormControlProps
  extends BsPrefixProps,
    React.HTMLAttributes<FormControlElement> {
  htmlSize?: number
  size?: "sm" | "lg"
  plaintext?: boolean
  readOnly?: boolean
  disabled?: boolean
  value?: string | string[] | number
  onChange?: React.ChangeEventHandler<FormControlElement>
  type?: string
  isValid?: boolean
  isInvalid?: boolean
}
const propTypes = {
  /**
   * @default {'form-control'}
   */
  bsPrefix: PropTypes.string,
  /**
   * The FormControl `ref` will be forwarded to the underlying input element,
   * which means unless `as` is a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
  /**
   * Input size variants
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,
  /**
   * The size attribute of the underlying HTML element.
   * Specifies the visible width in characters if `as` is `'input'`.
   */
  htmlSize: PropTypes.number,
  /**
   * The underlying HTML element to use when rendering the FormControl.
   *
   * @type {('input'|'textarea'|elementType)}
   */
  as: PropTypes.elementType,
  /**
   * Render the input as plain text. Generally used along side `readOnly`.
   */
  plaintext: PropTypes.bool,
  /** Make the control readonly */
  readOnly: PropTypes.bool,
  /** Make the control disabled */
  disabled: PropTypes.bool,
  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
  ]),
  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,
  /**
   * The HTML input `type`, which is only relevant if `as` is `'input'` (the default).
   */
  type: PropTypes.string,
  /**
   * Uses `controlId` from `<FormGroup>` if not explicitly specified.
   */
  id: PropTypes.string,
  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,
  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,
}
const FormControl: BsPrefixRefForwardingComponent<"input", FormControlProps> =
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
        as: Component = "input",
        ...props
      },
      ref
    ) => {
      const { controlId } = useContext(FormContext)
      bsPrefix = useBootstrapPrefix(bsPrefix, "form-control")
      let classes
      if (plaintext) {
        classes = { [`${bsPrefix}-plaintext`]: true }
      } else {
        classes = {
          [bsPrefix]: true,
          [`${bsPrefix}-${size}`]: size,
        }
      }
      warning(
        controlId == null || !id,
        "`controlId` is ignored on `<FormControl>` when `id` is specified."
      )
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
            type === "color" && `${bsPrefix}-color`
          )}
        />
      )
    }
  )
FormControl.displayName = "FormControl"
FormControl.propTypes = propTypes
export default Object.assign(FormControl, { Feedback })
import createWithBsPrefix from "./createWithBsPrefix"
export default createWithBsPrefix("form-floating")
import PropTypes from "prop-types"
import * as React from "react"
import { useMemo } from "react"
import FormContext from "./FormContext"
import { AsProp, BsPrefixRefForwardingComponent } from "./helpers"
export interface FormGroupProps
  extends React.HTMLAttributes<HTMLElement>,
    AsProp {
  controlId?: string
}
const propTypes = {
  as: PropTypes.elementType,
  /**
   * Sets `id` on `<FormControl>` and `htmlFor` on `<FormGroup.Label>`.
   */
  controlId: PropTypes.string,
  /**
   * The FormGroup `ref` will be forwarded to the underlying element.
   * Unless the FormGroup is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
}
const FormGroup: BsPrefixRefForwardingComponent<"div", FormGroupProps> =
  React.forwardRef(
    (
      {
        controlId,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = "div",
        ...props
      },
      ref
    ) => {
      const context = useMemo(() => ({ controlId }), [controlId])
      return (
        <FormContext.Provider value={context}>
          <Component {...props} ref={ref} />
        </FormContext.Provider>
      )
    }
  )
FormGroup.displayName = "FormGroup"
FormGroup.propTypes = propTypes
export default FormGroup
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import warning from "warning"
import Col, { ColProps } from "./Col"
import FormContext from "./FormContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
interface FormLabelBaseProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  htmlFor?: string
  visuallyHidden?: boolean
}
export interface FormLabelOwnProps extends FormLabelBaseProps {
  column?: false
}
export interface FormLabelWithColProps extends FormLabelBaseProps, ColProps {
  column: true | "sm" | "lg"
}
export type FormLabelProps = FormLabelWithColProps | FormLabelOwnProps
const propTypes = {
  /**
   * @default 'form-label'
   */
  bsPrefix: PropTypes.string,
  /**
   * Uses `controlId` from `<FormGroup>` if not explicitly specified.
   */
  htmlFor: PropTypes.string,
  /**
   * Renders the FormLabel as a `<Col>` component (accepting all the same props),
   * as well as adding additional styling for horizontal forms.
   */
  column: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["sm", "lg"])]),
  /**
   * The FormLabel `ref` will be forwarded to the underlying element.
   * Unless the FormLabel is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
  /**
   * Hides the label visually while still allowing it to be
   * read by assistive technologies.
   */
  visuallyHidden: PropTypes.bool,
  /** Set a custom element for this component */
  as: PropTypes.elementType,
}
const defaultProps = {
  column: false,
  visuallyHidden: false,
}
const FormLabel: BsPrefixRefForwardingComponent<"label", FormLabelProps> =
  React.forwardRef<HTMLElement, FormLabelProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = "label",
        bsPrefix,
        column,
        visuallyHidden,
        className,
        htmlFor,
        ...props
      },
      ref
    ) => {
      const { controlId } = useContext(FormContext)
      bsPrefix = useBootstrapPrefix(bsPrefix, "form-label")
      let columnClass = "col-form-label"
      if (typeof column === "string")
        columnClass = `${columnClass} ${columnClass}-${column}`
      const classes = classNames(
        className,
        bsPrefix,
        visuallyHidden && "visually-hidden",
        column && columnClass
      )
      warning(
        controlId == null || !htmlFor,
        "`controlId` is ignored on `<FormLabel>` when `htmlFor` is specified."
      )
      htmlFor = htmlFor || controlId
      if (column)
        return (
          <Col
            ref={ref as React.ForwardedRef<HTMLLabelElement>}
            as="label"
            className={classes}
            htmlFor={htmlFor}
            {...props}
          />
        )
      return (
        // eslint-disable-next-line jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control
        <Component ref={ref} className={classes} htmlFor={htmlFor} {...props} />
      )
    }
  )
FormLabel.displayName = "FormLabel"
FormLabel.propTypes = propTypes
FormLabel.defaultProps = defaultProps
export default FormLabel
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixOnlyProps } from "./helpers"
import FormContext from "./FormContext"
export interface FormRangeProps
  extends BsPrefixOnlyProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
const propTypes = {
  /**
   * @default {'form-range'}
   */
  bsPrefix: PropTypes.string,
  /** Make the control disabled */
  disabled: PropTypes.bool,
  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.number,
  ]),
  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,
  /**
   * Uses `controlId` from `<FormGroup>` if not explicitly specified.
   */
  id: PropTypes.string,
}
const FormRange = React.forwardRef<HTMLInputElement, FormRangeProps>(
  ({ bsPrefix, className, id, ...props }, ref) => {
    const { controlId } = useContext(FormContext)
    bsPrefix = useBootstrapPrefix(bsPrefix, "form-range")
    return (
      <input
        {...props}
        type="range"
        ref={ref}
        className={classNames(className, bsPrefix)}
        id={id || controlId}
      />
    )
  }
)
FormRange.displayName = "FormRange"
FormRange.propTypes = propTypes
export default FormRange
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixOnlyProps, BsPrefixRefForwardingComponent } from "./helpers"
import FormContext from "./FormContext"
export interface FormSelectProps
  extends BsPrefixOnlyProps,
    React.HTMLAttributes<HTMLSelectElement> {
  htmlSize?: number
  size?: "sm" | "lg"
  isValid?: boolean
  isInvalid?: boolean
}
const propTypes = {
  /**
   * @default {'form-select'}
   */
  bsPrefix: PropTypes.string,
  /**
   * Size variants
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,
  /**
   * The size attribute of the underlying HTML element.
   * Specifies the number of visible options.
   */
  htmlSize: PropTypes.number,
  /** Make the control disabled */
  disabled: PropTypes.bool,
  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
  ]),
  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,
  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,
  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,
}
const FormSelect: BsPrefixRefForwardingComponent<"select", FormSelectProps> =
  React.forwardRef<HTMLSelectElement, FormSelectProps>(
    (
      {
        bsPrefix,
        size,
        htmlSize,
        className,
        isValid = false,
        isInvalid = false,
        id,
        ...props
      },
      ref
    ) => {
      const { controlId } = useContext(FormContext)
      bsPrefix = useBootstrapPrefix(bsPrefix, "form-select")
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
            isInvalid && `is-invalid`
          )}
          id={id || controlId}
        />
      )
    }
  )
FormSelect.displayName = "FormSelect"
FormSelect.propTypes = propTypes
export default FormSelect
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface FormTextProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  muted?: boolean
}
const propTypes = {
  /** @default 'form-text' */
  bsPrefix: PropTypes.string,
  /**
   * The FormText `ref` will be forwarded to the underlying element.
   * Unless the FormText is rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
  /**
   * A convenience prop for add the `text-muted` class,
   * since it's so commonly used here.
   */
  muted: PropTypes.bool,
  as: PropTypes.elementType,
}
const FormText: BsPrefixRefForwardingComponent<"small", FormTextProps> =
  React.forwardRef<HTMLElement, FormTextProps>(
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    (
      { bsPrefix, className, as: Component = "small", muted, ...props },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "form-text")
      return (
        <Component
          {...props}
          ref={ref}
          className={classNames(className, bsPrefix, muted && "text-muted")}
        />
      )
    }
  )
FormText.displayName = "FormText"
FormText.propTypes = propTypes
export default FormText
