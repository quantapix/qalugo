import * as React from "react"
import { ButtonType } from "@restart/ui/Button"
import Button from "./Button"
import ButtonGroup from "./ButtonGroup"
import Dropdown, { DropdownProps } from "./Dropdown"
import { PropsFromToggle } from "./DropdownToggle"
import { BsPrefixProps } from "./utils"
import { alignPropType } from "./types"
export interface SplitButtonProps
  extends Omit<DropdownProps, "title">,
    PropsFromToggle,
    BsPrefixProps {
  menuRole?: string
  renderMenuOnMount?: boolean
  rootCloseEvent?: "click" | "mousedown"
  target?: string
  title: React.ReactNode
  toggleLabel?: string
  type?: ButtonType
}
const propTypes = {
  id?: string,
  toggleLabel?: string,
  href?: string,
  target?: string,
  onClick?: () => void,
  title: React.ReactNode,
  type?: string,
  disabled?: boolean,
  /**
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,
  menuRole?: string,
  renderMenuOnMount?: boolean,
  rootCloseEvent?: string,
  bsPrefix?: string,
  variant?: string,
  size?: string,
}
const defaultProps: Partial<SplitButtonProps> = {
  toggleLabel: "Toggle dropdown",
  type: "button",
}
export const SplitButton = React.forwardRef<HTMLElement, SplitButtonProps>(
  (
    {
      id,
      bsPrefix,
      size,
      variant,
      title,
      type,
      toggleLabel,
      children,
      onClick,
      href,
      target,
      menuRole,
      renderMenuOnMount,
      rootCloseEvent,
      ...ps
    },
    ref
  ) => (
    <Dropdown ref={ref} {...ps} as={ButtonGroup}>
      <Button
        size={size}
        variant={variant}
        disabled={ps.disabled}
        bsPrefix={bsPrefix}
        href={href}
        target={target}
        onClick={onClick}
        type={type}
      >
        {title}
      </Button>
      <Dropdown.Toggle
        split
        id={id}
        size={size}
        variant={variant}
        disabled={ps.disabled}
        childBsPrefix={bsPrefix}
      >
        <span className="visually-hidden">{toggleLabel}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
      >
        {children}
      </Dropdown.Menu>
    </Dropdown>
  )
)
SplitButton.propTypes = propTypes as any
SplitButton.defaultProps = defaultProps
SplitButton.displayName = "SplitButton"
export default SplitButton
