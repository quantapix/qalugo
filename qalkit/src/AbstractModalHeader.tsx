import * as React from "react"
import { useContext } from "react"
import useEventCallback from "@restart/hooks/useEventCallback"
import CloseButton, { CloseButtonVariant } from "./CloseButton"
import { ModalContext } from "./Modal"
export interface AbstractModalHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  closeLabel?: string
  closeVariant?: CloseButtonVariant
  closeButton?: boolean
  onHide?: () => void
}
const defaultProps = {
  closeLabel: "Close",
  closeButton: false,
}
export const AbstractModalHeader = React.forwardRef<
  HTMLDivElement,
  AbstractModalHeaderProps
>(
  (
    { closeLabel, closeVariant, closeButton, onHide, children, ...props },
    ref
  ) => {
    const context = useContext(ModalContext)
    const handleClick = useEventCallback(() => {
      context?.onHide()
      onHide?.()
    })
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
    )
  }
)
AbstractModalHeader.defaultProps = defaultProps
