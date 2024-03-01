import {
    Container,
    Control,
    ControlElement,
    customElements,
    GridLayout,
    Icon,
    Input,
    Label,
    Module,
    Panel,
    Styles,
} from '@ijstech/components';
import { formatBytes } from '../data';
import { FileType, IIPFSData } from '../interface';
import { ScomIPFSPath } from './path';
import { backgroundStyle, transitionStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

type callbackType = (data: IIPFSData) => Promise<IIPFSData>;
interface ScomIPFSFolderElement extends ControlElement {
    data?: IFolderData;
    onFetchData?: callbackType;
    onClose?: () => void;
    onItemClicked?: (data: IIPFSData) => void;
}

type IMode = 'grid' | 'list';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-ipfs--mobile-folder']: ScomIPFSFolderElement;
        }
    }
}

interface IFolderData {
    list?: IIPFSData[];
    title?: string;
    type: FileType;
}

@customElements('i-scom-ipfs--mobile-folder')
export class ScomIPFSFolder extends Module {
    private pnlFolders: GridLayout;
    private iconSort: Icon;
    private lblTitle: Label;
    private pnlPath: ScomIPFSPath;
    private iconBack: Icon;
    private inputSearch: Input;
    private pnlSearch: Panel;
    private iconList: Icon;

    private _data: IFolderData;
    private mode: IMode = 'list';
    private searchTimer: any;
    private sortMapping: { [idx: string]: 'asc' | 'desc' } = {};
    private pathMapping: Record<string, IIPFSData> = {};
    private _currentPath: string;

    onFetchData: callbackType;
    onClose: () => void;
    onItemClicked: (data: IIPFSData) => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.onSort = this.onSort.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.onSearchClicked = this.onSearchClicked.bind(this);
        this.onHandleSearch = this.onHandleSearch.bind(this);
    }

    static async create(options?: ScomIPFSFolderElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    get list() {
        return this._data?.list ?? [];
    }
    set list(value: any[]) {
        this._data.list = value ?? [];
    }

    get type() {
        return this._data?.type ?? 'dir';
    }
    set type(value: FileType) {
        this._data.type = value ?? 'dir';
    }

    get title() {
        return this._data?.title ?? '';
    }
    set title(value: string) {
        this._data.title = value ?? '';
    }

    get filteredList() {
        const value = this.inputSearch?.value || '';
        if (!value) return [...this.list];
        return [...this.list].filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
    }

    get isGridMode() {
        return this.mode === 'grid';
    }

    get currentPath() {
        return this._currentPath;
    }

    setData(data: IFolderData) {
        this._data = data;
        const path = this.pnlPath.data.path || '';
        this._currentPath = path;
        const sortData = this.sortMapping[path] ?? 'desc';
        const isDown = sortData === 'desc';
        this.iconSort.name = isDown ? 'angle-up' : 'angle-down';
        const sortFn = (a: IIPFSData, b: IIPFSData) => isDown ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        const folders = [...this.list].filter(item => item.type === 'dir').sort(sortFn);
        const files = [...this.list].filter(item => item.type === 'file').sort(sortFn);
        if (isDown) {
            this.list = [...folders, ...files];
        } else {
            this.list = [...files, ...folders];
        }
        this.renderUI();
    }

    clear() {
        this.pnlPath.clear();
        this.pathMapping = {};
    }

    updatePath(data: IIPFSData) {
        if (data.path != null) this.pathMapping[data.path] = data;
        this.pnlPath.setData(data);
    }

    private renderUI() {
        this.inputSearch.width = '0%';
        this.pnlSearch.width = '2rem';
        this.inputSearch.value = '';
        const defaultTitle = this.type === 'dir' ? 'All Folders' : 'All Files';
        this.lblTitle.caption = this.title || defaultTitle;
        this.renderList();
    }

    private async onBreadcrumbClick({ cid, path }: { cid: string; path: string }) {
        let childData;
        if (this.pathMapping[path]) {
            childData = this.pathMapping[path];
        } else {
            childData = await this.onFetchData({ cid, path });
            this.pathMapping[path] = childData;
        }
        const paths: string[] = path.split('/');
        this.iconBack.visible = paths.length > 1;
        this.updatePath(childData);
        this.setData({ list: childData?.links ?? [], type: 'dir' });
    }

    private renderList() {
        this.pnlFolders.templateColumns = this.isGridMode ? ['repeat(2, minmax(0, 1fr))'] : ['minmax(0, 1fr)'];
        this.pnlFolders.gap = this.isGridMode ? { column: '1rem', row: '1.5rem' } : { row: '1.5rem', column: '0px' };
        this.pnlFolders.clearInnerHTML();
        if (this.filteredList?.length) {
            const direction = this.isGridMode ? 'vertical' : 'horizontal';
            const align = this.isGridMode ? 'start' : 'center';
            const gap = this.isGridMode ? '0.5rem' : '1.5rem';
            const padding = this.isGridMode ?
                { top: '0.5rem', bottom: '0.5rem', right: '0.5rem', left: '0.5rem' } :
                { top: '0px', bottom: '0px', right: '0px', left: '0px' };
            for (let nodeData of this.filteredList) {
                const isDir = nodeData.type === 'dir';
                const nodeEl = (
                    <i-stack
                        direction={direction}
                        alignItems={align}
                        gap={gap}
                        padding={padding}
                        cursor='pointer'
                        class={this.isGridMode ? backgroundStyle : ''}
                        onClick={() => this.onFolderClick(nodeData)}
                    >
                        <i-icon
                            stack={{ grow: '0', shrink: '0' }}
                            name={isDir ? 'folder' : 'file'}
                            fill={isDir ? Theme.colors.warning.main : Theme.colors.info.main}
                            width={'2.5rem'} height={'2.5rem'}
                        ></i-icon>
                        <i-vstack width="100%" minWidth={0} gap={'0.5rem'}>
                            <i-label caption={nodeData.name} font={{ weight: 600, size: '1.125rem' }} textOverflow='ellipsis'></i-label>
                            <i-hstack
                                verticalAlignment='center'
                                gap={'0.5rem'}
                            >
                                {/* <i-label caption={`${nodeData.links?.length || 0} files`} opacity={0.5} font={{ size: '0.675rem' }} visible={isDir}></i-label>
                                <i-panel width={1} height={'0.75rem'} background={{ color: Theme.divider }} visible={isDir}></i-panel> */}
                                <i-label caption={`${formatBytes(nodeData.size)}`} opacity={0.5} font={{ size: '0.675rem' }}></i-label>
                            </i-hstack>
                        </i-vstack>
                    </i-stack>
                )
                this.pnlFolders.append(nodeEl);
            }
        }
    }

    async handleFolderClick(data: IIPFSData) {
        let childData;
        if (this.pathMapping[data.path]) {
            childData = this.pathMapping[data.path];
        } else {
            childData = await this.onFetchData(data);
            this.pathMapping[data.path] = childData;
        }
        if (!childData.name && data.name) childData.name = data.name;
        this.updatePath(childData);
        this.setData({ list: childData?.links ?? [], type: 'dir' });
        this.iconBack.visible = true;
    }

    private async onFolderClick(data: IIPFSData) {
        if (this.onItemClicked) this.onItemClicked(data);
        if (data.type === 'file') return;
        await this.handleFolderClick(data);
    }

    private onSort(target: Control) {
        const path = this.pnlPath.data.path || 'main';
        const oldSort = this.sortMapping[path] ?? 'desc';
        const currentSort = oldSort === 'desc' ? 'asc' : 'desc';
        this.iconSort.name = currentSort === 'desc' ? 'angle-up' : 'angle-down';
        this.list.reverse();
        this.sortMapping[path] = currentSort;
        this.renderList();
    }

    private onChangeMode(target: Control) {
        this.mode = this.isGridMode ? 'list' : 'grid';
        this.iconList.name = this.isGridMode ? 'list' : 'th-large';
        this.renderList();
    }

    private goBack() {
        const paths: string[] = this._currentPath?.split('/');
        paths.pop();
        const prevPath = paths?.join('/');
        if (prevPath != null && this.pathMapping[prevPath]) {
            const data = this.pathMapping[prevPath];
            this.updatePath(data);
            this.setData({ list: data?.links ?? [], type: 'dir' });
        } else {
            // if (this.onClose) this.onClose();
            // this.pnlPath.clear();
            // this.pathMapping = {};
        }
        this.iconBack.visible = paths.length > 1;
    }

    private onSearchClicked() {
        if (Number(this.pnlSearch.width) > 32) {
            this.inputSearch.width = '0%';
            this.pnlSearch.width = '2rem';
        } else {
            this.pnlSearch.width = '100%';
            this.inputSearch.width = '100%';
            this.inputSearch.focus();
        }
    }

    private onHandleSearch() {
        if (this.searchTimer) clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            this.renderList();
        }, 500);
    }

    init() {
        super.init();
        this.onFetchData = this.getAttribute('onFetchData', true) || this.onFetchData;
        this.onClose = this.getAttribute('onClose', true) || this.onClose;
        this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
        const data = this.getAttribute('data', true);
        if (data) this.setData(data);
    }

    render() {
        return (
            <i-vstack
                gap="1.25rem"
                width={'100%'}
                minHeight={'inherit'}
                background={{ color: Theme.colors.primary.main }}
                padding={{ top: '1.25rem' }}
            >
                <i-hstack
                    verticalAlignment='center' horizontalAlignment='space-between'
                    padding={{ left: '1.25rem', right: '1.25rem' }}
                    gap="1rem"
                >
                    <i-icon
                        id="iconBack"
                        width={'1.25rem'} height={'1.25rem'}
                        name="arrow-left"
                        fill={Theme.colors.primary.contrastText}
                        cursor='pointer'
                        onClick={this.goBack.bind(this)}
                        visible={false}
                    ></i-icon>
                    <i-hstack
                        id="pnlSearch"
                        verticalAlignment='center'
                        horizontalAlignment='end'
                        gap="0.5rem"
                        border={{ radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider }}
                        padding={{ left: '0.5rem', right: '0.5rem' }}
                        margin={{ left: 'auto' }}
                        height={'2rem'}
                        width={'2rem'}
                        position='relative'
                        overflow={'hidden'}
                        class={transitionStyle}
                        cursor='pointer'
                        background={{ color: Theme.input.background }}
                    >
                        <i-input
                            id="inputSearch"
                            height="100%"
                            width={'0px'}
                            background={{ color: 'transparent' }}
                            border={{ style: 'none', radius: '0.5rem 0 0.5rem 0' }}
                            onKeyUp={this.onHandleSearch}
                            margin={{ right: '2rem' }}
                        ></i-input>
                        <i-icon
                            width={'2rem'} height={'2rem'}
                            position='absolute'
                            right={'0px'}
                            name="search"
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            stack={{ grow: '0', shrink: '0' }}
                            fill={Theme.colors.primary.contrastText}
                            onClick={this.onSearchClicked}
                        ></i-icon>
                    </i-hstack>
                </i-hstack>
                <i-panel
                    padding={{ left: '1.25rem', right: '1.25rem' }}
                    visible={false}
                >
                    <i-label
                        id="lblTitle"
                        caption='All Folders'
                        font={{ weight: 600, size: '1.25rem', color: Theme.colors.primary.contrastText }}
                    ></i-label>
                </i-panel>
                <i-vstack
                    width={'100%'}
                    border={{ radius: '1.25rem 1.25rem 0 0' }}
                    padding={{ top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}
                    margin={{ bottom: '-1px' }}
                    background={{ color: Theme.background.main }}
                    stack={{ grow: '1' }}
                >
                    <i-hstack
                        verticalAlignment='center'
                        horizontalAlignment='space-between'
                        gap={'0.5rem'}
                        margin={{ bottom: '1rem' }}
                    >
                        <i-hstack
                            verticalAlignment='center'
                            horizontalAlignment='space-between'
                            gap="0.5rem"
                            cursor='pointer'
                            onClick={this.onSort}
                        >
                            <i-label caption='Name' font={{ size: '0.875rem', weight: 500 }}></i-label>
                            <i-icon id="iconSort" name="angle-up" width={'0.75rem'} height={'0.75rem'} fill={Theme.text.primary}></i-icon>
                        </i-hstack>
                        <i-panel
                            cursor='pointer'
                            opacity={0.5}
                            hover={{ opacity: 1 }}
                            onClick={this.onChangeMode}
                        >
                            <i-icon
                                id="iconList"
                                name="th-large"
                                width={'1rem'} height={'1rem'}
                                fill={Theme.text.primary}
                            ></i-icon>
                        </i-panel>
                    </i-hstack>
                    <i-scom-ipfs--path
                        id="pnlPath"
                        display='flex'
                        width={'100%'}
                        margin={{ bottom: 10 }}
                        isMobileView={true}
                        onItemClicked={this.onBreadcrumbClick}
                    />
                    <i-grid-layout
                        id="pnlFolders"
                        width={'100%'}
                        stack={{ grow: '1' }}
                        templateColumns={['minmax(0, 1fr)']}
                    ></i-grid-layout>
                </i-vstack>
            </i-vstack>
        )
    }
}