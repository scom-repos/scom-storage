import {
    Module,
    Styles,
    FormatUtils,
    Table,
    Control,
    TreeNode,
    TreeView,
    customElements,
    ControlElement,
    IDataSchema,
} from '@ijstech/components';
import { IIPFSData, IStorageConfig, ITableData } from './interface';
import { autoRetryGetContent, fetchData, formatBytes } from './data';
import { ScomIPFSMobileHome, ScomIPFSPath, ScomIPFSUploadModal } from './components';
import customStyles from './index.css';

declare var require: any
const IPFSUtils = require('@ijstech/ipfs');

const Theme = Styles.Theme.ThemeVars;

const defaultColors = {
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

interface ScomStorageElement extends ControlElement {
    cid?: string;
    transportEndpoint?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-storage']: ScomStorageElement;
        }
    }
}

@customElements('i-scom-storage')
export class ScomStorage extends Module {
    private pnlPath: ScomIPFSPath;
    private uploadedFileTree: TreeView;
    private mobileHome: ScomIPFSMobileHome;
    private uploadModal: ScomIPFSUploadModal;

    tag: any = {
        light: {},
        dark: {}
    }
    private _data: IStorageConfig = { cid: '' }; 
    private fileTable: Table;
    private filesColumns = [
        {
            title: '',
            fieldName: 'checkbox'
        },
        {
            title: 'Name',
            fieldName: 'name',
            onRenderCell: (source: Control, columnData: any, rowData: any) => {
                switch (rowData.type) {
                    case 'dir':
                        return (
                            <i-hstack verticalAlignment="center" gap="0.375rem">
                                <i-panel stack={{ basis: '1rem' }}>
                                    <i-icon name="folder" width={'0.875rem'} height={'0.875rem'} display="inline-flex" fill="#fddd35"></i-icon>
                                </i-panel>
                                <i-label caption={columnData} font={{ size: '0.875rem' }}></i-label>
                            </i-hstack>
                        );
                    case 'file':
                        return (
                            <i-hstack verticalAlignment="center" gap="0.375rem">
                                <i-panel stack={{ basis: '1rem' }}>
                                    <i-icon name="file" width={'0.875rem'} height={'0.875rem'} display="inline-flex" fill="#298de0"></i-icon>
                                </i-panel>
                                <i-label caption={columnData} font={{ size: '0.875rem' }}></i-label>
                            </i-hstack>
                        );
                    default:
                        return columnData;
                }
            },
        },
        {
            title: 'CID',
            fieldName: 'cid',
            background: { color: '#f8f9fa' }
        },
        {
            title: 'Type',
            fieldName: 'type',
            onRenderCell: (source: Control, columnData: any, rowData: any) => {
                switch (rowData.type) {
                    case 'dir':
                        return 'File folder';
                    case 'file':
                        return 'File';
                    default:
                        return columnData;
                }
            },
        },
        {
            title: 'Size',
            fieldName: 'size',
            onRenderCell: (source: Control, columnData: any, rowData: any) => {
                return formatBytes(columnData);
            },
        },
        {
            title: '',
            fieldName: 'blank',
        },
    ];
    private columns: any[] = this.filesColumns.slice();
    private _uploadedTreeData: any = [];
    private _uploadedFileNodes: { [idx: string]: TreeNode } = {};
    private currentParentDir: { cid: string; name: string } | null = null;
    private breadcrumb: { [idx: string]: IIPFSData } = {};
    private transportEndpoint: string;
    private manager: any;

    private async setData(value: IStorageConfig) {
        this._data = value;
        await this.initContent();
    }

    private getData() {
        return this._data;
    }

    getConfigurators() {
      return [
        {
          name: 'Builder Configurator',
          target: 'Builders',
          getActions: () => {
            return this._getActions();
          },
          getData: this.getData.bind(this),
          setData: this.setData.bind(this),
          getTag: this.getTag.bind(this),
          setTag: this.setTag.bind(this)
        }
      ]
    }
  
    private getPropertiesSchema() {
      const schema: IDataSchema = {
        type: "object",
        required: ["cid"],
        properties: {
            cid: {
            type: "string"
          }
        }
      };
      return schema;
    }
  
    private _getActions() {
      const propertiesSchema = this.getPropertiesSchema();
      const actions = [
        {
          name: 'Edit',
          icon: 'edit',
          command: (builder: any, userInputData: any) => {
            let oldData = {cid: ''};
            return {
              execute: () => {
                oldData = {...this._data};
                if (userInputData?.cid) this._data.cid = userInputData.cid;
                this.initContent();
                if (builder?.setData) builder.setData(this._data);
              },
              undo: () => {
                this._data = {...oldData};
                this.initContent();
                if (builder?.setData) builder.setData(this._data);
              },
              redo: () => {}
            }
          },
          userInputDataSchema: propertiesSchema as IDataSchema
        }
      ]
      return actions
    }

    private getTag() {
      return this.tag;
    }

    private updateTag(type: 'light' | 'dark', value: any) {
        this.tag[type] = this.tag[type] ?? {};
        for (let prop in value) {
            if (value.hasOwnProperty(prop))
                this.tag[type][prop] = value[prop];
        }
    }

    private async setTag(value: any) {
        const newValue = value || {};
        for (let prop in newValue) {
            if (newValue.hasOwnProperty(prop)) {
                if (prop === 'light' || prop === 'dark')
                    this.updateTag(prop, newValue[prop]);
                else
                    this.tag[prop] = newValue[prop];
            }
        }
        this.updateTheme();
    }

    private updateStyle(name: string, value: any) {
        value ?
            this.style.setProperty(name, value) :
            this.style.removeProperty(name);
    }

    private updateTheme() {
        const themeVar = document.body.style.getPropertyValue('--theme') || 'dark';
        this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
        this.updateStyle('--text-secondary', this.tag[themeVar]?.secondaryColor);
        this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
        this.updateStyle('--colors-primary-main', this.tag[themeVar]?.primaryColor);
        this.updateStyle('--colors-primary-light', this.tag[themeVar]?.primaryLightColor);
        this.updateStyle('--colors-primary-dark', this.tag[themeVar]?.primaryDarkColor);
        this.updateStyle('--colors-secondary-light', this.tag[themeVar]?.secondaryLight);
        this.updateStyle('--colors-secondary-main', this.tag[themeVar]?.secondaryMain);
        this.updateStyle('--divider', this.tag[themeVar]?.borderColor);
        this.updateStyle('--action-selected', this.tag[themeVar]?.selected);
        this.updateStyle('--action-selected_background', this.tag[themeVar]?.selectedBackground);
        this.updateStyle('--action-hover_background', this.tag[themeVar]?.hoverBackground);
        this.updateStyle('--action-hover', this.tag[themeVar]?.hover);
    }

    private async initContent() {
        if (!this._data.cid) return;
        let rootNode = await this.manager.getRootNode();
        const ipfsData = rootNode._cidInfo;
        // const ipfsData = await fetchData({ cid: this._data.cid });
        // this._storedFileData = null;
        if (ipfsData) {
            const parentNode = (({ links, ...o }) => o)(ipfsData);
            parentNode.name = parentNode.name ? parentNode.name : FormatUtils.truncateWalletAddress(parentNode.cid);
            parentNode.path = '';
            parentNode.root = true;
            if (ipfsData.links?.length) {
                await Promise.all(
                    ipfsData.links.map(async (data) => {
                        data.path = `${parentNode.path}/${data.name}`;
                        if (!data.type) {
                            let node = await this.manager.getFileNode(`/${data.name}`);
                            let isFolder = await node.isFolder();
                            data.type = isFolder ? 'dir' : 'file'
                        }
                    })
                );
            }
            const data = ipfsData.links ? [parentNode, ...ipfsData.links] : [parentNode];
            this._uploadedTreeData = [...data];
            this.renderUploadedFileTreeUI();
            this.breadcrumb[parentNode.path] = parentNode;
            this.fileTable.data = this.processTableData(ipfsData);
            // this.mobileFolder.setData({ list: ipfsData.links ?? [] });
            this.mobileHome.setData({
                recents: [...ipfsData.links].filter(item => item.type === 'file'),
                folders: ipfsData.links ?? [],
                parentNode: parentNode
            })

            if (parentNode.name)
                this.pnlPath.setData(parentNode);
        }
    }

    async renderUploadedFileTreeUI(needReset = true) {
        if (needReset) {
            this.uploadedFileTree.clear();
            this._uploadedFileNodes = {};
        }

        for (let nodeData of this._uploadedTreeData) {
            await this.addUploadedFileNode(nodeData);
        }
    }

    async addUploadedFileNode(nodeData: IIPFSData) {
        const name = nodeData.name;
        let idx: string = '';
        let items = nodeData.path?.split('/') ?? [];
        let node: TreeNode | null = null;
        let self = this;

        for (let i = 0; i < items.length; i++) {
            if (items[i] != null) {
                idx = idx + '/' + items[i];
                if (!self._uploadedFileNodes[idx] && nodeData.type === 'dir') {
                    node = self.uploadedFileTree.add(node, name);
                    self._uploadedFileNodes[idx] = node;
                    node.tag = nodeData;
                    node.height = '2.125rem';
                    node.icon.margin = { left: '0.388rem' };
                    node.icon.name = 'chevron-circle-right';
                    node.icon.fill = Theme.colors.primary.light;
                    node.icon.visible = true;
                    node.icon.display = 'inline-flex';
                    if (nodeData.root) node.active = true;
                } else {
                    node = self._uploadedFileNodes[idx];
                    if (node && node.tag && idx === `/${nodeData.path}`) node.tag.cid = nodeData.cid;
                }

                if (node && nodeData.root) node.expanded = true;
            }
        }
    }

    private async onUpdateContent({ data, toggle }: { data: IIPFSData; toggle: boolean }) {
        if (data) {
            const fileNodes = this._uploadedFileNodes;

            for (const [idx, node] of Object.entries(fileNodes)) {
                if (node.tag && data.path === node.tag.path) {
                    this.uploadedFileTree.activeItem = node;

                    const parentNode = (({ links, ...o }) => o)(data);
                    parentNode.name = parentNode.name ? parentNode.name : parentNode.cid;
                    parentNode.path = `${node.tag.path}`;

                    this.onUpdateBreadcumbs(parentNode);

                    data.links.map((child) => (child.path = `${parentNode.path}/${child.name}`));
                    const processedData = [...data.links];

                    for (let nodeData of processedData) {
                        await this.addUploadedFileNode(nodeData);
                    }

                    !!toggle ? (node.expanded = !node.expanded) : (node.expanded = true);
                    break;
                }
            }
        }
    }

    private onUpdateBreadcumbs(node: IIPFSData) {
        this.pnlPath.setData(node);
    }

    private onOpenUploadModal() {
        if (!this.uploadModal) this.uploadModal = new ScomIPFSUploadModal();
        const modal = this.uploadModal.openModal({
            width: 800,
            maxWidth: '100%',
            popupPlacement: 'center',
            showBackdrop: true,
            closeOnBackdropClick: false,
            closeIcon: { name: 'times', fill: Theme.text.primary, position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 },
            zIndex: 1000,
            padding: {},
            onClose: () => this.uploadModal.reset(),
            mediaQueries: [
                {
                    maxWidth: '767px',
                    properties: {
                        height: '100vh',
                        maxHeight: '100vh'
                    }
                }
            ]
        });
        let path;
        if (window.matchMedia('(max-width: 767px)').matches) {
            path = this.mobileHome.currentPath;
            this.uploadModal.manager = this.mobileHome.manager;
        } else {
            path = this.pnlPath.data.path;
            this.uploadModal.manager = this.manager;
        }
        this.uploadModal.show(path);
        modal.refresh();
    }

    private async onActiveChange(parent: TreeView, prevNode?: TreeNode) {
        const ipfsData = parent.activeItem?.tag;
        await this.onOpenFolder(ipfsData, true);
    }

    private async onOpenFolder(ipfsData: any, toggle: boolean) {
        if (ipfsData) {
            this.currentParentDir = ipfsData;
            const childrenData = await this.onFetchData(ipfsData);
            if (!childrenData.name && ipfsData.name) childrenData.name = ipfsData.name;
            this.onUpdateContent({ data: { ...childrenData }, toggle });
            if (childrenData.links) childrenData.links.map((child) => (child.path = `${ipfsData.path}/${child.name}`));
            this.fileTable.data = this.processTableData({ ...childrenData });
        }
    }

    private async onFetchData(ipfsData: any) {
        let fileNode;
        if (ipfsData.path) {
            fileNode = await this.manager.getFileNode(ipfsData.path);
        } else {
            fileNode = await this.manager.setRootCid(this._data.cid);
        }
        if (!fileNode._cidInfo.links) fileNode._cidInfo.links = [];
        if (fileNode._cidInfo.links.length) {
            await Promise.all(
                fileNode._cidInfo.links.map(async (data) => {
                    data.path = `${ipfsData.path}/${data.name}`;
                    if (!data.type) {
                        let node = await this.manager.getFileNode(`/${data.name}`);
                        let isFolder = await node.isFolder();
                        data.type = isFolder ? 'dir' : 'file'
                    }
                })
            );
        }
        fileNode._cidInfo.path = ipfsData.path;
        return fileNode._cidInfo;
    }

    private processTableData(ipfsData: IIPFSData) {
        const processedData = [];
        if (ipfsData && ipfsData.links && ipfsData.links.length) {
            const sortFn = (a: IIPFSData, b: IIPFSData) => a.name.localeCompare(b.name);
            const folders = [...ipfsData.links].filter(item => item.type === 'dir').sort(sortFn);
            const files = [...ipfsData.links].filter(item => item.type === 'file').sort(sortFn);
            [...folders, ...files].forEach((data) => {
                processedData.push({
                    checkbox: '',
                    name: data.name,
                    cid: data.cid,
                    type: data.type,
                    size: data.size,
                    path: data.path,
                    blank: '',
                });
            });
        }
        return processedData;
    }

    private onCellClick(target: Table, rowIndex: number, columnIdx: number, record: ITableData) {
        if (record.type === 'dir') {
            this.onOpenFolder(record, true);
        }
    }

    private onBreadcrumbClick({ cid, path }: { cid: string; path: string }) {
        if (this.uploadedFileTree.activeItem)
            this.uploadedFileTree.activeItem.expanded = true;
        this.onOpenFolder({ cid, path }, false);
    }

    init() {
        this.transportEndpoint = this.getAttribute('transportEndpoint', true) || window.location.origin;
        super.init();
        this.classList.add(customStyles);
        this.setTag(defaultColors);
        const cid = this.getAttribute('cid', true);
        this.manager = new IPFSUtils.FileManager({
            endpoint: this.transportEndpoint,
            rootCid: cid
        });
        if (cid) this.setData({ cid });
    }

    render() {
        return (
            <i-panel height={'100%'} width={'100%'}>
                <i-scom-ipfs--mobile-home
                    id="mobileHome"
                    width={'100%'}
                    minHeight={'100vh'}
                    display='block'
                    background={{ color: Theme.background.main }}
                    transportEndpoint={this.transportEndpoint}
                    visible={false}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                visible: true
                            }
                        }
                    ]}
                />
                <i-vstack
                    height={'100%'}
                    width={'100%'}
                    overflow={'hidden'}
                    maxHeight={'100vh'}
                    background={{ color: Theme.background.main }}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                visible: false
                            }
                        }
                    ]}
                >
                    <i-panel stack={{ grow: '1', basis: '0%' }} overflow={'hidden'}>
                        <i-grid-layout
                            id={'pnlExplorer'}
                            height={'100%'}
                            overflow={'hidden'}
                            templateColumns={['15rem', '1px', '1fr']}
                            background={{ color: Theme.background.main }}
                            mediaQueries={[
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        templateColumns: ['auto'],
                                        templateRows: ['auto']
                                    }
                                }
                            ]}
                        >
                            <i-vstack id={'ieSidebar'} height={'100%'} overflow={{ y: 'auto' }}>
                                <i-tree-view
                                    id="uploadedFileTree"
                                    class="file-manager-tree uploaded"
                                    onActiveChange={this.onActiveChange}
                                    stack={{ grow: '1' }}
                                    maxHeight={'100%'} overflow={'auto'}
                                ></i-tree-view>
                            </i-vstack>
                            <i-panel
                                width={1} cursor='col-resize'
                                zIndex={15}
                                background={{ color: Theme.colors.secondary.light }}
                                mediaQueries={[
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            visible: false
                                        }
                                    }
                                ]}
                            ></i-panel>
                            <i-vstack id={'ieContent'} height={'100%'} overflow={{ y: 'auto' }}>
                                <i-scom-ipfs--path
                                    id="pnlPath"
                                    display='flex' width={'100%'}
                                    padding={{ left: '1rem', right: '1rem' }}
                                    onItemClicked={this.onBreadcrumbClick}
                                />
                                <i-panel
                                    width={'100%'} height={'auto'}
                                    border={{ radius: 1 }}
                                >
                                    <i-panel
                                        border={{
                                            top: { width: '0.0625rem', style: 'solid', color: 'rgba(117, 122, 155, .15)' }
                                        }}
                                        background={{ color: Theme.colors.primary.contrastText }}
                                    >
                                        <i-table
                                            id="fileTable"
                                            heading={true}
                                            columns={this.columns}
                                            headingStyles={{
                                                font: { size: '0.75rem', weight: 700, color: Theme.text.primary },
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' },
                                                height: '2rem',
                                                background: { color: '#f8f9fa' }
                                            }}
                                            bodyStyles={{
                                                font: { size: '0.75rem', color: Theme.text.primary },
                                                padding: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' },
                                                height: '2.25rem',
                                                cursor: 'pointer'
                                            }}
                                            onCellClick={this.onCellClick}
                                        ></i-table>
                                    </i-panel>
                                </i-panel>
                            </i-vstack>
                        </i-grid-layout>
                    </i-panel>
                </i-vstack>
                <i-button
                    boxShadow='0 10px 25px -5px rgba(44, 179, 240, 0.6)'
                    border={{ radius: '50%' }}
                    background={{ color: Theme.colors.primary.light }}
                    lineHeight={'3.375rem'}
                    width={'3.375rem'} height={'3.375rem'}
                    icon={{ name: 'plus', width: '1.125rem', height: ' 1.125rem', fill: Theme.colors.primary.contrastText }}
                    position='absolute' bottom={'3.125rem'} right={'3.125rem'} zIndex={100}
                    onClick={this.onOpenUploadModal}
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                position: 'fixed',
                                bottom: '4rem',
                                right: '1.25rem'
                            }
                        }
                    ]}
                ></i-button>
            </i-panel>
        )
    }
}
