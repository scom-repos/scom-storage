import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const defaultColors = {
    light: {
        primaryColor: '#3f51b5',
        primaryLightColor: '#69c4cd',
        primaryDarkColor: '#0b3a53',
        secondaryColor: 'hsl(0,0%,57%)',
        borderColor: '#0000001f',
        fontColor: '#34373f',
        backgroundColor: '#fbfbfb',
        secondaryLight: '#dee2e6',
        secondaryMain: 'rgba(255, 255, 255, .15)',
        hover: '#69c4cd',
        hoverBackground: 'rgba(0, 0, 0, 0.04)',
        selected: '#fff',
        selectedBackground: '#0b3a53'
    },
    dark: {
        primaryColor: '#3f51b5',
        primaryLightColor: '#69c4cd',
        primaryDarkColor: '#0b3a53',
        secondaryColor: '#666666',
        borderColor: '#ffffff1f',
        fontColor: '#fff',
        backgroundColor: '#121212',
        secondaryLight: '#aaaaaa',
        secondaryMain: 'rgba(255, 255, 255, .15)',
        hover: '#69c4cd',
        hoverBackground: '#222222',
        selected: '#fff',
        selectedBackground: '#0b3a53'
    }
}

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
        },
        '.file-manager-tree > .i-tree-node > .i-tree-node_content': {
            $nest: {
                '.btn-folder': {
                    display: 'block !important'
                },
                '.btn-folder *': {
                    display: 'block !important'
                },
                '.btn-actions': {
                    display: 'none !important'
                }
            }

        },
        '.file-manager-tree': {
            $nest: {
                '.btn-folder': {
                    display: 'none !important'
                },
                'i-button': {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: '4px',
                    $nest: {
                        '&:hover': {
                            background: Theme.colors.primary.main
                        }
                    }
                }
            }
        }
    }
})

export const iconButtonStyled = Styles.style({
    fontSize: '0.75rem',
    justifyContent: 'start',
    padding: '4px 8px',
    $nest: {
        '&:hover': {
            background: defaultColors.dark.selectedBackground,
            color: defaultColors.dark.selected
        }
    }
})

export const previewModalStyle = Styles.style({
    $nest: {
        '.i-modal_header': {
            padding: '1rem'
        }
    }
})

export const dragAreaStyle = Styles.style({
    border: `2px solid ${Theme.colors.info.dark}`,
    opacity: 0.7
})

export const selectedRowStyle = Styles.style({
    $nest: {
        '& > .i-table-cell': {
            background: `${Theme.action.focusBackground} !important`
        }
    }
})

export const customMDStyles = Styles.style({
    position: 'fixed !important' as any,
    $nest: {
    }
})