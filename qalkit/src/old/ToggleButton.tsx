import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useBootstrapPrefix } from "./ThemeProvider"
import Button, { ButtonProps } from "./Button"
export type ToggleButtonType = "checkbox" | "radio"
export interface ToggleButtonProps
  extends Omit<ButtonProps, "onChange" | "type"> {
  type?: ToggleButtonType
  name?: string
  checked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string | ReadonlyArray<string> | number
  inputRef?: React.Ref<HTMLInputElement>
}
const noop = () => undefined
const propTypes = {
  /**
   * @default 'btn-check'
   */
  bsPrefix: PropTypes.string,
  /**
   * The `<input>` element `type`
   */
  type: PropTypes.oneOf<ToggleButtonType>(["checkbox", "radio"]),
  /**
   * The HTML input name, used to group like checkboxes or radio buttons together
   * semantically
   */
  name: PropTypes.string,
  /**
   * The checked state of the input, managed by `<ToggleButtonGroup>` automatically
   */
  checked: PropTypes.bool,
  /**
   * The disabled state of both the label and input
   */
  disabled: PropTypes.bool,
  /**
   * `id` is required for button clicks to toggle input.
   */
  id: PropTypes.string.isRequired,
  /**
   * A callback fired when the underlying input element changes. This is passed
   * directly to the `<input>` so shares the same signature as a native `onChange` event.
   */
  onChange: PropTypes.func,
  /**
   * The value of the input, should be unique amongst it's siblings when nested in a
   * `ToggleButtonGroup`.
   */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.number,
  ]).isRequired,
  /**
   * A ref attached to the `<input>` element
   * @type {ReactRef}
   */
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
}
const ToggleButton = React.forwardRef<HTMLLabelElement, ToggleButtonProps>(
  (
    {
      bsPrefix,
      name,
      className,
      checked,
      type,
      onChange,
      value,
      disabled,
      id,
      inputRef,
      ...props
    },
    ref
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, "btn-check")
    return (
      <>
        <input
          className={bsPrefix}
          name={name}
          type={type}
          value={value}
          ref={inputRef}
          autoComplete="off"
          checked={!!checked}
          disabled={!!disabled}
          onChange={onChange || noop}
          id={id}
        />
        <Button
          {...props}
          ref={ref}
          className={classNames(className, disabled && "disabled")}
          type={undefined}
          as="label"
          htmlFor={id}
        />
      </>
    )
  }
)
ToggleButton.propTypes = propTypes
ToggleButton.displayName = "ToggleButton"
export default ToggleButton
import PropTypes from "prop-types"
import * as React from "react"
import invariant from "invariant"
import { useUncontrolled } from "uncontrollable"
import chainFunction from "./utils"
import { map } from "./ElementChildren"
import ButtonGroup, { ButtonGroupProps } from "./ButtonGroup"
import ToggleButton from "./ToggleButton"
import { BsPrefixRefForwardingComponent } from "./helpers"
type BaseToggleButtonProps = Omit<
  ButtonGroupProps,
  "toggle" | "defaultValue" | "onChange"
>
export interface ToggleButtonRadioProps<T> extends BaseToggleButtonProps {
  type?: "radio"
  name: string
  value?: T
  defaultValue?: T
  onChange?: (value: T, event: any) => void
}
export interface ToggleButtonCheckboxProps<T> extends BaseToggleButtonProps {
  type: "checkbox"
  name?: string
  value?: T[]
  defaultValue?: T[]
  onChange?: (value: T[]) => void
}
export type ToggleButtonGroupProps<T> =
  | ToggleButtonRadioProps<T>
  | ToggleButtonCheckboxProps<T>
const propTypes = {
  /**
   * An HTML `<input>` name for each child button.
   *
   * __Required if `type` is set to `'radio'`__
   */
  name: PropTypes.string,
  /**
   * The value, or array of values, of the active (pressed) buttons
   *
   * @controllable onChange
   */
  value: PropTypes.any,
  /**
   * Callback fired when a button is pressed, depending on whether the `type`
   * is `'radio'` or `'checkbox'`, `onChange` will be called with the value or
   * array of active values
   *
   * @controllable value
   */
  onChange: PropTypes.func,
  /**
   * The input `type` of the rendered buttons, determines the toggle behavior
   * of the buttons
   */
  type: PropTypes.oneOf(["checkbox", "radio"]).isRequired,
  /**
   * Sets the size for all Buttons in the group.
   *
   * @type ('sm'|'lg')
   */
  size: PropTypes.string,
  /** Make the set of Buttons appear vertically stacked. */
  vertical: PropTypes.bool,
}
const defaultProps = {
  type: "radio",
  vertical: false,
}
const ToggleButtonGroup: BsPrefixRefForwardingComponent<
  "a",
  ToggleButtonGroupProps<any>
> = React.forwardRef<HTMLElement, ToggleButtonGroupProps<any>>((props, ref) => {
  const { children, type, name, value, onChange, ...controlledProps } =
    useUncontrolled(props, {
      value: "onChange",
    })
  const getValues: () => any[] = () => (value == null ? [] : [].concat(value))
  const handleToggle = (inputVal: any, event: any) => {
    if (!onChange) {
      return
    }
    const values = getValues()
    const isActive = values.indexOf(inputVal) !== -1
    if (type === "radio") {
      if (!isActive && onChange) onChange(inputVal, event)
      return
    }
    if (isActive) {
      onChange(
        values.filter(n => n !== inputVal),
        event
      )
    } else {
      onChange([...values, inputVal], event)
    }
  }
  invariant(
    type !== "radio" || !!name,
    "A `name` is required to group the toggle buttons when the `type` " +
      'is set to "radio"'
  )
  return (
    <ButtonGroup {...controlledProps} ref={ref as any}>
      {map(children, child => {
        const values = getValues()
        const { value: childVal, onChange: childOnChange } = child.props
        const handler = e => handleToggle(childVal, e)
        return React.cloneElement(child, {
          type,
          name: (child as any).name || name,
          checked: values.indexOf(childVal) !== -1,
          onChange: chainFunction(childOnChange, handler),
        })
      })}
    </ButtonGroup>
  )
})
ToggleButtonGroup.propTypes = propTypes
ToggleButtonGroup.defaultProps = defaultProps as any
export default Object.assign(ToggleButtonGroup, {
  Button: ToggleButton,
})
