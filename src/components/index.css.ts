import { Styles } from "@ijstech/components";
import assets from "../assets";

const Theme = Styles.Theme.ThemeVars;

export const backgroundStyle = Styles.style({
    backgroundColor: Theme.divider,
    aspectRatio: '3 / 2',
    '-webkit-mask': `url(${assets.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
    mask: `url(${assets.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
    '-webkit-mask-size': 'cover',
    maskSize: 'cover'
})

export const transitionStyle = Styles.style({
    '-webkit-transition': 'width 0.4s ease-in-out',
    transition: 'width 0.4s ease-in-out'
})

export const addressPanelStyle = Styles.style({
    '-ms-overflow-style': 'none',
    scrollbarWidth: 'none',
    $nest: {
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        'i-button': {
            whiteSpace: 'nowrap'
        }
    }
})

export const customLinkStyle = Styles.style({
    $nest: {
      'a': {
        color: `${Theme.colors.primary.main}!important`,
        display: `inline !important`,
      },
      'img': {
        maxWidth: '100%'
      }
    }
})

export const fullScreenStyle = Styles.style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: Theme.background.modal
})
