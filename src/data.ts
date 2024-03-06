export const formatBytes = (bytes: any, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getFileContent = async (url: string) => {
    let result = '';
    if (url) {
        const response = await fetch(url);
        try {
            if (response.ok) {
                result = await response.text();
            }
        } catch(err) {}
    }
    return result;
}