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