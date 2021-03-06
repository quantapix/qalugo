export default createWithBsPrefix("carousel-caption")
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./utils"
import { map, forEach } from "./ElementChildren"
import { TransitionStatus } from "react-transition-group/Transition"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useUncontrolled } from "uncontrollable"
import * as React from "react"
import { Anchor } from "./Anchor"
import classNames from "classnames"
import createWithBsPrefix from "./createWithBsPrefix"
import transitionEndListener from "./transitionEndListener"
import TransitionWrapper from "./TransitionWrapper"
import triggerBrowserReflow from "./triggerBrowserReflow"
import useCommittedRef from "@restart/hooks/useCommittedRef"
import useEventCallback from "@restart/hooks/useEventCallback"
import useTimeout from "@restart/hooks/useTimeout"
import useUpdateEffect from "@restart/hooks/useUpdateEffect"

export type CarouselVariant = "dark"
export interface CarouselRef {
  element?: HTMLElement
  prev: (e?: React.SyntheticEvent) => void
  next: (e?: React.SyntheticEvent) => void
}
export interface CarouselItemProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
  interval?: number
}
export const CarouselItem: BsPrefixRefForwardingComponent<"div", CarouselItemProps> =
  React.forwardRef<HTMLElement, CarouselItemProps>(
    ({ as: Component = "div", bsPrefix, className, ...props }, ref) => {
      const finalClassName = classNames(className, useBootstrapPrefix(bsPrefix, "carousel-item"))
      return <Component ref={ref} {...props} className={finalClassName} />
    }
  )
CarouselItem.displayName = "CarouselItem"
export interface CarouselProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  slide?: boolean
  fade?: boolean
  controls?: boolean
  indicators?: boolean
  indicatorLabels?: string[]
  activeIndex?: number
  onSelect?: (eventKey: number, event: Record<string, unknown> | null) => void
  defaultActiveIndex?: number
  onSlide?: (eventKey: number, direction: "start" | "end") => void
  onSlid?: (eventKey: number, direction: "start" | "end") => void
  interval?: number | null
  keyboard?: boolean
  pause?: "hover" | false
  wrap?: boolean
  touch?: boolean
  prevIcon?: React.ReactNode
  prevLabel?: React.ReactNode
  nextIcon?: React.ReactNode
  nextLabel?: React.ReactNode
  ref?: React.Ref<CarouselRef>
  variant?: CarouselVariant
}
const SWIPE_THRESHOLD = 40
function isVisible(element) {
  if (!element || !element.style || !element.parentNode || !element.parentNode.style) {
    return false
  }
  const elementStyle = getComputedStyle(element)
  return (
    elementStyle.display !== "none" &&
    elementStyle.visibility !== "hidden" &&
    getComputedStyle(element.parentNode).display !== "none"
  )
}
export const Carousel: BsPrefixRefForwardingComponent<"div", CarouselProps> = React.forwardRef<
  CarouselRef,
  CarouselProps
>((uncontrolledProps, ref) => {
  const {
    as: Component = "div",
    bsPrefix,
    slide,
    fade,
    controls,
    indicators,
    indicatorLabels,
    activeIndex,
    onSelect,
    onSlide,
    onSlid,
    interval,
    keyboard,
    onKeyDown,
    pause,
    onMouseOver,
    onMouseOut,
    wrap,
    touch,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    prevIcon,
    prevLabel,
    nextIcon,
    nextLabel,
    variant,
    className,
    children,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    activeIndex: "onSelect",
  })
  const prefix = useBootstrapPrefix(bsPrefix, "carousel")
  const isRTL = useIsRTL()
  const nextDirectionRef = useRef<string | null>(null)
  const [direction, setDirection] = useState("next")
  const [paused, setPaused] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [renderedActiveIndex, setRenderedActiveIndex] = useState<number>(activeIndex || 0)
  if (!isSliding && activeIndex !== renderedActiveIndex) {
    if (nextDirectionRef.current) {
      setDirection(nextDirectionRef.current)
    } else {
      setDirection((activeIndex || 0) > renderedActiveIndex ? "next" : "prev")
    }
    if (slide) {
      setIsSliding(true)
    }
    setRenderedActiveIndex(activeIndex || 0)
  }
  useEffect(() => {
    if (nextDirectionRef.current) {
      nextDirectionRef.current = null
    }
  })
  let numChildren = 0
  let activeChildInterval: number | undefined
  forEach(children, (child, index) => {
    ++numChildren
    if (index === activeIndex) {
      activeChildInterval = child.props.interval as number | undefined
    }
  })
  const activeChildIntervalRef = useCommittedRef(activeChildInterval)
  const prev = useCallback(
    (event?) => {
      if (isSliding) {
        return
      }
      let nextActiveIndex = renderedActiveIndex - 1
      if (nextActiveIndex < 0) {
        if (!wrap) {
          return
        }
        nextActiveIndex = numChildren - 1
      }
      nextDirectionRef.current = "prev"
      onSelect?.(nextActiveIndex, event)
    },
    [isSliding, renderedActiveIndex, onSelect, wrap, numChildren]
  )
  const next = useEventCallback((event?) => {
    if (isSliding) {
      return
    }
    let nextActiveIndex = renderedActiveIndex + 1
    if (nextActiveIndex >= numChildren) {
      if (!wrap) {
        return
      }
      nextActiveIndex = 0
    }
    nextDirectionRef.current = "next"
    onSelect?.(nextActiveIndex, event)
  })
  const elementRef = useRef<HTMLElement>()
  useImperativeHandle(ref, () => ({
    element: elementRef.current,
    prev,
    next,
  }))
  const nextWhenVisible = useEventCallback(() => {
    if (!document.hidden && isVisible(elementRef.current)) {
      if (isRTL) {
        prev()
      } else {
        next()
      }
    }
  })
  const slideDirection = direction === "next" ? "start" : "end"
  useUpdateEffect(() => {
    if (slide) {
      return
    }
    onSlide?.(renderedActiveIndex, slideDirection)
    onSlid?.(renderedActiveIndex, slideDirection)
  }, [renderedActiveIndex])
  const orderClassName = `${prefix}-item-${direction}`
  const directionalClassName = `${prefix}-item-${slideDirection}`
  const handleEnter = useCallback(
    node => {
      triggerBrowserReflow(node)
      onSlide?.(renderedActiveIndex, slideDirection)
    },
    [onSlide, renderedActiveIndex, slideDirection]
  )
  const handleEntered = useCallback(() => {
    setIsSliding(false)
    onSlid?.(renderedActiveIndex, slideDirection)
  }, [onSlid, renderedActiveIndex, slideDirection])
  const handleKeyDown = useCallback(
    event => {
      if (keyboard && !/input|textarea/i.test(event.target.tagName)) {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault()
            if (isRTL) {
              next(event)
            } else {
              prev(event)
            }
            return
          case "ArrowRight":
            event.preventDefault()
            if (isRTL) {
              prev(event)
            } else {
              next(event)
            }
            return
          default:
        }
      }
      onKeyDown?.(event)
    },
    [keyboard, onKeyDown, prev, next, isRTL]
  )
  const handleMouseOver = useCallback(
    event => {
      if (pause === "hover") {
        setPaused(true)
      }
      onMouseOver?.(event)
    },
    [pause, onMouseOver]
  )
  const handleMouseOut = useCallback(
    event => {
      setPaused(false)
      onMouseOut?.(event)
    },
    [onMouseOut]
  )
  const touchStartXRef = useRef(0)
  const touchDeltaXRef = useRef(0)
  const touchUnpauseTimeout = useTimeout()
  const handleTouchStart = useCallback(
    event => {
      touchStartXRef.current = event.touches[0].clientX
      touchDeltaXRef.current = 0
      if (pause === "hover") {
        setPaused(true)
      }
      onTouchStart?.(event)
    },
    [pause, onTouchStart]
  )
  const handleTouchMove = useCallback(
    event => {
      if (event.touches && event.touches.length > 1) {
        touchDeltaXRef.current = 0
      } else {
        touchDeltaXRef.current = event.touches[0].clientX - touchStartXRef.current
      }
      onTouchMove?.(event)
    },
    [onTouchMove]
  )
  const handleTouchEnd = useCallback(
    event => {
      if (touch) {
        const touchDeltaX = touchDeltaXRef.current
        if (Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
          if (touchDeltaX > 0) {
            prev(event)
          } else {
            next(event)
          }
        }
      }
      if (pause === "hover") {
        touchUnpauseTimeout.set(() => {
          setPaused(false)
        }, interval || undefined)
      }
      onTouchEnd?.(event)
    },
    [touch, pause, prev, next, touchUnpauseTimeout, interval, onTouchEnd]
  )
  const shouldPlay = interval != null && !paused && !isSliding
  const intervalHandleRef = useRef<number | null>()
  useEffect(() => {
    if (!shouldPlay) {
      return undefined
    }
    const nextFunc = isRTL ? prev : next
    intervalHandleRef.current = window.setInterval(
      document.visibilityState ? nextWhenVisible : nextFunc,
      activeChildIntervalRef.current ?? interval ?? undefined
    )
    return () => {
      if (intervalHandleRef.current !== null) {
        clearInterval(intervalHandleRef.current)
      }
    }
  }, [shouldPlay, prev, next, activeChildIntervalRef, interval, nextWhenVisible, isRTL])
  const indicatorOnClicks = useMemo(
    () =>
      indicators &&
      Array.from({ length: numChildren }, (_, index) => event => {
        onSelect?.(index, event)
      }),
    [indicators, numChildren, onSelect]
  )
  return (
    <Component
      ref={elementRef}
      {...props}
      onKeyDown={handleKeyDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={classNames(
        className,
        prefix,
        slide && "slide",
        fade && `${prefix}-fade`,
        variant && `${prefix}-${variant}`
      )}
    >
      {indicators && (
        <div className={`${prefix}-indicators`}>
          {map(children, (_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target=""
              aria-label={indicatorLabels?.length ? indicatorLabels[index] : `Slide ${index + 1}`}
              className={index === renderedActiveIndex ? "active" : undefined}
              onClick={indicatorOnClicks ? indicatorOnClicks[index] : undefined}
              aria-current={index === renderedActiveIndex}
            />
          ))}
        </div>
      )}
      <div className={`${prefix}-inner`}>
        {map(children, (child, index) => {
          const isActive = index === renderedActiveIndex
          return slide ? (
            <TransitionWrapper
              in={isActive}
              onEnter={isActive ? handleEnter : undefined}
              onEntered={isActive ? handleEntered : undefined}
              addEndListener={transitionEndListener}
            >
              {(status: TransitionStatus, innerProps: Record<string, unknown>) =>
                React.cloneElement(child, {
                  ...innerProps,
                  className: classNames(
                    child.props.className,
                    isActive && status !== "entered" && orderClassName,
                    (status === "entered" || status === "exiting") && "active",
                    (status === "entering" || status === "exiting") && directionalClassName
                  ),
                })
              }
            </TransitionWrapper>
          ) : (
            React.cloneElement(child, {
              className: classNames(child.props.className, isActive && "active"),
            })
          )
        })}
      </div>
      {controls && (
        <>
          {(wrap || activeIndex !== 0) && (
            <Anchor className={`${prefix}-control-prev`} onClick={prev}>
              {prevIcon}
              {prevLabel && <span className="visually-hidden">{prevLabel}</span>}
            </Anchor>
          )}
          {(wrap || activeIndex !== numChildren - 1) && (
            <Anchor className={`${prefix}-control-next`} onClick={next}>
              {nextIcon}
              {nextLabel && <span className="visually-hidden">{nextLabel}</span>}
            </Anchor>
          )}
        </>
      )}
    </Component>
  )
})
Carousel.displayName = "Carousel"
Carousel.defaultProps = {
  slide: true,
  fade: false,
  controls: true,
  indicators: true,
  indicatorLabels: [],
  defaultActiveIndex: 0,
  interval: 5000,
  keyboard: true,
  pause: "hover" as CarouselProps["pause"],
  wrap: true,
  touch: true,
  prevIcon: <span aria-hidden="true" className="carousel-control-prev-icon" />,
  prevLabel: "Previous",
  nextIcon: <span aria-hidden="true" className="carousel-control-next-icon" />,
  nextLabel: "Next",
}
Object.assign(Carousel, {
  Caption: CarouselCaption,
  Item: CarouselItem,
})
