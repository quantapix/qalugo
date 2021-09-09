import { useEffect, useRef } from "react"
import { TransitionProps } from "./types"
export function NoopTransition({
  children,
  in: inProp,
  mountOnEnter,
  unmountOnExit,
}: TransitionProps) {
  const hasEnteredRef = useRef(inProp)
  useEffect(() => {
    if (inProp) hasEnteredRef.current = true
  }, [inProp])
  if (inProp) return children
  if (unmountOnExit) return null
  if (!hasEnteredRef.current && mountOnEnter) return null
  return children
}
