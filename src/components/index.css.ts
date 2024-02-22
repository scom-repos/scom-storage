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
