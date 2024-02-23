/// <amd-module name="@scom/scom-storage/assets.ts" />
declare module "@scom/scom-storage/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-storage/inteface.ts" />
declare module "@scom/scom-storage/inteface.ts" {
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
        cid: string;
    }
}
/// <amd-module name="@scom/scom-storage/data.ts" />
declare module "@scom/scom-storage/data.ts" {
    import { IIPFSData, IStorageConfig } from "@scom/scom-storage/inteface.ts";
    export const autoRetryGetContent: (cid: string) => Promise<IIPFSData>;
    export const fetchData: (data: IStorageConfig) => Promise<IIPFSData>;
    export const formatBytes: (bytes: any, decimals?: number) => string;
}
/// <amd-module name="@scom/scom-storage/components/index.css.ts" />
declare module "@scom/scom-storage/components/index.css.ts" {
    export const backgroundStyle: string;
    export const transitionStyle: string;
    export const addressPanelStyle: string;
}
/// <amd-module name="@scom/scom-storage/components/path.tsx" />
declare module "@scom/scom-storage/components/path.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IIPFSData } from "@scom/scom-storage/inteface.ts";
    interface ScomIPFSPathElement extends ControlElement {
        data?: IIPFSData;
        onItemClicked?: (data: IIPFSData) => void;
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
        onItemClicked: (data: IIPFSData) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSPathElement, parent?: Container): Promise<ScomIPFSPath>;
        get data(): IIPFSData;
        set data(value: IIPFSData);
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
    import { FileType, IIPFSData } from "@scom/scom-storage/inteface.ts";
    type callbackType = (data: IIPFSData) => Promise<IIPFSData>;
    interface ScomIPFSFolderElement extends ControlElement {
        data?: IFolderData;
        onFetchData?: callbackType;
        onClose?: () => void;
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
        private inputSearch;
        private pnlSearch;
        private iconList;
        private _data;
        private mode;
        private searchTimer;
        private sortMapping;
        onFetchData: callbackType;
        onClose: () => void;
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
        setData(data: IFolderData): void;
        updatePath(data: IIPFSData): void;
        private renderUI;
        private onBreadcrumbClick;
        private renderList;
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
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IIPFSData } from "@scom/scom-storage/inteface.ts";
    interface ScomIPFSMobileHomeElement extends ControlElement {
        recents?: IIPFSData[];
        folders?: IIPFSData[];
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
    }
    export class ScomIPFSMobileHome extends Module {
        private pnlRecent;
        private foldersSlider;
        private mobileFolder;
        private mobileMain;
        private _data;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomIPFSMobileHomeElement, parent?: Container): Promise<ScomIPFSMobileHome>;
        get recents(): any[];
        set recents(value: any[]);
        get folders(): any[];
        set folders(value: any[]);
        setData(data: IHomeData): void;
        private renderFolders;
        private renderRecent;
        private onFolderClick;
        private onViewFiles;
        private onViewFolders;
        private onBack;
        private onFetchData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-storage/index.css.ts" />
declare module "@scom/scom-storage/index.css.ts" {
    const _default_1: string;
    export default _default_1;
}
/// <amd-module name="@scom/scom-storage" />
declare module "@scom/scom-storage" {
    import { Module, ControlElement, IDataSchema } from '@ijstech/components';
    import { IIPFSData } from "@scom/scom-storage/inteface.ts";
    interface ScomStorageElement extends ControlElement {
        cid?: string;
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
        tag: any;
        private _data;
        private fileTable;
        private filesColumns;
        private columns;
        private _uploadedTreeData;
        private _uploadedFileNodes;
        private currentParentDir;
        private breadcrumb;
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
        private initContent;
        renderUploadedFileTreeUI(needReset?: boolean): Promise<void>;
        addUploadedFileNode(nodeData: IIPFSData): Promise<void>;
        private onUpdateContent;
        private onUpdateBreadcumbs;
        private onOpenUploadModal;
        private onActiveChange;
        private onOpenFolder;
        private onFetchData;
        private processTableData;
        private onCellClick;
        private onBreadcrumbClick;
        init(): void;
        render(): any;
    }
}
