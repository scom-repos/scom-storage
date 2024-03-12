import { customElements, ControlElement, Module, Styles, VStack } from "@ijstech/components"

const Theme = Styles.Theme.ThemeVars
export interface ILoadingSpinnerProps {
    height?: string;
    top?: string;
    minHeight?: number | string;
    background?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scom-storage--loading-spinner']: ControlElement
        }
    }
}

@customElements('scom-storage--loading-spinner')
export class LoadingSpinner extends Module {
    private pnlLoadingSpinner: VStack;

    async init() {
        await super.init();
    }

    setProperties(value: ILoadingSpinnerProps) {
        this.pnlLoadingSpinner.height = value.height || '100%';
        this.pnlLoadingSpinner.top = value.top || 0;
        this.pnlLoadingSpinner.minHeight = value.minHeight || 200;
        this.pnlLoadingSpinner.style.background = value.background || Theme.background.default;
    }

    render() {
        return (
            <i-vstack
                id="pnlLoadingSpinner"
                width="100%" minHeight={200}
                position="absolute"
                bottom={0}
                zIndex={1000}
                background={{ color: Theme.background.main }}
                class="i-loading-overlay"
                opacity={0.7}
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            height: 'calc(100% - 3.125rem)',
                            top: 0
                        }
                    }
                ]}
            >
                <i-vstack
                    horizontalAlignment="center" verticalAlignment="center"
                    position="absolute" top="calc(50% - 0.75rem)" left="calc(50% - 0.75rem)"
                >
                    <i-icon
                        class="i-loading-spinner_icon"
                        name="spinner"
                        width={24}
                        height={24}
                        fill={Theme.colors.primary.main}
                    />
                </i-vstack>
            </i-vstack>
        )
    }
}