import classNames from "classnames"
import * as React from "react"
import { useMemo } from "react"
import createWithBsPrefix from "./createWithBsPrefix"
import { useBootstrapPrefix } from "./ThemeProvider"
import FormCheckInput from "./FormCheckInput"
import InputGroupContext from "./InputGroupContext"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
const InputGroupText = createWithBsPrefix("input-group-text", {
  Component: "span",
})
const InputGroupCheckbox = props => (
  <InputGroupText>
    <FormCheckInput type="checkbox" {...props} />
  </InputGroupText>
)
const InputGroupRadio = props => (
  <InputGroupText>
    <FormCheckInput type="radio" {...props} />
  </InputGroupText>
)
export interface InputGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "lg"
  hasValidation?: boolean
}
const propTypes = {

  bsPrefix?: string,
  size?: string,
  hasValidation?: boolean,
  as?: React.elementType,
}
const InputGroup: BsPrefixRefForwardingComponent<"div", InputGroupProps> =
  React.forwardRef<HTMLElement, InputGroupProps>(
    (
      {
        bsPrefix,
        size,
        hasValidation,
        className,
        as: Component = "div",
        ...props
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, "input-group")
      const contextValue = useMemo(() => ({}), [])
      return (
        <InputGroupContext.Provider value={contextValue}>
          <Component
            ref={ref}
            {...props}
            className={classNames(
              className,
              bsPrefix,
              size && `${bsPrefix}-${size}`,
              hasValidation && "has-validation"
            )}
          />
        </InputGroupContext.Provider>
      )
    }
  )
InputGroup.propTypes = propTypes
InputGroup.displayName = "InputGroup"
export default Object.assign(InputGroup, {
  Text: InputGroupText,
  Radio: InputGroupRadio,
  Checkbox: InputGroupCheckbox,
})
import * as React from "react"
const context = React.createContext<unknown | null>(null)
context.displayName = "InputGroupContext"
export default context
