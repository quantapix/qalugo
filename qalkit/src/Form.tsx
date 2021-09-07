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
  _ref: PropTypes.any,
  validated?: boolean,
  as: PropTypes.elementType,
}
const Form: BsPrefixRefForwardingComponent<"form", FormProps> =
  React.forwardRef<HTMLFormElement, FormProps>(
    (
      {
        className,
        validated,
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
  bsPrefix?: string,
  bsSwitchPrefix?: string,
  _ref: PropTypes.any,
  as: PropTypes.elementType,
  id?: string,
  children?: React.ReactNode,
  inline?: boolean,
  disabled?: boolean,
  title?: string,
  label?: React.ReactNode,
  type?: "radio" | "checkbox" | "switch",

  isValid?: boolean,

  isInvalid?: boolean,

  feedbackTooltip?: boolean,

  feedback?: React.ReactNode,
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
  bsPrefix?: string,
  as: PropTypes.elementType,

  id?: string,

  type: "radio" | "checkbox",

  isValid?: boolean,

  isInvalid?: boolean,
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
  bsPrefix?: string,

  htmlFor?: string,
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
  bsPrefix?: string,
  _ref: PropTypes.any,
  size?: string,
  htmlSize?: number,
  as: PropTypes.elementType,
  plaintext?: boolean,

  readOnly?: boolean,

  disabled?: boolean,
  value?:
    string |
    string[] |
    number,
  onChange?: () => void,
  type?: string,
  id?: string,

  isValid?: boolean,

  isInvalid?: boolean,
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
  controlId?: string,
  _ref: PropTypes.any,
}
const FormGroup: BsPrefixRefForwardingComponent<"div", FormGroupProps> =
  React.forwardRef(
    (
      {
        controlId,
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
  bsPrefix?: string,
  htmlFor?: string,
  column?: boolean | "sm" | "lg",
  _ref?: any,
  visuallyHidden?: boolean,

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
  bsPrefix?: string,

  disabled?: boolean,
  value?:
    string |
    string[] |
    number,
  onChange?: () => void,
  id?: string,
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
  bsPrefix?: string,
  size?: string,
  htmlSize?: number,

  disabled?: boolean,
  value?:
    string |
    string[] |
    number,
  onChange?: () => void,

  isValid?: boolean,

  isInvalid?: boolean,
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

  bsPrefix?: string,
  _ref: PropTypes.any,
  muted?: boolean,
  as: PropTypes.elementType,
}
const FormText: BsPrefixRefForwardingComponent<"small", FormTextProps> =
  React.forwardRef<HTMLElement, FormTextProps>(
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
