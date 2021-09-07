import classNames from "classnames"
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
  bsPrefix?: string,
  type: PropTypes.oneOf<ToggleButtonType>(["checkbox", "radio"]),
  name?: string,
  checked?: boolean,
  disabled?: boolean,
  id: string,
  onChange?: () => void,
  value: 
    string |
    string[] |
    number,
  inputRef?: () => void | any,
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
  name?: string,
  value?: any,
  onChange?: () => void,
  type: "checkbox" | "radio",
  size?: string,

  vertical?: boolean,
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
