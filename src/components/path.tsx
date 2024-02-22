import {
    Container,
    ControlElement,
    customElements,
    Module,
    Panel,
    Styles
} from '@ijstech/components';
import { IIPFSData } from '../inteface';
const Theme = Styles.Theme.ThemeVars;

interface ScomIPFSPathElement extends ControlElement {
    data?: IIPFSData;
    onItemClicked?: (data: IIPFSData) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-ipfs--path']: ScomIPFSPathElement;
        }
    }
}

@customElements('i-scom-ipfs--path')
export class ScomIPFSPath extends Module {
    private pnlAddress: Panel;
    private breadcrumb: { [idx: string]: IIPFSData } = {};

    private _data: IIPFSData = {
        cid: ''
    };
    onItemClicked: (data: IIPFSData) => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    static async create(options?: ScomIPFSPathElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get data() {
        return this._data;
    }
    set data(value: IIPFSData) {
        this._data = value;
    }

    setData(value: IIPFSData) {
        this._data = value;
        this.onUpdateBreadcumbs(value);
    }

    clear() {
        this.pnlAddress.clearInnerHTML();
        this.pnlAddress.visible = false;
        this.breadcrumb = {};
        this._data = {
            cid: ''
        };
    }

    private onUpdateBreadcumbs(node: IIPFSData) {
        if (node) {
            if (!this.breadcrumb[node.path]) {
                this.breadcrumb[node.path] = node;
            }

            const nodePaths = this.splitPath(node.path);
            const elmPath = [];

            if (nodePaths?.length) {
                for (let nodePath of nodePaths) {
                    const data = this.breadcrumb[nodePath];
                    if (data) {
                        const item = (
                            <i-hstack verticalAlignment="center" gap="0.25rem">
                                {nodePath != node.path ? (
                                    <i-button
                                        caption={data.name || data.cid || ''}
                                        font={{ size: '0.75rem' }}
                                        boxShadow='none'
                                        background={{ color: 'transparent' }}
                                        onClick={() => this.onBreadcrumbClick({ cid: data.cid, path: nodePath })}
                                    ></i-button>
                                ) : (
                                    <i-label caption={data.name || data.cid || ''} font={{ size: '0.75rem' }}></i-label>
                                )}
                                <i-icon name="chevron-right" width="0.675rem" height="0.675rem" fill={Theme.text.primary}></i-icon>
                            </i-hstack>
                        );
                        elmPath.push(item);
                    }
                }

                this.pnlAddress.clearInnerHTML();
                this.pnlAddress.visible = !!elmPath.length;
                this.pnlAddress.append(...elmPath);
            }
        }
    }

    private async onBreadcrumbClick({ cid, path }: { cid: string; path: string }) {
        if (this.onItemClicked) this.onItemClicked({ cid, path });
    }

    private splitPath(path: string) {
        const array = path.split('/');

        let i = 0;
        let final = [];
        while (i < array.length) {
            final.push(
                `${array
                    .slice(0, i + 1)
                    .join('/')
                    .toString()}`
            );
            i++;
        }
        return final;
    }

    init() {
        super.init();
        this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
        const data = this.getAttribute('data', true);
        if (data) this.setData(data);
    }

    render() {
        return (
            <i-hstack
                id={'pnlAddress'}
                verticalAlignment="center"
                padding={{ top: '0.5rem', bottom: '0.5rem' }}
                height={'2.188rem'}
                gap={'0.25rem'}
                visible={false}
            ></i-hstack>
        )
    }
}
