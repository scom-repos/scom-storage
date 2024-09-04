import {IPFS} from '@ijstech/components';
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

export type EditorType = 'md' | 'designer' | 'widget' | 'code';

export interface IEditor {
    url?: string;
    type?: EditorType;
    isFullScreen?: boolean;
    config?: IStorageConfig;
    parentCid?: string;
}
