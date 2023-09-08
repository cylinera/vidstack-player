import {
  Component,
  createContext,
  prop,
  provideContext,
  useContext,
  type ReadSignal,
} from 'maverick.js';

import { PlayerQueryList } from '../../core';

export class DefaultLayout extends Component<DefaultLayoutProps> {
  static props: DefaultLayoutProps = {
    when: '',
    smallWhen: '',
    thumbnails: '',
    icons: '',
    translations: null,
  };

  private _whenQueryList!: PlayerQueryList;
  private _whenSmQueryList!: PlayerQueryList;

  @prop
  menuContainer: HTMLElement | null = null;

  @prop
  get isMatch() {
    return this._whenQueryList.matches;
  }

  @prop
  get isSmallLayout() {
    return this._whenSmQueryList.matches;
  }

  protected override onSetup(): void {
    const { when, smallWhen, thumbnails, translations } = this.$props;

    this._whenQueryList = PlayerQueryList.create(when);
    this._whenSmQueryList = PlayerQueryList.create(smallWhen);

    this.setAttributes({
      'data-match': this._whenQueryList.$matches,
      'data-size': () => (this._whenSmQueryList.matches ? 'sm' : null),
    });

    const self = this;
    provideContext(defaultLayoutContext, {
      smQueryList: this._whenSmQueryList,
      thumbnails,
      translations,
      get menuContainer() {
        return self.menuContainer;
      },
    });
  }
}

/**
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 */
export class DefaultAudioLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: '(view-type: audio)',
    smallWhen: '(width < 576)',
  };
}

/**
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 */
export class DefaultVideoLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: '(view-type: video)',
    smallWhen: '(width < 576) or (height < 380)',
  };
}

export interface DefaultLayoutProps {
  /**
   * A player query string that determines when the UI should be displayed. The special string
   * 'never' will indicate that the UI should never be displayed.
   */
  when: string;
  /**
   * A player query string that determines when the small (e.g., mobile) UI should be displayed. The
   * special string 'never' will indicate that the small device optimized UI should never be
   * displayed.
   */
  smallWhen: string;
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  thumbnails: string;
  /**
   * The DOM identifier for a `<template>` element that contains SVG elements to be used as
   * icons.
   */
  icons: string;
  /**
   * Translation map from english to your desired language for words used throughout the layout.
   */
  translations: DefaultLayoutTranslations | null;
}

export interface DefaultLayoutContext {
  smQueryList: PlayerQueryList;
  thumbnails: ReadSignal<string>;
  translations: ReadSignal<DefaultLayoutTranslations | null>;
  menuContainer: HTMLElement | null;
}

export interface DefaultLayoutTranslations {
  Audio: string;
  Auto: string;
  Captions: string;
  Chapters: string;
  Default: string;
  Mute: string;
  Normal: string;
  Off: string;
  Pause: string;
  Play: string;
  Speed: string;
  Quality: string;
  Settings: string;
  Unmute: string;
  'Seek Forward': string;
  'Seek Backward': string;
  'Closed-Captions On': string;
  'Closed-Captions Off': string;
  'Enter Fullscreen': string;
  'Exit Fullscreen': string;
  'Enter PiP': string;
  'Exit PiP': string;
}

export function useDefaultLayoutLang(
  translations: ReadSignal<DefaultLayoutTranslations | null>,
  word: keyof DefaultLayoutTranslations,
) {
  return translations()?.[word] ?? word;
}

export const defaultLayoutContext = createContext<DefaultLayoutContext>();

export function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}
