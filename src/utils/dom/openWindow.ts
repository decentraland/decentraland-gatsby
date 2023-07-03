const SIZES = {
  small: { width: 600, height: 250 },
  large: { width: 600, height: 600 },
}

/**
 * An object that represents the options that can be passed to the `openWindow`
 * function.
 */
export type WindowOptions = Partial<{
  /**
   * A string, without whitespace, specifying the [name](https://developer.mozilla.org/en-US/docs/Web/API/Window/name) of the browsing context the
   * resource is being loaded into. If the name doesn't identify an existing context
   * a new context is created and given the specified name. The special [`target` keywords](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target),
   * `_self`, `_blank`, `_parent`, and `_top`, can also be used.
   */
  target: string,

  /** A predefined set of names that represent default sizes  */
  size: keyof typeof SIZES,

  /**
   * Specifies the width of the content area, including scrollbars. The minimum
   * required value is 100.
   */
  width: number,

  /**
   * Specifies the height of the content area, including scrollbars. The minimum
   * required value is 100.
   */
  height: number,

  /**
   * Specifies the distance in pixels from the top side of the work area as defined
   * by the user's operating system where the new window will be generated.
   */
  top: number,

  /**
   * Specifies the distance in pixels from the top side of the work area as defined
   * by the user's operating system where the new window will be generated.
   */
  screenY: number,

  /**
   * Specifies the distance in pixels from the left side of the work area as defined
   * by the user's operating system where the new window will be generated.
   */
  left: number,

  /**
   * Specifies the distance in pixels from the left side of the work area as defined
   * by the user's operating system where the new window will be generated.
   */
  screenX: number,

  /** Whether or not to display the address field. Opera only */
  location: number

  /** Whether or not to display the browser toolbar. IE and Firefox only */
  toolbar: boolean,

  /** Whether or not to add a status bar */
  status: boolean,

  /** Whether or not to display the menu bar */
  menubar: boolean,

  /** Whether or not to display scroll bars. IE, Firefox & Opera only */
  scrollbars: boolean,

  /**
   * Whether or not to display the browser in full-screen mode. Default is no.
   * A window in full-screen mode must also be in theater mode. IE only
   */
  fullscreen: boolean,

  /**
   * Whether or not to display the title bar. Ignored unless the calling
   * application is an HTML Application or a trusted dialog box
   */
  titlebar: boolean,

  /** Whether or not the window is resizable. IE only */
  resizable: boolean,

  /**
   * If this feature is set, the new window will not have access to the originating
   * window via [`Window.opener`](https://developer.mozilla.org/en-US/docs/Web/API/Window/opener) and returns `null`.
   */
  noopener: '_top' | '_self' | '_parent' | '_blank',

  /**
   * If this feature is set, the browser will omit the Referer header, as well
   * as set `noopener` to true.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noreferrer
   */
  noreferrer: boolean,
}>

const defaultOptions: WindowOptions = {
  target: 'sharer',
  size: 'small',
  toolbar: false,
  location: 0,
  status: false,
  menubar: false,
  scrollbars: true,
  resizable: true,
}

function toFeatures(options: WindowOptions): string {
  const features: string[] = []
  for (const [key, value] of Object.entries(options)) {
    switch (key) {
      case 'width':
      case 'height':
        features.push(`${key}=${Number.isFinite(value) && (value as number) > 100 ? value : 100}`)
      case 'top':
      case 'left':
      case 'screenX':
      case 'screenY':
      case 'location':
      case 'noopener':
        features.push(`${key}=${value}`)
        break
      case 'toolbar':
      case 'status':
      case 'menubar':
      case 'scrollbars':
      case 'resizable':
      case 'fullscreen':
      case 'titlebar':
        features.push(`${key}=${value ? 'yes' : 'no'}`)
        break
      case 'noreferrer':
        features.push(key)
        break
      case 'target':
      case 'size':
      default:
        // ignore
        break
    }
  }

  return features.join(',')
}

/**
 * Opens a new window using the [`window.open`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) function.
 *
 *  @param url - A string indicating the URL or path of the resource to be loaded.
 *               If an empty string ("") is specified or this parameter is omitted,
 *               a blank page is opened into the targeted browsing context.
 * @param options - An optional object containing the window features to apply.
 */
export default function openWindow(
  url: string,
  options: WindowOptions = {}
) {

  const windowOptions = { ...defaultOptions, ...options }
  const { height, width } = options.size ? SIZES[options.size] || SIZES['small'] : SIZES['small']

  if (windowOptions.height === undefined) {
    windowOptions.height = height
  }

  if (windowOptions.width === undefined) {
    windowOptions.width = width
  }

  if (windowOptions.top === undefined) {
    windowOptions.top = Math.ceil(window.outerHeight / 2 - windowOptions.height / 2)
  }

  if (windowOptions.left === undefined) {
    windowOptions.top = Math.ceil(window.outerWidth / 2 - windowOptions.width / 2)
  }

  return window.open(
    url,
    options.target ?? 'sharer',
    toFeatures(options)
  )
}
