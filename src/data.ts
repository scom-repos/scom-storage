import { IIPFSData, IStorageConfig } from "./inteface";

export const IPFS_GATEWAY = 'https://ipfs.scom.dev/ipfs/'

export const autoRetryGetContent = async (cid: string): Promise<IIPFSData> => {
    return new Promise((resolve, reject) => {
        const load = async (counter: number): Promise<any> => {
            try {
                if (counter >= 10) return reject();
                const response = await fetch(`${IPFS_GATEWAY}${cid}`);
                if (response.ok) {
                    resolve(response.json());
                } else {
                    return load(++counter);
                }
            } catch (e) {
                return load(++counter);
            }
        };
        load(0);
    });
}

export const fetchData = async (data: IStorageConfig): Promise<IIPFSData> => {
    if (data && data.cid) return await autoRetryGetContent(data.cid);
    else return null;
}

export const getFileContent = async (cid: string) => {
    let result = '';
    if (cid) {
        const response = await fetch(`${IPFS_GATEWAY}${cid}`);
        try {
            if (response.ok) {
                result = await response.text();
            }
        } catch(err) {}
    }
    return result;
}

export const formatBytes = (bytes: any, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
