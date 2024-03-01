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

export const uploadModalStyle = Styles.style({
    $nest: {    
        '.heading': {
          display: 'block',
          fontSize: 'clamp(1rem, 0.875rem + 0.625vw, 1.625rem)',
          color: Theme.colors.primary.dark,
          marginBottom: '0.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
          textAlign: 'center',
        },
    
        '.label': {
          display: 'block',
          marginBottom: '0.5rem',
          color: Theme.text.primary,
          textAlign: 'center',
        },
    
        '.file-uploader-dropzone': {
          display: 'flex',
          flexDirection: 'column',
          gridRowGap: '2rem',
          rowGap: '1.5rem',
          marginBottom: '2.5rem',
          marginTop: '2rem',
    
          $nest: {
            '.droparea': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gridRowGap: '1rem',
              rowGap: '1rem',
              padding: '1.875rem 0',
              background: 'rgba(255,255,255,.1)',
              border: `1px dashed ${Theme.colors.primary.light}`,
              borderRadius: '0.625rem',
              cursor: 'pointer',
            },
    
            'i-upload': {
              position: 'absolute',
              top: 0,
              opacity: 0,
              minHeight: 'auto',
              minWidth: 'auto',
              margin: 0,
              zIndex: 1,
    
              $nest: {
                '.i-upload_preview-img': {
                  display: 'none!important',
                },
              },
            },
    
            '.filelist': {
              marginBottom: '0.5rem',
    
              $nest: {
                '@media screen and (max-width: 767px)': {
                  flex: '1',
                  overflowY: 'auto'
                },
                '.file': {
                  border: `1px solid ${Theme.divider}`,
                  borderRadius: '0.5rem',
                  $nest: {
                    '&:hover': {
                      border: `1px solid ${Theme.colors.primary.main}`,
                    }
                  }
                },
              },
            },
    
            '.pagination': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
    
              $nest: {
                '@media screen and (max-width: 767px)': {
                  display: 'none'
                },
                'i-button': {
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: Theme.colors.primary.dark,
                  backgroundColor: 'transparent',
                  border: `1px solid ${Theme.colors.primary.dark}`,
                  boxShadow: 'none',
                  gap: 'unset',
                  userSelect: 'none',
    
                  $nest: {
                    '&.active': {
                      color: Theme.colors.primary.contrastText,
                      backgroundColor: Theme.colors.primary.dark,
                    },
    
                    '&.dots': {
                      borderColor: 'transparent',
                    },
    
                    'i-icon': {
                      height: '10px!important',
                      width: '12px!important',
                      fill: `${Theme.colors.primary.dark}!important`,
                    },
                  },
                },
              },
            },
          },
        },
    
        '.status-filter': {
          display: 'flex',
          justifyContent: 'space-between',
    
          $nest: {
            '.filter-bar': {
              display: 'flex',
              gap: '10px',
    
              $nest: {
                '@media screen and (max-width: 767px)': {
                  display: 'none'
                },
                '.filter-btn': {
                  fontSize: '14px',
                  background: 'transparent',
                  color: Theme.text.secondary,
                  boxShadow: 'none',
                },
    
                '.filter-btn.filter-btn-active': {
                  fontWeight: 'bold',
                  color: Theme.colors.primary.dark,
                },
              },
            },
    
            '.filter-actions': {
              $nest: {
                'i-button': {
                  background: Theme.colors.primary.light,
                  color: Theme.colors.primary.contrastText,
                  padding: '5px 10px',
                  fontSize: '14px',
                  boxShadow: 'none',
                },
              },
            },
          },
        },
    
        '.note': {
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.4375rem',
          paddingLeft: '1.25rem',
          paddingRight: '0.25rem',
    
          $nest: {
            '&:not(:last-child)': {
              marginBottom: '1.5rem',
            },
    
            '.head': {
              fontSize: '14px',
              fontWeight: 700,
              color: Theme.text.primary,
            },
    
            '.desc': {
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: 0,
              color: Theme.text.secondary,
            },
          },
        },
      },
})
