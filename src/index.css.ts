import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
    $nest: {
        '.storage-meter-uploaded': {
            backgroundSize: '410%',
            backgroundPosition: '0% 0px',
            transition: '.25s ease-out',
            filter: 'drop-shadow(0 2px 8px rgba(33,15,85,.33))',
        },
        'i-table .i-table-cell': {
            background: Theme.background.main
        }
    }
})

