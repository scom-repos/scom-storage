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
        isModal?: boolean;
        isUploadModal?: boolean;
        cid?: string;
    }
    export interface IPreview extends IIPFSData {
        config?: IStorageConfig;
        parentCid?: string;
    }
    export type EditorType = 'md' | 'designer' | 'widget';
    export interface IEditor {
        url?: string;
        type?: EditorType;
        isFullScreen?: boolean;
        config?: IStorageConfig;
        parentCid?: string;
    }
}
/// <amd-module name="@scom/scom-storage/data.ts" />
declare module "@scom/scom-storage/data.ts" {
    export const formatBytes: (bytes: any, decimals?: number) => string;
    export const getFileContent: (url: string) => Promise<string>;
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
    export const fullScreenStyle: string;
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
/// <amd-module name="@scom/scom-storage/utils.ts" />
declare module "@scom/scom-storage/utils.ts" {
    import { Control, IPFS } from "@ijstech/components";
    export const getEmbedElement: (moduleData: any, parent: Control, callback?: any) => Promise<any>;
    export const getNewFileName: (parentNode: any, fileName: string) => Promise<string>;
    export const isFileExists: (manager: IPFS.FileManager, filePath: string) => Promise<{
        isExists: boolean;
        newFilePath: string;
    }>;
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
    type UploadedCallback = (target: ScomIPFSUploadModal, rootCid: string, filePaths: string[]) => void;
    interface ScomIPFSUploadModalElement extends ControlElement {
        rootCid?: string;
        mulitiple?: boolean;
        parentDir?: Partial<ICidInfo>;
        onUploaded?: UploadedCallback;
        onBrowseFile?: () => void;
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
        private lblTitle;
        private fileUploader;
        private btnBrowseFile;
        private imgFile;
        private lblDrag;
        private pnlBrowse;
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
        onBrowseFile: () => void;
        private isForcedCancelled;
        private currentRequest;
        private currentPage;
        private currentFilterStatus;
        private files;
        private fileListData;
        private _manager;
        private folderPath;
        private _isBrowseButtonShown;
        private _mulitiple;
        constructor(parent?: Container, options?: any);
        get rootCid(): string;
        set rootCid(value: string);
        get parentDir(): Partial<ICidInfo>;
        set parentDir(value: Partial<ICidInfo>);
        get manager(): any;
        set manager(value: any);
        get isBrowseButtonShown(): boolean;
        set isBrowseButtonShown(value: boolean);
        get mulitiple(): boolean;
        set mulitiple(value: boolean);
        private updateUI;
        show(path?: string, files?: File[]): void;
        refresh(): void;
        private onBeforeDrop;
        private onBeforeUpload;
        private filteredFileListData;
        private numPages;
        private setCurrentPage;
        private get isSmallWidth();
        private updateFilterBar;
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
        private getNewName;
        private onUpload;
        private browseFile;
        reset(): void;
        private toggle;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/file.ts" />
declare module "@scom/scom-storage/file.ts" {
    import { Control } from "@ijstech/components";
    import { IIPFSData, IStorageConfig } from "@scom/scom-storage/interface.ts";
    interface IFileHandler {
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
    }
    class Editor implements IFileHandler {
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
    }
    class Viewer implements IFileHandler {
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
    }
    export { Editor, Viewer, IFileHandler };
}
/// <amd-module name="@scom/scom-storage/components/loadingSpinner.tsx" />
declare module "@scom/scom-storage/components/loadingSpinner.tsx" {
    import { ControlElement, Module } from "@ijstech/components";
    export interface ILoadingSpinnerProps {
        height?: string;
        top?: string;
        minHeight?: number | string;
        background?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-storage--loading-spinner']: ControlElement;
            }
        }
    }
    export class LoadingSpinner extends Module {
        private pnlLoadingSpinner;
        init(): Promise<void>;
        setProperties(value: ILoadingSpinnerProps): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/editor.tsx" />
declare module "@scom/scom-storage/components/editor.tsx" {
    import { Container, ControlElement, Module, Control } from '@ijstech/components';
    import { IFileHandler } from "@scom/scom-storage/file.ts";
    import { EditorType, IEditor, IIPFSData, IStorageConfig } from "@scom/scom-storage/interface.ts";
    type onChangedCallback = (filePath?: string, content?: string) => void;
    interface ScomIPFSEditorElement extends ControlElement {
        data?: IEditor;
        onClose?: () => void;
        onChanged?: onChangedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-ipfs--editor']: ScomIPFSEditorElement;
            }
        }
    }
    export class ScomIPFSEditor extends Module implements IFileHandler {
        private pnlEditor;
        private editorEl;
        private btnSave;
        private mdAlert;
        private btnActions;
        private loadingSpinner;
        private pnlLoading;
        private _data;
        private initialContent;
        filePath: string;
        onClose: () => void;
        onChanged: onChangedCallback;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSEditorElement, parent?: Container): Promise<ScomIPFSEditor>;
        get url(): string;
        set url(value: string);
        get type(): EditorType;
        set type(value: EditorType);
        get isFullScreen(): boolean;
        set isFullScreen(value: boolean);
        showLoadingSpinner(): void;
        hideLoadingSpinner(): void;
        setData(value: IEditor): Promise<void>;
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
        onHide(): void;
        private renderUI;
        private handleEditorChanged;
        private createEditorElement;
        private createDesignerElement;
        private createPackageBuilderElement;
        private onCancel;
        private onSubmit;
        private onAlertConfirm;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/components/preview.tsx" />
declare module "@scom/scom-storage/components/preview.tsx" {
    import { Container, Control, ControlElement, Module } from '@ijstech/components';
    import { IIPFSData, IPreview, IStorageConfig } from "@scom/scom-storage/interface.ts";
    import { IFileHandler } from "@scom/scom-storage/file.ts";
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
    export class ScomIPFSPreview extends Module implements IFileHandler {
        private previewer;
        private lblName;
        private lblSize;
        private lblCid;
        private imgCopy;
        private pnlEdit;
        private previewerPanel;
        private editorPanel;
        private editor;
        private loadingSpinner;
        private pnlLoading;
        private pnlFileInfo;
        private iconClose;
        private copyTimer;
        private _data;
        private currentUrl;
        private typesMapping;
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
        get parentCid(): string;
        set parentCid(value: string);
        get previewPath(): string;
        openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
        showLoadingSpinner(): void;
        hideLoadingSpinner(): void;
        setData(value: IPreview): void;
        clear(): void;
        private renderUI;
        private renderFileInfo;
        private previewFile;
        private getFileType;
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
        private onCopyCid;
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
    export { LoadingSpinner } from "@scom/scom-storage/components/loadingSpinner.tsx";
}
/// <amd-module name="@scom/scom-storage/index.css.ts" />
declare module "@scom/scom-storage/index.css.ts" {
    export const defaultColors: {
        light: {
            primaryColor: string;
            primaryLightColor: string;
            primaryDarkColor: string;
            secondaryColor: string;
            borderColor: string;
            fontColor: string;
            backgroundColor: string;
            secondaryLight: string;
            secondaryMain: string;
            hover: string;
            hoverBackground: string;
            selected: string;
            selectedBackground: string;
        };
        dark: {
            primaryColor: string;
            primaryLightColor: string;
            primaryDarkColor: string;
            secondaryColor: string;
            borderColor: string;
            fontColor: string;
            backgroundColor: string;
            secondaryLight: string;
            secondaryMain: string;
            hover: string;
            hoverBackground: string;
            selected: string;
            selectedBackground: string;
        };
    };
    const _default_1: string;
    export default _default_1;
    export const iconButtonStyled: string;
    export const previewModalStyle: string;
    export const dragAreaStyle: string;
    export const selectedRowStyle: string;
}
/// <amd-module name="@scom/scom-storage" />
declare module "@scom/scom-storage" {
    import { Module, ControlElement, IDataSchema, IPFS, Container } from '@ijstech/components';
    import { IIPFSData, IStorageConfig } from "@scom/scom-storage/interface.ts";
    import { IFileHandler } from "@scom/scom-storage/file.ts";
    export { IFileHandler, IIPFSData };
    type selectFileCallback = (path: string) => void;
    type cancelCallback = () => void;
    interface ScomStorageElement extends ControlElement {
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
        baseUrl?: string;
        isModal?: boolean;
        isUploadModal?: boolean;
        uploadMultiple?: boolean;
        isFileShown?: boolean;
        onOpen?: selectFileCallback;
        onCancel?: cancelCallback;
        onPreview?: () => void;
        onClosePreview?: () => void;
        onUploadedFile?: selectFileCallback;
    }
    interface UploadRawFile extends File {
        uid?: number;
        path?: string;
        cid?: {
            cid: string;
            size: number;
        };
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-storage']: ScomStorageElement;
            }
        }
    }
    export class ScomStorage extends Module {
        private iconBack;
        private pnlUpload;
        private pnlStorage;
        private pnlPath;
        private uploadedFileTree;
        private mobileHome;
        private iePreview;
        private pnlPreview;
        private uploadModal;
        private ieContent;
        private ieSidebar;
        private btnUpload;
        private currentItem;
        private mdActions;
        private pnlLoading;
        private loadingSpinner;
        private pnlFooter;
        private pnlCustom;
        private btnBack;
        private fileEditors;
        private currentEditor;
        private static instance;
        static getInstance(): ScomStorage;
        tag: any;
        private _data;
        private pnlFileTable;
        private pnlUploadTo;
        private lblDestinationFolder;
        private fileTable;
        private filesColumns;
        private columns;
        private _uploadedTreeData;
        private _uploadedFileNodes;
        private currentCid;
        private rootCid;
        private _baseUrl;
        private selectedRow;
        private manager;
        private counter;
        private _readOnly;
        private isInitializing;
        private _isModal;
        private _isUploadModal;
        private isUploadMultiple;
        private _isFileShown;
        private currentFile;
        private _signer;
        private isAssetRootNode;
        onOpen: selectFileCallback;
        onCancel: cancelCallback;
        onPreview: () => void;
        onClosePreview: () => void;
        onUploadedFile: selectFileCallback;
        constructor(parent?: Container, options?: any);
        get baseUrl(): string;
        set baseUrl(url: string);
        private get readOnly();
        private set readOnly(value);
        get isModal(): boolean;
        set isModal(value: boolean);
        get isUploadModal(): boolean;
        set isUploadModal(value: boolean);
        get uploadMultiple(): boolean;
        set uploadMultiple(value: boolean);
        get transportEndpoint(): string;
        set transportEndpoint(value: string);
        get signer(): IPFS.ISigner;
        set signer(value: IPFS.ISigner);
        get isFileShown(): boolean;
        set isFileShown(value: boolean);
        setConfig(config: IStorageConfig): void;
        getConfig(): IStorageConfig;
        private registerDefaultEditors;
        registerEditor(fileType: string | RegExp, editor: IFileHandler): void;
        openFile(ipfsData: IIPFSData): Promise<void>;
        private getFileConfig;
        private getFileType;
        private setData;
        private getData;
        onShow(): Promise<void>;
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
        private getAssetRootNode;
        private updateUrlPath;
        private extractUrl;
        private initContent;
        private constructLinks;
        private renderUI;
        renderUploadedFileTreeUI(needReset?: boolean, path?: string): Promise<void>;
        addUploadedFileNode(nodeData: IIPFSData, path?: string): Promise<void>;
        private onUpdateContent;
        private onUpdateBreadcumbs;
        private onFilesUploaded;
        private handleUploadButtonClick;
        private onOpenUploadModal;
        private onShowActions;
        private initModalActions;
        private onActiveChange;
        private onActionButton;
        showLoadingSpinner(): void;
        hideLoadingSpinner(): void;
        private getNewName;
        private onNameChange;
        private onRenameFolder;
        private onDeleteFolder;
        private onAddNewFolder;
        addNewFolder(isRoot?: boolean): Promise<void>;
        private onOpenFolder;
        private onFetchData;
        private processTableData;
        private onCellClick;
        private previewFile;
        private onCellDblClick;
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
        private onOpenHandler;
        private onCancelHandler;
        private renderUploadModal;
        uploadFiles(files: UploadRawFile[]): Promise<{
            fileName: string;
            path: string;
        }[]>;
        private handleBack;
        init(): void;
        render(): any;
    }
}
