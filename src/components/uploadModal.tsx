import {
    Control,
    ControlElement,
    customElements,
    Button,
    Image,
    Label,
    Module,
    Panel,
    Styles,
    Upload,
    VStack,
    Container,
    HStack,
    Progress,
    IPFS,
    StackLayout,
} from '@ijstech/components';
import assets from '../assets';
import { uploadModalStyle } from './index.css';
import { isFileExists } from '../utils';
import translations from '../translations.json';

const Theme = Styles.Theme.ThemeVars;

enum FILE_STATUS {
    LISTED, // ALL
    SUCCESS,
    FAILED,
    UPLOADING,
}

const BUTTON_FILTERS = [
    {
        id: 'btnAll',
        caption: '$all',
        status: FILE_STATUS.LISTED
    },
    {
        id: 'btnSuccess',
        caption: '$success',
        status: FILE_STATUS.SUCCESS
    },
    {
        id: 'btnFail',
        caption: '$fail',
        status: FILE_STATUS.FAILED
    },
    {
        id: 'btnUploading',
        caption: '$uploading',
        status: FILE_STATUS.UPLOADING
    }
]

const ITEMS_PER_PAGE = 5;

interface ICidInfo {
    cid: string;
    links?: ICidInfo[];
    name?: string;
    size: number;
    type?: 'dir' | 'file';
};

type UploadedCallback = (target: ScomIPFSUploadModal, rootCid: string, filePaths: string[]) => void;

interface ScomIPFSUploadModalElement extends ControlElement {
    rootCid?: string;
    mulitiple?: boolean;
    parentDir?: Partial<ICidInfo>;
    onUploaded?: UploadedCallback;
    onBrowseFile?: () => void;
}

declare global {
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

@customElements('i-scom-ipfs--upload-modal')
export class ScomIPFSUploadModal extends Module {
    private lblTitle: Label;
    private fileUploader: Upload;
    private btnBrowseFile: Button;
    private imgFile: Image;
    private lblDrag: Label;
    private pnlBrowse: StackLayout;
    private pnlStatusFilter: Panel;
    private pnlFilterActions: Panel;
    private pnlFileList: VStack;
    private btnUpload: Button;
    private pnlNote: Panel;
    private pnlPagination: Panel;

    private _rootCid: string;
    private _parentDir: Partial<ICidInfo>;
    public onUploaded: UploadedCallback;
    public onBrowseFile: () => void;

    private isForcedCancelled = false;
    private currentRequest: XMLHttpRequest;
    private currentPage = 1;
    private currentFilterStatus: FILE_STATUS = FILE_STATUS.LISTED;
    private files: File[] = [];
    private fileListData: {
        file: any;
        status: FILE_STATUS;
        percentage: number | string;
        url?: string;
    }[] = [];
    private _manager: IPFS.FileManager;
    private folderPath: string;
    private _isBrowseButtonShown: boolean = false;
    private _mulitiple: boolean = true;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    get rootCid(): string {
        return this._rootCid;
    }
    set rootCid(value: string) {
        console.log('set rootCid: ', value);
        this._rootCid = value;
    }

    get parentDir(): Partial<ICidInfo> {
        return this._parentDir;
    }
    set parentDir(value: Partial<ICidInfo>) {
        console.log('set parentDir: ', value);
        this._parentDir = value;
    }

    get manager(): any {
        return this._manager;
    }
    set manager(value: any) {
        this._manager = value;
    }

    get isBrowseButtonShown() {
        return this._isBrowseButtonShown;
    }
    set isBrowseButtonShown(value: boolean) {
        this._isBrowseButtonShown = value;
        if (this.pnlBrowse) this.pnlBrowse.visible = value;
    }

    get mulitiple() {
        return this._mulitiple;
    }

    set mulitiple(value: boolean) {
        this._mulitiple = value;
        this.updateUI();
    }

    private updateUI() {
        this.lblTitle.caption = this.mulitiple ? "$upload_more_files" : "$upload_file_to_ipfs";
        this.fileUploader.multiple = this.mulitiple;
        this.btnUpload.caption = this.mulitiple ? "$upload_file_to_ipfs" : "$confirm";
        this.pnlPagination.visible = this.mulitiple;
    }

    show(path?: string, files?: File[]) {
        this.folderPath = path;
        this.updateBtnCaption();
        if (files?.length) {
            for (let i = 0; i < files.length; i++) {
                this.fileListData.push({ file: files[i], status: 0, percentage: 0 });
                this.files.push(files[i]);
            }
            this.renderFileList();
            this.renderFilterBar();
            this.renderPagination();
            this.toggle(true);
        }
    }

    refresh() { }

    private onBeforeDrop(target: Upload) {
        console.log('onBeforeDrop: ', target);
        this.fileUploader.enabled = false;
        this.imgFile.url = assets.fullPath("img/loading-icon.svg");
        this.lblDrag.caption = '$processing_your_files';
    }

    private onBeforeUpload(target: Upload, file: File): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    private filteredFileListData() {
        return this.currentFilterStatus === FILE_STATUS.LISTED
            ? this.fileListData
            : this.fileListData.filter((i) => i.status === this.currentFilterStatus);
    }

    private numPages() {
        return Math.ceil(this.filteredFileListData().length / ITEMS_PER_PAGE);
    }

    private setCurrentPage(page: number) {
        if (page >= 1 && page <= this.numPages()) this.currentPage = page;
        this.renderFileList();
        this.renderPagination();
    }

    private get isSmallWidth() {
        return !!window.matchMedia('(max-width: 767px)').matches;
    }

    private updateFilterBar() {
        BUTTON_FILTERS.forEach(v => {
            const btn = this[v.id] as Button;
            if (this.currentFilterStatus === v.status) {
                btn.classList.add('filter-btn-active');
            } else {
                btn.classList.remove('filter-btn-active');
            }
            if (v.status === FILE_STATUS.LISTED) {
                btn.caption = `${this.i18n.get('$all')} (${this.fileListData.length})`;
            } else {
                btn.caption = `${this.i18n.get(v.caption)} (${this.fileListData.filter((i) => i.status === v.status).length})`;
            }
        });
    }

    private async renderFilterBar() {
        this.updateFilterBar();

        this.pnlFilterActions.clearInnerHTML();
        if (this.currentFilterStatus === FILE_STATUS.UPLOADING) {
            this.pnlFilterActions.appendChild(
                <i-button caption="$cancel" onClick={this.onCancel.bind(this)}></i-button>
            );
        } else {
            this.pnlFilterActions.appendChild(
                <i-button caption="$clear" onClick={this.onClear.bind(this)}></i-button>
            );
        }
    }

    private async renderFileList() {
        this.pnlFileList.clearInnerHTML();
        const filteredFileListData = this.filteredFileListData();
        const paginatedFilteredFileListData = this.isSmallWidth ? this.fileListData : [...filteredFileListData].slice(
            (this.currentPage - 1) * ITEMS_PER_PAGE,
            ITEMS_PER_PAGE * this.currentPage
        );
        const startIdx = this.isSmallWidth ? 0 : (this.currentPage - 1) * ITEMS_PER_PAGE;

        for (let i = 0; i < paginatedFilteredFileListData.length; i++) {
            const fileData = paginatedFilteredFileListData[i];

            const pnlRow2 = (
                <i-hstack verticalAlignment='center' gap="0.5rem">
                    <i-label
                        maxWidth="100%"
                        caption={this.formatBytes(fileData.file.size || 0)}
                        font={{ size: '0.75rem' }}
                        textOverflow="ellipsis"
                        opacity={0.75}
                    ></i-label>
                </i-hstack>
            );
            this.renderStatus(fileData.status, pnlRow2, startIdx + i);

            this.pnlFileList.appendChild(
                <i-hstack
                    class={`file file-${i} status-${fileData.status}`}
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                    stack={{ shrink: '0', grow: '1' }}
                    overflow="hidden"
                    gap="1rem"
                >
                    <i-icon
                        width="1.75rem"
                        height="1.75rem"
                        name="file"
                        fill={Theme.colors.primary.main}
                        border={{ radius: '0.5rem', width: '1px', color: Theme.divider, style: 'solid' }}
                        padding={{ top: '0.35rem', bottom: '0.35rem', left: '0.35rem', right: '0.35rem' }}
                        stack={{ shrink: '0' }}
                    ></i-icon>
                    <i-vstack maxWidth="100%" stack={{ shrink: '1', grow: '1' }} gap="0.25rem" overflow="hidden">
                        <i-hstack horizontalAlignment='space-between' verticalAlignment='center' gap="1rem">
                            <i-label
                                maxWidth="100%"
                                caption={fileData.file.path || fileData.file.name}
                                font={{ weight: 600, size: '0.875rem' }}
                                textOverflow="ellipsis"
                            ></i-label>
                            <i-icon
                                width="0.875rem"
                                height="0.875rem"
                                name="times"
                                fill={Theme.text.primary}
                                cursor="pointer"
                                onClick={() => this.onRemoveFile(i)}
                            ></i-icon>
                        </i-hstack>
                        {pnlRow2}
                        <i-hstack id={`progress-${startIdx + i}`} verticalAlignment='center' gap="0.75rem" visible={fileData.status === FILE_STATUS.UPLOADING}>
                            <i-progress
                                height="auto"
                                percent={+fileData.percentage}
                                strokeWidth={10}
                                stack={{ grow: '1', shrink: '1', basis: '60%' }}
                                border={{ radius: '0.5rem' }}
                            ></i-progress>
                            <i-label caption={`${fileData.percentage}%`} font={{ size: '0.75rem' }} stack={{ grow: '1', shrink: '0' }}></i-label>
                        </i-hstack>
                    </i-vstack>
                </i-hstack>
            );
        }
    }

    private formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    private renderStatus(status: number, parent: HStack, idx: number) {
        let uploadStatus = "";
        let iconOptions = { name: 'times', background: { color: Theme.text.primary }, visible: false };
        switch (status) {
            case FILE_STATUS.SUCCESS:
                iconOptions.name = 'check';
                iconOptions.background.color = Theme.colors.success.main;
                iconOptions.visible = true;
                uploadStatus = '$completed';
                break;
            case FILE_STATUS.FAILED:
                iconOptions.name = 'times';
                iconOptions.background.color = Theme.colors.error.main;
                iconOptions.visible = true;
                uploadStatus = '$failed';
            case FILE_STATUS.UPLOADING:
                uploadStatus = '$uploading';
        }
        parent.appendChild(
            <i-hstack id={`status-${idx}`} verticalAlignment="center" gap="0.5rem">
                <i-label caption={uploadStatus} />
                <i-icon
                    width="0.875rem"
                    height="0.875rem"
                    padding={{ top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }}
                    border={{ radius: '50%' }}
                    fill={Theme.colors.primary.contrastText}
                    {...iconOptions as any}
                />
            </i-hstack>
        );
    }

    private getPagination(currentIndex: number, totalPages: number) {
        let current = currentIndex,
            last = totalPages,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range: number[] = [],
            rangeWithDots: (string | number)[] = [],
            l: any;

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || (i >= left && i < right)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }

    private async renderPagination() {
        const numPages = this.numPages();
        const rangeWithDots = this.getPagination(this.currentPage, numPages);

        if (numPages >= 1) {
            if (this.currentPage > numPages) {
                this.setCurrentPage(numPages);
            } else {
                this.pnlPagination.clearInnerHTML();

                const prevBtn = new Button(this.pnlPagination, {
                    icon: { name: 'chevron-left' },
                });
                prevBtn.onClick = () => {
                    this.setCurrentPage(this.currentPage - 1);
                };

                for (let i = 0; i < rangeWithDots.length; i++) {
                    const pageBtn = new Button(this.pnlPagination, {
                        class: this.currentPage === rangeWithDots[i] ? 'active' : '',
                        caption: rangeWithDots[i].toString(),
                    });
                    if (rangeWithDots[i] === '...') {
                        pageBtn.classList.add('dots');
                    } else {
                        pageBtn.onClick = () => {
                            this.setCurrentPage(rangeWithDots[i] as number);
                        };
                    }
                }
                const nexBtn = new Button(this.pnlPagination, {
                    icon: { name: 'chevron-right' },
                });
                nexBtn.onClick = () => {
                    this.setCurrentPage(this.currentPage + 1);
                };
            }
        } else {
            this.pnlPagination.clearInnerHTML();
        }
    }

    private onChangeCurrentFilterStatus(status: FILE_STATUS) {
        this.currentFilterStatus = status;

        this.renderFilterBar();
        this.renderPagination();
        this.renderFileList();
    }

    private onClear() {
        switch (this.currentFilterStatus) {
            case FILE_STATUS.LISTED:
                this.fileListData =
                    this.fileListData && this.fileListData.length
                        ? this.fileListData.filter(
                            (fileData) =>
                                ![
                                    FILE_STATUS.LISTED,
                                    FILE_STATUS.SUCCESS,
                                    FILE_STATUS.FAILED,
                                ].includes(fileData.status)
                        )
                        : this.fileListData;
                break;
            case FILE_STATUS.SUCCESS:
                this.fileListData =
                    this.fileListData && this.fileListData.length
                        ? this.fileListData.filter(
                            (fileData) => ![FILE_STATUS.SUCCESS].includes(fileData.status)
                        )
                        : this.fileListData;
                break;
            case FILE_STATUS.FAILED:
                this.fileListData =
                    this.fileListData && this.fileListData.length
                        ? this.fileListData.filter(
                            (fileData) => ![FILE_STATUS.FAILED].includes(fileData.status)
                        )
                        : this.fileListData;
                break;
        }
        this.renderFilterBar();
        this.renderFileList();
        this.renderPagination();

        if (!this.fileListData.length) {
            this.toggle(false);
        }
        this.refresh();
    }

    private onCancel() {
        this.currentRequest.abort();
        this.isForcedCancelled = true;
        if (this.fileListData && this.fileListData.some(f => f.status === FILE_STATUS.UPLOADING)) {
            this.fileListData = this.fileListData.map(f => {
                if (f.status === FILE_STATUS.UPLOADING) {
                    return {
                        ...f,
                        status: FILE_STATUS.LISTED
                    }
                }
                return f;
            })
        }
    }

    private async onChangeFile(source: Control, files: File[]) {
        console.log('onChangeFile: ', files);
        return new Promise(async (resolve, reject) => {
            if (!files.length) reject();

            this.fileUploader.enabled = true;
            this.imgFile.url = assets.fullPath("img/file-icon.png");
            this.updateBtnCaption();

            for (let i = 0; i < files.length; i++) {
                this.fileListData.push({ file: files[i], status: 0, percentage: 0 });
                this.files.push(files[i]);
            }
            this.renderFileList();
            this.renderFilterBar();
            this.renderPagination();
            this.toggle(true);
            this.fileUploader.clear();
            this.refresh();
        });
    }

    private updateBtnCaption() {
        this.lblDrag.caption = this.isSmallWidth ? '$select_files' : '$drag_and_drop_your_files_here';
    }

    private onRemove(source: Control, file?: File) { }

    private onRemoveFile(index: number) {
        this.fileListData.splice(index, 1);
        this.files.splice(index, 1);
        this.renderFileList();
        this.renderFilterBar();
        this.renderPagination();

        if (!this.fileListData.length) {
            this.toggle(false);
        }
        this.refresh();
    }

    private async onUpload() {
        return new Promise(async (resolve, reject) => {
            if (!this.fileListData.length || !this.manager) reject();
            this.btnUpload.caption = '$uploading_file_to_ipfs';
            this.btnUpload.enabled = false;
            this.isForcedCancelled = false;
            this.btnBrowseFile.enabled = false;
            this.fileUploader.enabled = false;

            try {
                let filePaths: string[] = [];
                for (let i = 0; i < this.fileListData.length; i++) {
                    const file = this.fileListData[i];
                    let filePath = this.folderPath ? `${this.folderPath}${file.file.path}` : file.file.path;
                    const { isExists, newFilePath } = await isFileExists(this.manager, filePath);
                    if (isExists) {
                        filePath = newFilePath;
                    }
                    filePaths.push(filePath);

                    file.status = FILE_STATUS.UPLOADING;
                    this.updateFilterBar();
                    this.renderFileList();
                    this.renderPagination();
                    const statusWrapper = this.pnlFileList.querySelector(`#status-${i}`) as HStack;
                    if (statusWrapper) {
                        statusWrapper.visible = false;
                    }
                    const progressWrapper = this.pnlFileList.querySelector(`#progress-${i}`) as HStack;
                    if (progressWrapper) {
                        progressWrapper.visible = true;
                    }
                    await this.manager.addFile(filePath, file.file);
                    file.percentage = 100;
                    if (progressWrapper) {
                        const progress = progressWrapper.firstElementChild as Progress;
                        const label = progressWrapper.lastElementChild as Label;
                        if (progress) progress.percent = 100;
                        if (label) label.caption = '100%';
                    }
                }

                await this.manager.applyUpdates();

                for (const file of this.fileListData) {
                    file.status = FILE_STATUS.SUCCESS;
                }

                let rootNode = await this.manager.getRootNode();

                if (this.onUploaded) this.onUploaded(this, rootNode.cid, filePaths);
            } catch (err) {
                console.log('onUpload ', err);
                if (this.fileListData && this.fileListData.length) {
                    this.fileListData = this.fileListData.map(f => {
                        if ([FILE_STATUS.LISTED, FILE_STATUS.UPLOADING].includes(f.status)) {
                            return {
                                ...f,
                                status: FILE_STATUS.FAILED
                            }
                        }
                        return f;
                    })
                }
            }
            this.renderFilterBar();
            this.renderFileList();
            this.renderPagination();
            this.btnUpload.caption = this.mulitiple ? '$upload_file_to_ipfs' : '$confirm';
            this.btnUpload.enabled = true;
            this.btnBrowseFile.enabled = true;
            this.fileUploader.enabled = true;
            this.refresh();
        })
    }

    private browseFile() {
        if (this.onBrowseFile) this.onBrowseFile();
    }

    reset() {
        this.pnlFileList.clearInnerHTML();
        this.pnlPagination.clearInnerHTML();
        this.btnUpload.caption = this.mulitiple ? '$upload_file_to_ipfs' : "$confirm";
        this.btnUpload.enabled = true;
        this.btnBrowseFile.enabled = true;
        this.fileUploader.enabled = true;
        this.fileListData = [];
        this.files = [];
        this.toggle(false);
    }

    private toggle(showFileList: boolean) {
        if (showFileList) {
            this.pnlStatusFilter.visible = true;
            this.btnUpload.visible = true;
            this.pnlNote.visible = false;
        } else {
            this.pnlStatusFilter.visible = false;
            this.btnUpload.visible = false;
            this.pnlNote.visible = true;
        }
    }

    async init() {
        this.i18n.init({...translations});
        super.init();
        this.classList.add(uploadModalStyle);
        this.rootCid = this.getAttribute('rootCid', true);
        this.parentDir = this.getAttribute('parentDir', true);
        const isBrowseButtonShown = this.getAttribute('isBrowseButtonShown', true);
        if (isBrowseButtonShown != null) this.isBrowseButtonShown = isBrowseButtonShown;
        const mulitiple = this.getAttribute('mulitiple', true);
        if (mulitiple != null) this.mulitiple = mulitiple;
    }

    render() {
        return (
            <i-panel
                height="100%"
                overflow="hidden"
                padding={{ top: '3.125rem', bottom: '3.125rem', left: '8.125rem', right: '8.125rem' }}
                border={{ radius: '0.375rem' }}
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            padding: { top: '1.5rem', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }
                        }
                    }
                ]}
            >
                <i-label id="lblTitle" class="heading" caption="$upload_more_files"></i-label>
                <i-label class="label" caption="$choose_file_to_upload_to_ipfs_network"></i-label>
                <i-panel class="file-uploader-dropzone" maxHeight="calc(100% - 4.5rem)">
                    <i-panel class="droparea">
                        <i-upload
                            id="fileUploader"
                            multiple={true}
                            draggable={true}
                            onBeforeDrop={this.onBeforeDrop}
                            onUploading={this.onBeforeUpload}
                            onChanged={this.onChangeFile}
                            onRemoved={this.onRemove}
                        ></i-upload>
                        <i-image
                            id="imgFile"
                            width={60}
                            height={60}
                            class="icon"
                            url={assets.fullPath('img/file-icon.png')}
                        ></i-image>
                        <i-label id="lblDrag" caption="$drag_and_drop_your_files_here"></i-label>
                    </i-panel>
                    <i-stack id="pnlBrowse" direction="vertical" alignItems="center" justifyContent="center" margin={{ top: '-1rem' }} visible={false}>
                        <i-label class="label" caption="$or"></i-label>
                        <i-button
                            id="btnBrowseFile"
                            caption="$browse_file"
                            boxShadow="none"
                            background={{ color: Theme.colors.primary.main }}
                            font={{ color: Theme.colors.primary.contrastText }}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                            onClick={this.browseFile}
                        ></i-button>
                    </i-stack>
                    <i-panel id="pnlStatusFilter" class="status-filter" visible={false}>
                        <i-panel class="filter-bar">
                            {
                                BUTTON_FILTERS.map(v => <i-button
                                    id={v.id}
                                    class={`filter-btn ${v.status === FILE_STATUS.LISTED ? 'filter-btn-active' : ''}`}
                                    caption={`${v.caption} (0)`}
                                    onClick={() => this.onChangeCurrentFilterStatus(v.status)}
                                />)
                            }
                        </i-panel>
                        <i-panel id="pnlFilterActions" class="filter-actions" margin={{ left: 'auto' }}></i-panel>
                    </i-panel>
                    <i-vstack id="pnlFileList" class="filelist" gap="0.5rem"></i-vstack>
                    <i-panel id="pnlPagination" class="pagination"></i-panel>
                    <i-button
                        id="btnUpload"
                        class="upload-btn"
                        caption="$upload_files_to_ipfs"
                        boxShadow="none"
                        background={{ color: Theme.colors.primary.main }}
                        font={{ color: Theme.colors.primary.contrastText }}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                        visible={false}
                        onClick={this.onUpload}
                    ></i-button>
                </i-panel>
                <i-panel id="pnlNote">
                    <i-panel class="note">
                        <i-label class="head" caption="$public_data"></i-label>
                        <i-label class="desc" caption="$all_data_uploaded_to_ipfs_explorer_is_available_to_anyone_who_requests_it_using_the_correct_cid_do_not_store_any_private_or_sensitive_information_in_an_unencrypted_form_using_ipfs_explorer"></i-label>
                    </i-panel>
                    <i-panel class="note">
                        <i-label class="head" caption="$permanent_data"></i-label>
                        <i-label class="desc" caption="$deleting_files_from_the_ipfs_explorer_sites_files_page_will_remove_them_from_the_file_listing_for_your_account_but_that_doesnt_prevent_nodes_on_the_decentralized_storage_network_from_retaining_copies_of_the_data_indefinitely_do_not_use_ipfs_explorer_for_data_that_may_need_to_be_permanently_deleted_in_the_future"></i-label>
                    </i-panel>
                </i-panel>
            </i-panel>
        )
    }
}
