import classNames from "classnames"
import * as React from "react"
import { useBootstrapPrefix } from "./utils"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import invariant from "invariant"
import { useUncontrolled } from "uncontrollable"
import { chainFunction } from "./functions"
import { map } from "./utils"
import {ToggleButton} from "./buttons"
export interface ButtonGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "lg"
  vertical?: boolean
}
const propTypes = {
  /**
   * @default 'btn-group'
   */
  bsPrefix: string,
  /**
   * @type ('sm'|'lg')
   */
  size: string,
  vertical: bool,
  role: string,
  as: elementType,
}
const defaultProps = {
  vertical: false,
  role: "group",
}
export const ButtonGroup: BsPrefixRefForwardingComponent<
  "div",
  ButtonGroupProps
> = React.forwardRef(
  (
    {
      bsPrefix,
      size,
      vertical,
      className,
      as: Component = "div",
      ...rest
    }: ButtonGroupProps,
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "btn-group")
    let baseClass = prefix
    if (vertical) baseClass = `${prefix}-vertical`
    return (
      <Component
        {...rest}
        ref={ref}
        className={classNames(
          className,
          baseClass,
          size && `${prefix}-${size}`
        )}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"
ButtonGroup.propTypes = propTypes
ButtonGroup.defaultProps = defaultProps
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
  name: string,
  /**
   * @controllable onChange
   */
  value: any,
  /**
   * @controllable value
   */
  onChange: func,
  type: oneOf(["checkbox", "radio"]).isRequired,
  /**
   * @type ('sm'|'lg')
   */
  size: string,
  vertical: bool,
}
const defaultProps = {
  type: "radio",
  vertical: false,
}
export const ToggleButtonGroup: BsPrefixRefForwardingComponent<
  "a",
  ToggleButtonGroupProps<any>
> = React.forwardRef<HTMLElement, ToggleButtonGroupProps<any>>((props, ref) => {
  const {
    children,
    type,
    name,
    value,
    onChange,
    ...controlledProps
  } = useUncontrolled(props, {
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
Object.assign(ToggleButtonGroup, {
  Button: ToggleButton,
})
