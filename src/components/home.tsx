import {
    CarouselSlider,
    Container,
    ControlElement,
    customElements,
    Module,
    Styles,
    VStack
} from '@ijstech/components';
import { autoRetryGetContent, formatBytes } from '../data';
import { IIPFSData } from '../inteface';
import { ScomIPFSFolder } from './folder';
import { backgroundStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface ScomIPFSMobileHomeElement extends ControlElement {
    recents?: IIPFSData[];
    folders?: IIPFSData[];
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-ipfs--mobile-home']: ScomIPFSMobileHomeElement;
        }
    }
}

interface IHomeData {
    recents?: IIPFSData[];
    folders?: IIPFSData[];
}

@customElements('i-scom-ipfs--mobile-home')
export class ScomIPFSMobileHome extends Module {
    private pnlRecent: VStack;
    private foldersSlider: CarouselSlider;
    private mobileFolder: ScomIPFSFolder;
    private mobileMain: VStack;

    private _data: IHomeData;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    static async create(options?: ScomIPFSMobileHomeElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get recents() {
        return this._data?.recents ?? [];
    }
    set recents(value: any[]) {
        this._data.recents = value ?? [];
    }

    get folders() {
        return this._data?.folders ?? [];
    }
    set folders(value: any[]) {
        this._data.folders = value ?? [];
    }

    setData(data: IHomeData) {
        this._data = data;
        this.mobileMain.visible = true;
        this.mobileFolder.visible = false;
        this.renderRecent();
        this.renderFolders();
    }

    private renderFolders() {
        let items = [];
        for (let folder of this.folders) {
            const isDir = folder.type === 'dir';
            const itemEl = (
                <i-vstack
                    verticalAlignment='center'
                    gap='0.5rem'
                    padding={{ top: '2rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                    border={{ radius: '0.5rem' }}
                    background={{ color: Theme.divider }}
                    margin={{ right: '0.5rem' }}
                    class={backgroundStyle}
                    cursor="pointer"
                    onClick={() => this.onFolderClick(folder)}
                >
                    <i-icon
                        stack={{ grow: '0', shrink: '0' }}
                        name={isDir ? 'folder' : 'file'}
                        fill={isDir ? Theme.colors.warning.main : Theme.colors.info.main}
                        width={'1.25rem'} height={'1.25rem'}
                    ></i-icon>
                    <i-vstack gap={'0.5rem'}>
                        <i-label caption={folder.name} font={{ weight: 600, size: '0.875rem' }} textOverflow='ellipsis'></i-label>
                        <i-hstack
                            verticalAlignment='center'
                            gap={'0.5rem'}
                        >
                            <i-label caption={`${folder.links?.length || 0} files`} opacity={0.5} font={{ size: '0.675rem' }} visible={isDir}></i-label>
                            <i-panel width={1} height={'0.75rem'} background={{ color: Theme.divider }} visible={isDir}></i-panel>
                            <i-label caption={`${formatBytes(folder.size)}`} opacity={0.5} font={{ size: '0.675rem' }}></i-label>
                        </i-hstack>
                    </i-vstack>
                </i-vstack>
            )
            items.push({
                name: '',
                controls: [
                    itemEl
                ]
            })
        }
        this.foldersSlider.items = items;
    }

    private renderRecent() {
        this.pnlRecent.clearInnerHTML();
        const recentList = [...this.recents].slice(0, 3);
        if (recentList?.length) {
            for (let nodeData of recentList) {
                const nodeEl = (
                    <i-hstack
                        verticalAlignment='center'
                        gap='1.5rem'
                        padding={{ top: '0.5rem', bottom: '0.5rem' }}
                    >
                        <i-icon
                            stack={{ grow: '0', shrink: '0' }}
                            name={'file'}
                            fill={Theme.colors.info.main}
                            border={{ radius: '0.25rem' }}
                            width={'2.5rem'} height={'2.5rem'}
                        ></i-icon>
                        <i-vstack gap={'0.5rem'}>
                            <i-label caption={nodeData.name} font={{ weight: 600, size: '0.875rem' }} textOverflow='ellipsis'></i-label>
                            <i-label caption={`${formatBytes(nodeData.size)}`} opacity={0.5} font={{ size: '0.675rem' }}></i-label>
                        </i-vstack>
                    </i-hstack>
                )
                this.pnlRecent.append(nodeEl);
            }
        }
    }

    private async onFolderClick(data: IIPFSData) {
        if (data.type === 'file') return;
        let childData = await this.onFetchData(data);
        this.mobileMain.visible = false;
        if (!childData.name && data.name) childData.name = data.name;
        this.mobileFolder.updatePath(childData);
        this.mobileFolder.setData({ list: childData?.links ?? [], type: 'dir' });
        this.mobileFolder.visible = true;
    }

    private onViewFiles() {
        this.mobileMain.visible = false;
        this.mobileFolder.setData({ list: [...this.recents], type: 'file' });
        this.mobileFolder.visible = true;
    }

    private onViewFolders() {
        this.mobileMain.visible = false;
        this.mobileFolder.setData({ list: [...this.folders], type: 'dir' });
        this.mobileFolder.visible = true;
    }

    private onBack() {
        this.mobileMain.visible = true;
        this.mobileFolder.visible = false;
    }

    private async onFetchData(ipfsData: any) {
        const childrenData = await autoRetryGetContent(ipfsData.cid);
        childrenData.path = ipfsData.path;
        if (childrenData.links) {
            for (let child of childrenData.links) {
                child.path = `${ipfsData.path}/${child.name}`;
                // child.links = (await autoRetryGetContent(child.cid))?.links || [];
            }
        }
        return childrenData;
    }

    init() {
        super.init();
        const recents = this.getAttribute('recents', true);
        const folders = this.getAttribute('folders', true);
        this.setData({ recents, folders });
    }

    render() {
        return (
            <i-panel
                width={'100%'}
                minHeight={'inherit'}
            >
                <i-vstack
                    id="mobileMain"
                    gap="1.5rem"
                    width={'100%'}
                    padding={{ top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}
                >
                    <i-vstack gap="1.25rem">
                        <i-label caption='Your storage' font={{ size: '1.5rem', weight: 600 }}></i-label>
                        <i-vstack
                            id={'storageBar'}
                            padding={{ top: '0.75rem', right: '0.75rem', left: '0.75rem', bottom: '0.75rem' }}
                            background={{ color: Theme.colors.primary.main }}
                            border={{ radius: '1rem' }}
                            gap={'0.5rem'}
                            width={'100%'}
                        >
                            <i-label caption="Avaliable space" font={{ color: Theme.colors.primary.contrastText, size: '1rem', weight: 700 }}></i-label>
                            <i-hstack
                                position="relative" verticalAlignment="center"
                                border={{ radius: '1rem' }}
                                height={'1.5rem'}
                                overflow={'hidden'}
                                zIndex={1}
                                background={{ color: Theme.colors.secondary.main }}
                            >
                                <i-panel
                                    id={'pnlMeter'}
                                    class="storage-meter-uploaded"
                                    position="absolute" left={'-2rem'} top={0}
                                    background={{ color: Theme.colors.primary.light }}
                                    border={{ radius: '1rem' }}
                                    width={`calc(max(7.29%, 0.25rem) + 2rem)`}
                                    height={'100%'} zIndex={10}
                                ></i-panel>
                            </i-hstack>
                            <i-hstack
                                class="storage-used"
                                verticalAlignment="center"
                                gap="0.125rem"
                                margin={{ bottom: '0.75rem' }}
                            >
                                <i-label id={'lblUsed'} caption="0" font={{ color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true }}></i-label>
                                <i-label caption="of" font={{ color: Theme.colors.primary.contrastText, size: '0.75rem' }}></i-label>
                                <i-label caption="5 GiB" font={{ color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true }}></i-label>
                                <i-label caption="used" font={{ color: Theme.colors.primary.contrastText, size: '0.75rem' }}></i-label>
                            </i-hstack>
                        </i-vstack>
                    </i-vstack>
                    <i-panel>
                        <i-hstack
                            verticalAlignment='center' horizontalAlignment='space-between'
                            gap="0.5rem" margin={{ bottom: '1.25rem' }}
                        >
                            <i-label caption='All folders' font={{ size: '0.875rem', transform: 'uppercase', weight: 600 }}></i-label>
                            <i-label
                                caption='See All'
                                font={{ size: '0.875rem', color: Theme.colors.primary.main, weight: 500 }}
                                cursor='pointer'
                                onClick={this.onViewFolders}
                            ></i-label>
                        </i-hstack>
                        <i-carousel-slider
                            id="foldersSlider"
                            width={'100%'}
                            slidesToShow={2}
                            indicators={false}
                            swipe={true}
                        />
                    </i-panel>
                    <i-panel>
                        <i-hstack
                            verticalAlignment='center' horizontalAlignment='space-between'
                            gap="0.5rem" margin={{ bottom: '0.75rem' }}
                        >
                            <i-label caption='Recent file' font={{ size: '0.875rem', transform: 'uppercase', weight: 600 }}></i-label>
                            <i-label
                                caption='See All'
                                font={{ size: '0.875rem', color: Theme.colors.primary.main, weight: 500 }}
                                cursor='pointer'
                                onClick={this.onViewFiles}
                            ></i-label>
                        </i-hstack>
                        <i-vstack
                            id="pnlRecent"
                            gap="0.5rem"
                            width={'100%'}
                        ></i-vstack>
                    </i-panel>
                </i-vstack>
                <i-scom-ipfs--mobile-folder
                    id="mobileFolder"
                    width={'100%'}
                    minHeight={'100%'}
                    display='block'
                    visible={false}
                    onFetchData={this.onFetchData.bind(this)}
                    onClose={this.onBack.bind(this)}
                ></i-scom-ipfs--mobile-folder>
            </i-panel>
        )
    }
}
