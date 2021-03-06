import contains from "dom-helpers/contains"
import listen from "dom-helpers/listen"
import ownerDocument from "dom-helpers/ownerDocument"
import { useCallback, useEffect, useRef } from "react"
import useEventCallback from "@restart/hooks/useEventCallback"
import warning from "warning"
const escapeKeyCode = 27
const noop = () => {}
export type MouseEvents = {
  [K in keyof GlobalEventHandlersEventMap]: GlobalEventHandlersEventMap[K] extends MouseEvent
    ? K
    : never
}[keyof GlobalEventHandlersEventMap]
function isLeftClickEvent(event: MouseEvent) {
  return event.button === 0
}
function isModifiedEvent(event: MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}
const getRefTarget = (ref: React.RefObject<Element> | Element | null | undefined) =>
  ref && ("current" in ref ? ref.current : ref)
export interface RootCloseOptions {
  disabled?: boolean
  clickTrigger?: MouseEvents
}
function useRootClose(
  ref: React.RefObject<Element> | Element | null | undefined,
  onRootClose: (e: Event) => void,
  { disabled, clickTrigger = "click" }: RootCloseOptions = {}
) {
  const preventMouseRootCloseRef = useRef(false)
  const onClose = onRootClose || noop
  const handleMouseCapture = useCallback(
    e => {
      const currentTarget = getRefTarget(ref)
      warning(
        !!currentTarget,
        "RootClose captured a close event but does not have a ref to compare it to. " +
          "useRootClose(), should be passed a ref that resolves to a DOM node"
      )
      preventMouseRootCloseRef.current =
        !currentTarget ||
        isModifiedEvent(e) ||
        !isLeftClickEvent(e) ||
        !!contains(currentTarget, e.target)
    },
    [ref]
  )
  const handleMouse = useEventCallback((e: MouseEvent) => {
    if (!preventMouseRootCloseRef.current) {
      onClose(e)
    }
  })
  const handleKeyUp = useEventCallback((e: KeyboardEvent) => {
    if (e.keyCode === escapeKeyCode) {
      onClose(e)
    }
  })
  useEffect(() => {
    if (disabled || ref == null) return undefined
    let currentEvent = window.event
    const doc = ownerDocument(getRefTarget(ref)!)
    const removeMouseCaptureListener = listen(doc as any, clickTrigger, handleMouseCapture, true)
    const removeMouseListener = listen(doc as any, clickTrigger, e => {
      if (e === currentEvent) {
        currentEvent = undefined
        return
      }
      handleMouse(e)
    })
    const removeKeyupListener = listen(doc as any, "keyup", e => {
      if (e === currentEvent) {
        currentEvent = undefined
        return
      }
      handleKeyUp(e)
    })
    let mobileSafariHackListeners = [] as Array<() => void>
    if ("ontouchstart" in doc.documentElement) {
      mobileSafariHackListeners = [].slice
        .call(doc.body.children)
        .map(el => listen(el, "mousemove", noop))
    }
    return () => {
      removeMouseCaptureListener()
      removeMouseListener()
      removeKeyupListener()
      mobileSafariHackListeners.forEach(remove => remove())
    }
  }, [ref, disabled, clickTrigger, handleMouseCapture, handleMouse, handleKeyUp])
}
export default useRootClose
