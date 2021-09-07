import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext, useMemo } from "react"
import BaseDropdown, {
  DropdownProps as BaseDropdownProps,
  ToggleMetadata,
} from "@restart/ui/Dropdown"
import { useUncontrolled } from "uncontrollable"
import useEventCallback from "@restart/hooks/useEventCallback"
import DropdownContext, { DropDirection } from "./DropdownContext"
import DropdownItem from "./DropdownItem"
import DropdownMenu, { getDropdownMenuPlacement } from "./DropdownMenu"
import DropdownToggle from "./DropdownToggle"
import InputGroupContext from "./InputGroupContext"
import { useBootstrapPrefix, useIsRTL } from "./ThemeProvider"
import createWithBsPrefix from "./createWithBsPrefix"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { AlignType, alignPropType } from "./types"
const DropdownHeader = createWithBsPrefix("dropdown-header", {
  defaultProps: { role: "heading" },
})
const DropdownDivider = createWithBsPrefix("dropdown-divider", {
  Component: "hr",
  defaultProps: { role: "separator" },
})
const DropdownItemText = createWithBsPrefix("dropdown-item-text", {
  Component: "span",
})
export interface DropdownProps
  extends BaseDropdownProps,
    BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "children"> {
  drop?: DropDirection
  align?: AlignType
  flip?: boolean
  focusFirstItemOnShow?: boolean | "keyboard"
  navbar?: boolean
  autoClose?: boolean | "outside" | "inside"
}
const propTypes = {
  /** @default 'dropdown' */
  bsPrefix: PropTypes.string,
  /**
   * Determines the direction and location of the Menu in relation to it's Toggle.
   */
  drop: PropTypes.oneOf(["up", "start", "end", "down"]),
  as: PropTypes.elementType,
  /**
   * Aligns the dropdown menu to the specified side of the Dropdown toggle. You can
   * also align the menu responsively for breakpoints starting at `sm` and up.
   * The alignment direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,
  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  show: PropTypes.bool,
  /**
   * Allow Dropdown to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/docs/v2/modifiers/flip/).
   *
   */
  flip: PropTypes.bool,
  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `show` value, the DOM event, and the source that fired it: `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
   *
   * ```js
   * function(
   *   isOpen: boolean,
   *   event: SyntheticEvent,
   *   metadata: {
   *     source: 'select' | 'click' | 'rootClose' | 'keydown'
   *   }
   * ): void
   * ```
   *
   * @controllable show
   */
  onToggle: PropTypes.func,
  /**
   * A callback fired when a menu item is selected.
   *
   * ```js
   * (eventKey: any, event: Object) => any
   * ```
   */
  onSelect: PropTypes.func,
  /**
   * Controls the focus behavior for when the Dropdown is opened. Set to
   * `true` to always focus the first menu item, `keyboard` to focus only when
   * navigating via the keyboard, or `false` to disable completely
   *
   * The Default behavior is `false` **unless** the Menu has a `role="menu"`
   * where it will default to `keyboard` to match the recommended [ARIA Authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).
   */
  focusFirstItemOnShow: PropTypes.oneOf([false, true, "keyboard"]),
  /** @private */
  navbar: PropTypes.bool,
  /**
   * Controls the auto close behaviour of the dropdown when clicking outside of
   * the button or the list.
   */
  autoClose: PropTypes.oneOf([true, "outside", "inside", false]),
}
const defaultProps: Partial<DropdownProps> = {
  navbar: false,
  align: "start",
  autoClose: true,
}
const Dropdown: BsPrefixRefForwardingComponent<"div", DropdownProps> =
  React.forwardRef<HTMLElement, DropdownProps>((pProps, ref) => {
    const {
      bsPrefix,
      drop,
      show,
      className,
      align,
      onSelect,
      onToggle,
      focusFirstItemOnShow,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = "div",
      navbar: _4,
      autoClose,
      ...props
    } = useUncontrolled(pProps, { show: "onToggle" })
    const isInputGroup = useContext(InputGroupContext)
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown")
    const isRTL = useIsRTL()
    const isClosingPermitted = (source: string): boolean => {
      // autoClose=false only permits close on button click
      if (autoClose === false) return source === "click"
      // autoClose=inside doesn't permit close on rootClose
      if (autoClose === "inside") return source !== "rootClose"
      // autoClose=outside doesn't permit close on select
      if (autoClose === "outside") return source !== "select"
      return true
    }
    const handleToggle = useEventCallback(
      (nextShow: boolean, meta: ToggleMetadata) => {
        if (
          meta.originalEvent!.currentTarget === document &&
          (meta.source !== "keydown" ||
            (meta.originalEvent as any).key === "Escape")
        )
          meta.source = "rootClose"
        if (isClosingPermitted(meta.source!)) onToggle?.(nextShow, meta)
      }
    )
    const alignEnd = align === "end"
    const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)
    const contextValue = useMemo(
      () => ({
        align,
        drop,
        isRTL,
      }),
      [align, drop, isRTL]
    )
    return (
      <DropdownContext.Provider value={contextValue}>
        <BaseDropdown
          placement={placement}
          show={show}
          onSelect={onSelect}
          onToggle={handleToggle}
          focusFirstItemOnShow={focusFirstItemOnShow}
          itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
        >
          {isInputGroup ? (
            props.children
          ) : (
            <Component
              {...props}
              ref={ref}
              className={classNames(
                className,
                show && "show",
                (!drop || drop === "down") && prefix,
                drop === "up" && "dropup",
                drop === "end" && "dropend",
                drop === "start" && "dropstart"
              )}
            />
          )}
        </BaseDropdown>
      </DropdownContext.Provider>
    )
  })
Dropdown.displayName = "Dropdown"
Dropdown.propTypes = propTypes
Dropdown.defaultProps = defaultProps
export default Object.assign(Dropdown, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemText: DropdownItemText,
  Divider: DropdownDivider,
  Header: DropdownHeader,
})
import * as React from "react"
import PropTypes from "prop-types"
import Dropdown, { DropdownProps } from "./Dropdown"
import DropdownToggle, { PropsFromToggle } from "./DropdownToggle"
import DropdownMenu, { DropdownMenuVariant } from "./DropdownMenu"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { alignPropType } from "./types"
export interface DropdownButtonProps
  extends Omit<DropdownProps, "title">,
    PropsFromToggle,
    BsPrefixProps {
  title: React.ReactNode
  menuRole?: string
  renderMenuOnMount?: boolean
  rootCloseEvent?: "click" | "mousedown"
  menuVariant?: DropdownMenuVariant
}
const propTypes = {
  /**
   * An html id attribute for the Toggle button, necessary for assistive technologies, such as screen readers.
   * @type {string}
   */
  id: PropTypes.string,
  /** An `href` passed to the Toggle component */
  href: PropTypes.string,
  /** An `onClick` handler passed to the Toggle component */
  onClick: PropTypes.func,
  /** The content of the non-toggle Button.  */
  title: PropTypes.node.isRequired,
  /** Disables both Buttons  */
  disabled: PropTypes.bool,
  /**
   * Aligns the dropdown menu.
   *
   * _see [DropdownMenu](#dropdown-menu-props) for more details_
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,
  /** An ARIA accessible role applied to the Menu component. When set to 'menu', The dropdown */
  menuRole: PropTypes.string,
  /** Whether to render the dropdown menu in the DOM before the first time it is shown */
  renderMenuOnMount: PropTypes.bool,
  /**
   *  Which event when fired outside the component will cause it to be closed.
   *
   * _see [DropdownMenu](#dropdown-menu-props) for more details_
   */
  rootCloseEvent: PropTypes.string,
  /**
   * Menu color variant.
   *
   * Omitting this will use the default light color.
   */
  menuVariant: PropTypes.oneOf<DropdownMenuVariant>(["dark"]),
  /** @ignore */
  bsPrefix: PropTypes.string,
  /** @ignore */
  variant: PropTypes.string,
  /** @ignore */
  size: PropTypes.string,
}
/**
 * A convenience component for simple or general use dropdowns. Renders a `Button` toggle and all `children`
 * are passed directly to the default `Dropdown.Menu`. This component accepts all of
 * [`Dropdown`'s props](#dropdown-props).
 *
 * _All unknown props are passed through to the `Dropdown` component._ Only
 * the Button `variant`, `size` and `bsPrefix` props are passed to the toggle,
 * along with menu-related props are passed to the `Dropdown.Menu`
 */
const DropdownButton: BsPrefixRefForwardingComponent<
  "div",
  DropdownButtonProps
> = React.forwardRef<HTMLDivElement, DropdownButtonProps>(
  (
    {
      title,
      children,
      bsPrefix,
      rootCloseEvent,
      variant,
      size,
      menuRole,
      renderMenuOnMount,
      disabled,
      href,
      id,
      menuVariant,
      ...props
    },
    ref
  ) => (
    <Dropdown ref={ref} {...props}>
      <DropdownToggle
        id={id}
        href={href}
        size={size}
        variant={variant}
        disabled={disabled}
        childBsPrefix={bsPrefix}
      >
        {title}
      </DropdownToggle>
      <DropdownMenu
        role={menuRole}
        renderOnMount={renderMenuOnMount}
        rootCloseEvent={rootCloseEvent}
        variant={menuVariant}
      >
        {children}
      </DropdownMenu>
    </Dropdown>
  )
)
DropdownButton.displayName = "DropdownButton"
DropdownButton.propTypes = propTypes
export default DropdownButton
import * as React from "react"
import { AlignType } from "./types"
export type DropDirection = "up" | "start" | "end" | "down"
export type DropdownContextValue = {
  align?: AlignType
  drop?: DropDirection
  isRTL?: boolean
}
const DropdownContext = React.createContext<DropdownContextValue>({})
DropdownContext.displayName = "DropdownContext"
export default DropdownContext
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import BaseDropdownItem, {
  useDropdownItem,
  DropdownItemProps as BaseDropdownItemProps,
} from "@restart/ui/DropdownItem"
import Anchor from "@restart/ui/Anchor"
import { useBootstrapPrefix } from "./ThemeProvider"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
export interface DropdownItemProps
  extends BaseDropdownItemProps,
    BsPrefixProps {}
const propTypes = {
  /** @default 'dropdown-item' */
  bsPrefix: PropTypes.string,
  /**
   * Highlight the menu item as active.
   */
  active: PropTypes.bool,
  /**
   * Disable the menu item, making it unselectable.
   */
  disabled: PropTypes.bool,
  /**
   * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
   */
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * HTML `href` attribute corresponding to `a.href`.
   */
  href: PropTypes.string,
  /**
   * Callback fired when the menu item is clicked.
   */
  onClick: PropTypes.func,
  as: PropTypes.elementType,
}
const DropdownItem: BsPrefixRefForwardingComponent<
  typeof BaseDropdownItem,
  DropdownItemProps
> = React.forwardRef(
  (
    {
      bsPrefix,
      className,
      eventKey,
      disabled = false,
      onClick,
      active,
      as: Component = Anchor,
      ...props
    },
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown-item")
    const [dropdownItemProps, meta] = useDropdownItem({
      key: eventKey,
      href: props.href,
      disabled,
      onClick,
      active,
    })
    return (
      <Component
        {...props}
        {...dropdownItemProps}
        ref={ref}
        className={classNames(
          className,
          prefix,
          meta.isActive && "active",
          disabled && "disabled"
        )}
      />
    )
  }
)
DropdownItem.displayName = "DropdownItem"
DropdownItem.propTypes = propTypes
export default DropdownItem
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import {
  useDropdownMenu,
  UseDropdownMenuOptions,
} from "@restart/ui/DropdownMenu"
import useIsomorphicEffect from "@restart/hooks/useIsomorphicEffect"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import { SelectCallback } from "@restart/ui/types"
import warning from "warning"
import DropdownContext, { DropDirection } from "./DropdownContext"
import InputGroupContext from "./InputGroupContext"
import NavbarContext from "./NavbarContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import useWrappedRefWithWarning from "./useWrappedRefWithWarning"
import { BsPrefixProps, BsPrefixRefForwardingComponent } from "./helpers"
import { AlignType, AlignDirection, alignPropType, Placement } from "./types"
export type DropdownMenuVariant = "dark" | string
export interface DropdownMenuProps
  extends BsPrefixProps,
    Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  show?: boolean
  renderOnMount?: boolean
  flip?: boolean
  align?: AlignType
  onSelect?: SelectCallback
  rootCloseEvent?: "click" | "mousedown"
  popperConfig?: UseDropdownMenuOptions["popperConfig"]
  variant?: DropdownMenuVariant
}
const propTypes = {
  /**
   * @default 'dropdown-menu'
   */
  bsPrefix: PropTypes.string,
  /** Controls the visibility of the Dropdown menu  */
  show: PropTypes.bool,
  /** Whether to render the dropdown menu in the DOM before the first time it is shown */
  renderOnMount: PropTypes.bool,
  /** Have the dropdown switch to it's opposite placement when necessary to stay on screen. */
  flip: PropTypes.bool,
  /**
   * Aligns the dropdown menu to the specified side of the container. You can also align
   * the menu responsively for breakpoints starting at `sm` and up. The alignment
   * direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"start"|"end"|{ sm: "start"|"end" }|{ md: "start"|"end" }|{ lg: "start"|"end" }|{ xl: "start"|"end"}|{ xxl: "start"|"end"} }
   */
  align: alignPropType,
  onSelect: PropTypes.func,
  /**
   * Which event when fired outside the component will cause it to be closed
   *
   * *Note: For custom dropdown components, you will have to pass the
   * `rootCloseEvent` to `<RootCloseWrapper>` in your custom dropdown menu
   * component ([similarly to how it is implemented in `<Dropdown.Menu>`](https://github.com/react-bootstrap/react-bootstrap/blob/v0.31.5/src/DropdownMenu.js#L115-L119)).*
   */
  rootCloseEvent: PropTypes.oneOf(["click", "mousedown"]),
  /**
   * Control the rendering of the DropdownMenu. All non-menu props
   * (listed here) are passed through to the `as` Component.
   *
   * If providing a custom, non DOM, component. the `show`, `close` and `align` props
   * are also injected and should be handled appropriately.
   */
  as: PropTypes.elementType,
  /**
   * A set of popper options and props passed directly to Popper.
   */
  popperConfig: PropTypes.object,
  /**
   * Menu color variant.
   *
   * Omitting this will use the default light color.
   */
  variant: PropTypes.string,
}
const defaultProps: Partial<DropdownMenuProps> = {
  flip: true,
}
export function getDropdownMenuPlacement(
  alignEnd: boolean,
  dropDirection?: DropDirection,
  isRTL?: boolean
) {
  const topStart = isRTL ? "top-end" : "top-start"
  const topEnd = isRTL ? "top-start" : "top-end"
  const bottomStart = isRTL ? "bottom-end" : "bottom-start"
  const bottomEnd = isRTL ? "bottom-start" : "bottom-end"
  const leftStart = isRTL ? "right-start" : "left-start"
  const leftEnd = isRTL ? "right-end" : "left-end"
  const rightStart = isRTL ? "left-start" : "right-start"
  const rightEnd = isRTL ? "left-end" : "right-end"
  let placement: Placement = alignEnd ? bottomEnd : bottomStart
  if (dropDirection === "up") placement = alignEnd ? topEnd : topStart
  else if (dropDirection === "end") placement = alignEnd ? rightEnd : rightStart
  else if (dropDirection === "start") placement = alignEnd ? leftEnd : leftStart
  return placement
}
const DropdownMenu: BsPrefixRefForwardingComponent<"div", DropdownMenuProps> =
  React.forwardRef<HTMLElement, DropdownMenuProps>(
    (
      {
        bsPrefix,
        className,
        align,
        rootCloseEvent,
        flip,
        show: showProps,
        renderOnMount,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = "div",
        popperConfig,
        variant,
        ...props
      },
      ref
    ) => {
      let alignEnd = false
      const isNavbar = useContext(NavbarContext)
      const prefix = useBootstrapPrefix(bsPrefix, "dropdown-menu")
      const { align: contextAlign, drop, isRTL } = useContext(DropdownContext)
      align = align || contextAlign
      const isInputGroup = useContext(InputGroupContext)
      const alignClasses: string[] = []
      if (align) {
        if (typeof align === "object") {
          const keys = Object.keys(align)
          warning(
            keys.length === 1,
            "There should only be 1 breakpoint when passing an object to `align`"
          )
          if (keys.length) {
            const brkPoint = keys[0]
            const direction: AlignDirection = align[brkPoint]
            // .dropdown-menu-end is required for responsively aligning
            // left in addition to align left classes.
            alignEnd = direction === "start"
            alignClasses.push(`${prefix}-${brkPoint}-${direction}`)
          }
        } else if (align === "end") {
          alignEnd = true
        }
      }
      const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)
      const [menuProps, { hasShown, popper, show, toggle }] = useDropdownMenu({
        flip,
        rootCloseEvent,
        show: showProps,
        usePopper: !isNavbar && alignClasses.length === 0,
        offset: [0, 2],
        popperConfig,
        placement,
      })
      menuProps.ref = useMergedRefs(
        useWrappedRefWithWarning(ref, "DropdownMenu"),
        menuProps.ref
      )
      useIsomorphicEffect(() => {
        // Popper's initial position for the menu is incorrect when
        // renderOnMount=true. Need to call update() to correct it.
        if (show) popper?.update()
      }, [show])
      if (!hasShown && !renderOnMount && !isInputGroup) return null
      // For custom components provide additional, non-DOM, props;
      if (typeof Component !== "string") {
        menuProps.show = show
        menuProps.close = () => toggle?.(false)
        menuProps.align = align
      }
      let style = props.style
      if (popper?.placement) {
        // we don't need the default popper style,
        // menus are display: none when not shown.
        style = { ...props.style, ...menuProps.style }
        props["x-placement"] = popper.placement
      }
      return (
        <Component
          {...props}
          {...menuProps}
          style={style}
          // Bootstrap css requires this data attrib to style responsive menus.
          {...((alignClasses.length || isNavbar) && {
            "data-bs-popper": "static",
          })}
          className={classNames(
            className,
            prefix,
            show && "show",
            alignEnd && `${prefix}-end`,
            variant && `${prefix}-${variant}`,
            ...alignClasses
          )}
        />
      )
    }
  )
DropdownMenu.displayName = "DropdownMenu"
DropdownMenu.propTypes = propTypes
DropdownMenu.defaultProps = defaultProps
export default DropdownMenu
import classNames from "classnames"
import PropTypes from "prop-types"
import * as React from "react"
import { useContext } from "react"
import { useDropdownToggle } from "@restart/ui/DropdownToggle"
import DropdownContext from "@restart/ui/DropdownContext"
import useMergedRefs from "@restart/hooks/useMergedRefs"
import Button, { ButtonProps, CommonButtonProps } from "./Button"
import InputGroupContext from "./InputGroupContext"
import { useBootstrapPrefix } from "./ThemeProvider"
import useWrappedRefWithWarning from "./useWrappedRefWithWarning"
import { BsPrefixRefForwardingComponent } from "./helpers"
export interface DropdownToggleProps extends Omit<ButtonProps, "as"> {
  as?: React.ElementType
  split?: boolean
  childBsPrefix?: string
}
type DropdownToggleComponent = BsPrefixRefForwardingComponent<
  "button",
  DropdownToggleProps
>
export type PropsFromToggle = Partial<
  Pick<React.ComponentPropsWithRef<DropdownToggleComponent>, CommonButtonProps>
>
const propTypes = {
  /**
   * @default 'dropdown-toggle'
   */
  bsPrefix: PropTypes.string,
  /**
   * An html id attribute, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   */
  id: PropTypes.string,
  split: PropTypes.bool,
  as: PropTypes.elementType,
  /**
   * to passthrough to the underlying button or whatever from DropdownButton
   * @private
   */
  childBsPrefix: PropTypes.string,
}
const DropdownToggle: DropdownToggleComponent = React.forwardRef(
  (
    {
      bsPrefix,
      split,
      className,
      childBsPrefix,
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = Button,
      ...props
    }: DropdownToggleProps,
    ref
  ) => {
    const prefix = useBootstrapPrefix(bsPrefix, "dropdown-toggle")
    const dropdownContext = useContext(DropdownContext)
    const isInputGroup = useContext(InputGroupContext)
    if (childBsPrefix !== undefined) {
      ;(props as any).bsPrefix = childBsPrefix
    }
    const [toggleProps] = useDropdownToggle()
    toggleProps.ref = useMergedRefs(
      toggleProps.ref,
      useWrappedRefWithWarning(ref, "DropdownToggle")
    )
    // This intentionally forwards size and variant (if set) to the
    // underlying component, to allow it to render size and style variants.
    return (
      <Component
        className={classNames(
          className,
          prefix,
          split && `${prefix}-split`,
          !!isInputGroup && dropdownContext?.show && "show"
        )}
        {...toggleProps}
        {...props}
      />
    )
  }
)
DropdownToggle.displayName = "DropdownToggle"
DropdownToggle.propTypes = propTypes
export default DropdownToggle
