/// <amd-module name="@scom/scom-storage/interface.ts" />
declare module "@scom/scom-storage/interface.ts" {
    import { IPFS } from '@ijstech/components';
    export interface IIPFSData {
        cid: string;
        name?: string;
        size?: number;
        type?: string | 'dir' | 'file';
        links?: IIPFSData[];
        path?: string;
        sort?: 'asc' | 'desc';
        root?: boolean;
    }
    export interface ITableData extends IIPFSData {
        checkbox: string;
        blank: string;
    }
    export type FileType = 'dir' | 'file';
    export interface IStorageConfig {
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
    }
    export interface IPreview extends IIPFSData {
        transportEndpoint?: string;
        parentCid?: string;
    }
}
/// <amd-module name="@scom/scom-storage/data.ts" />
declare module "@scom/scom-storage/data.ts" {
    export const formatBytes: (bytes: any, decimals?: number) => string;
}
/// <amd-module name="@scom/scom-storage/assets.ts" />
declare module "@scom/scom-storage/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-storage/components/index.css.ts" />
declare module "@scom/scom-storage/components/index.css.ts" {
    export const backgroundStyle: string;
    export const transitionStyle: string;
    export const addressPanelStyle: string;
    export const customLinkStyle: string;
    export const uploadModalStyle: string;
}
/// <amd-module name="@scom/scom-storage/components/path.tsx" />
declare module "@scom/scom-storage/components/path.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IIPFSData } from "@scom/scom-storage/interface.ts";
    interface ScomIPFSPathElement extends ControlElement {
        data?: IIPFSData;
        onItemClicked?: (data: IIPFSData) => void;
        isMobileView?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--path']: ScomIPFSPathElement;
            }
        }
    }
    export class ScomIPFSPath extends Module {
        private pnlAddress;
        private breadcrumb;
        private _data;
        private _isMobileView;
        onItemClicked: (data: IIPFSData) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSPathElement, parent?: Container): Promise<ScomIPFSPath>;
        get data(): IIPFSData;
        set data(value: IIPFSData);
        get isMobileView(): boolean;
        set isMobileView(value: boolean);
        setData(value: IIPFSData): void;
        clear(): void;
        private onUpdateBreadcumbs;
        private onBreadcrumbClick;
        private splitPath;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/folder.tsx" />
declare module "@scom/scom-storage/components/folder.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { FileType, IIPFSData } from "@scom/scom-storage/interface.ts";
    type callbackType = (data: IIPFSData) => Promise<IIPFSData>;
    interface ScomIPFSFolderElement extends ControlElement {
        data?: IFolderData;
        onFetchData?: callbackType;
        onClose?: () => void;
        onItemClicked?: (data: IIPFSData) => void;
    }
    global {
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
    export class ScomIPFSFolder extends Module {
        private pnlFolders;
        private iconSort;
        private lblTitle;
        private pnlPath;
        private iconBack;
        private inputSearch;
        private pnlSearch;
        private iconList;
        private _data;
        private mode;
        private searchTimer;
        private sortMapping;
        private pathMapping;
        private _currentPath;
        onFetchData: callbackType;
        onClose: () => void;
        onItemClicked: (data: IIPFSData) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSFolderElement, parent?: Container): Promise<ScomIPFSFolder>;
        get list(): any[];
        set list(value: any[]);
        get type(): FileType;
        set type(value: FileType);
        get title(): string;
        set title(value: string);
        get filteredList(): any[];
        get isGridMode(): boolean;
        get currentPath(): string;
        setData(data: IFolderData): void;
        clear(): void;
        updatePath(data: IIPFSData): void;
        private renderUI;
        private onBreadcrumbClick;
        private renderList;
        handleFolderClick(data: IIPFSData): Promise<void>;
        private onFolderClick;
        private onSort;
        private onChangeMode;
        private goBack;
        private onSearchClicked;
        private onHandleSearch;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/home.tsx" />
declare module "@scom/scom-storage/components/home.tsx" {
    import { Container, ControlElement, Module, IPFS } from '@ijstech/components';
    import { IIPFSData, IPreview } from "@scom/scom-storage/interface.ts";
    type previewCallback = (data: IPreview) => void;
    interface ScomIPFSMobileHomeElement extends ControlElement {
        recents?: IIPFSData[];
        folders?: IIPFSData[];
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
        onPreview?: previewCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--mobile-home']: ScomIPFSMobileHomeElement;
            }
        }
    }
    interface IHomeData {
        recents?: IIPFSData[];
        folders?: IIPFSData[];
        parentNode?: IIPFSData;
    }
    export class ScomIPFSMobileHome extends Module {
        private mobileFolder;
        private _manager;
        private _data;
        private _transportEndpoint;
        private _signer;
        private _currentCid;
        onPreview: previewCallback;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSMobileHomeElement, parent?: Container): Promise<ScomIPFSMobileHome>;
        get recents(): any[];
        set recents(value: any[]);
        get folders(): any[];
        set folders(value: any[]);
        get transportEndpoint(): string;
        set transportEndpoint(value: string);
        get manager(): IPFS.FileManager;
        get currentPath(): string;
        get currentCid(): string;
        setData(data: IHomeData): Promise<void>;
        private onFetchData;
        private onItemClicked;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/uploadModal.tsx" />
declare module "@scom/scom-storage/components/uploadModal.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    interface ICidInfo {
        cid: string;
        links?: ICidInfo[];
        name?: string;
        size: number;
        type?: 'dir' | 'file';
    }
    type UploadedCallback = (target: ScomIPFSUploadModal, rootCid: string) => void;
    interface ScomIPFSUploadModalElement extends ControlElement {
        rootCid?: string;
        parentDir?: Partial<ICidInfo>;
        onUploaded?: UploadedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--upload-modal']: ScomIPFSUploadModalElement;
            }
        }
    }
    export interface IIPFSItem {
        cid: string;
        name: string;
        size: number;
        type: 'dir' | 'file';
        links?: IIPFSItem[];
    }
    export interface IUploadResult {
        success: boolean;
        error?: string;
        data?: IIPFSItem;
    }
    export class ScomIPFSUploadModal extends Module {
        private fileUploader;
        private imgFile;
        private lblDrag;
        private pnlStatusFilter;
        private pnlFilterBar;
        private pnlFilterActions;
        private pnlFileList;
        private btnUpload;
        private pnlNote;
        private pnlPagination;
        private _rootCid;
        private _parentDir;
        onUploaded: UploadedCallback;
        private isForcedCancelled;
        private currentRequest;
        private currentPage;
        private currentFilterStatus;
        private files;
        private fileListData;
        private _manager;
        private folderPath;
        constructor(parent?: Container, options?: any);
        get rootCid(): string;
        set rootCid(value: string);
        get parentDir(): Partial<ICidInfo>;
        set parentDir(value: Partial<ICidInfo>);
        get manager(): any;
        set manager(value: any);
        show(path: string): void;
        refresh(): void;
        private onBeforeDrop;
        private onBeforeUpload;
        private filteredFileListData;
        private numPages;
        private setCurrentPage;
        private get isSmallWidth();
        private renderFilterBar;
        private renderFileList;
        private formatBytes;
        private renderStatus;
        private getPagination;
        private renderPagination;
        private onChangeCurrentFilterStatus;
        private onClear;
        private onCancel;
        private onChangeFile;
        private updateBtnCaption;
        private onRemove;
        private onRemoveFile;
        private getDirItems;
        private onUpload;
        reset(): void;
        private toggle;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/utils.ts" />
declare module "@scom/scom-storage/utils.ts" {
    import { Control } from "@ijstech/components";
    export const getEmbedElement: (moduleData: any, parent: Control, callback?: any) => Promise<any>;
}
/// <amd-module name="@scom/scom-storage/components/editor.tsx" />
declare module "@scom/scom-storage/components/editor.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    interface IEditor {
        content?: string;
    }
    interface ScomIPFSEditorElement extends ControlElement {
        data?: IEditor;
        onClose?: () => void;
        onChanged?: (content: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--editor']: ScomIPFSEditorElement;
            }
        }
    }
    export class ScomIPFSEditor extends Module {
        private pnlEditor;
        private editorEl;
        private _data;
        onClose: () => void;
        onChanged: (content: string) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSEditorElement, parent?: Container): Promise<ScomIPFSEditor>;
        get data(): IEditor;
        set data(value: IEditor);
        setData(value: IEditor): void;
        private renderUI;
        private createTextEditorElement;
        private onCancel;
        private onSubmit;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/preview.tsx" />
declare module "@scom/scom-storage/components/preview.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IPreview } from "@scom/scom-storage/interface.ts";
    type fileChangedCallback = (filePath: string, content: string) => void;
    interface ScomIPFSPreviewElement extends ControlElement {
        data?: IPreview;
        onClose?: () => void;
        onOpenEditor?: () => void;
        onCloseEditor?: () => void;
        onFileChanged?: fileChangedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--preview']: ScomIPFSPreviewElement;
            }
        }
    }
    export class ScomIPFSPreview extends Module {
        private previewer;
        private lblName;
        private lblSize;
        private pnlEdit;
        private previewerPanel;
        private editorPanel;
        private editor;
        private _data;
        private currentContent;
        onClose: () => void;
        onOpenEditor: () => void;
        onCloseEditor: () => void;
        onFileChanged: fileChangedCallback;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSPreviewElement, parent?: Container): Promise<ScomIPFSPreview>;
        get data(): IPreview;
        set data(value: IPreview);
        get transportEndpoint(): string;
        set transportEndpoint(value: string);
        setData(value: IPreview): void;
        clear(): void;
        private renderUI;
        private renderFileInfo;
        private previewFile;
        private getModuleFromExtension;
        private appendLabel;
        private renderFilePreview;
        private createTextElement;
        private createImageElement;
        private createVideoElement;
        private createPlayerElement;
        private closePreview;
        private downloadFile;
        private onEditClicked;
        private closeEditor;
        private onChanged;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/index.ts" />
declare module "@scom/scom-storage/components/index.ts" {
    export { ScomIPFSMobileHome } from "@scom/scom-storage/components/home.tsx";
    export { ScomIPFSPath } from "@scom/scom-storage/components/path.tsx";
    export { ScomIPFSUploadModal } from "@scom/scom-storage/components/uploadModal.tsx";
    export { ScomIPFSEditor } from "@scom/scom-storage/components/editor.tsx";
    export { ScomIPFSPreview } from "@scom/scom-storage/components/preview.tsx";
}
/// <amd-module name="@scom/scom-storage/index.css.ts" />
declare module "@scom/scom-storage/index.css.ts" {
    const _default_1: string;
    export default _default_1;
    export const previewModalStyle: string;
    export const dragAreaStyle: string;
}
/// <amd-module name="@scom/scom-storage" />
declare module "@scom/scom-storage" {
    import { Module, ControlElement, IDataSchema, IPFS } from '@ijstech/components';
    import { IIPFSData } from "@scom/scom-storage/interface.ts";
    interface ScomStorageElement extends ControlElement {
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
        baseUrl?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-storage']: ScomStorageElement;
            }
        }
    }
    export class ScomStorage extends Module {
        private pnlPath;
        private uploadedFileTree;
        private mobileHome;
        private iePreview;
        private pnlPreview;
        private uploadModal;
        private ieContent;
        private ieSidebar;
        private btnUpload;
        tag: any;
        private _data;
        private pnlFileTable;
        private pnlUploadTo;
        private lblDestinationFolder;
        private pnlUploadMsg;
        private lblUploadMsg;
        private fileTable;
        private filesColumns;
        private columns;
        private _uploadedTreeData;
        private _uploadedFileNodes;
        private transportEndpoint;
        private signer;
        private currentCid;
        private rootCid;
        private _baseUrl;
        private manager;
        private counter;
        get baseUrl(): string;
        set baseUrl(url: string);
        private setData;
        private getData;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: IDataSchema;
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private getPropertiesSchema;
        private _getActions;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private updateUrlPath;
        private initContent;
        private constructLinks;
        private renderUI;
        renderUploadedFileTreeUI(needReset?: boolean, path?: string): Promise<void>;
        addUploadedFileNode(nodeData: IIPFSData, path?: string): Promise<void>;
        private onUpdateContent;
        private onUpdateBreadcumbs;
        private onFilesUploaded;
        private onOpenUploadModal;
        private onActiveChange;
        private onOpenFolder;
        private onFetchData;
        private processTableData;
        private onCellClick;
        private previewFile;
        private closePreview;
        private openEditor;
        private closeEditor;
        private onSubmit;
        private onBreadcrumbClick;
        private getDestinationFolder;
        private handleOnDragEnter;
        private handleOnDragOver;
        private handleOnDragLeave;
        private handleOnDrop;
        private readAllDirectoryEntries;
        private readEntriesPromise;
        private readEntryContentAsync;
        private getAllFileEntries;
        init(): void;
        render(): any;
    }
}
