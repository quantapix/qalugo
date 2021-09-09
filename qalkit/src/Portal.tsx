import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import * as React from "react"
import useWaitForDOMRef, { DOMContainer } from "./useWaitForDOMRef"
const propTypes = {
  container: PropTypes.any,
  onRendered: PropTypes.func,
}
export interface PortalProps {
  children: React.ReactElement
  container: DOMContainer
  onRendered?: (element: any) => void
}
export const Portal = ({ container, children, onRendered }: PortalProps) => {
  const resolvedContainer = useWaitForDOMRef(container, onRendered)
  return resolvedContainer ? <>{ReactDOM.createPortal(children, resolvedContainer)}</> : null
}
Portal.displayName = "Portal"
Portal.propTypes = propTypes
