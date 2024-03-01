var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-storage/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-storage/data.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatBytes = exports.getFileContent = exports.fetchData = exports.autoRetryGetContent = exports.IPFS_GATEWAY = void 0;
    exports.IPFS_GATEWAY = 'https://ipfs.scom.dev/ipfs/';
    const autoRetryGetContent = async (cid) => {
        return new Promise((resolve, reject) => {
            const load = async (counter) => {
                try {
                    if (counter >= 10)
                        return reject();
                    const response = await fetch(`${exports.IPFS_GATEWAY}${cid}`);
                    if (response.ok) {
                        resolve(response.json());
                    }
                    else {
                        return load(++counter);
                    }
                }
                catch (e) {
                    return load(++counter);
                }
            };
            load(0);
        });
    };
    exports.autoRetryGetContent = autoRetryGetContent;
    const fetchData = async (data) => {
        if (data && data.cid)
            return await (0, exports.autoRetryGetContent)(data.cid);
        else
            return null;
    };
    exports.fetchData = fetchData;
    const getFileContent = async (cid) => {
        let result = '';
        if (cid) {
            const response = await fetch(`${exports.IPFS_GATEWAY}${cid}`);
            try {
                if (response.ok) {
                    result = await response.text();
                }
            }
            catch (err) { }
        }
        return result;
    };
    exports.getFileContent = getFileContent;
    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes)
            return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };
    exports.formatBytes = formatBytes;
});
define("@scom/scom-storage/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-storage/components/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-storage/assets.ts"], function (require, exports, components_2, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uploadModalStyle = exports.customLinkStyle = exports.addressPanelStyle = exports.transitionStyle = exports.backgroundStyle = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.backgroundStyle = components_2.Styles.style({
        backgroundColor: Theme.divider,
        aspectRatio: '3 / 2',
        '-webkit-mask': `url(${assets_1.default.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
        mask: `url(${assets_1.default.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
        '-webkit-mask-size': 'cover',
        maskSize: 'cover'
    });
    exports.transitionStyle = components_2.Styles.style({
        '-webkit-transition': 'width 0.4s ease-in-out',
        transition: 'width 0.4s ease-in-out'
    });
    exports.addressPanelStyle = components_2.Styles.style({
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        $nest: {
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            'i-button': {
                whiteSpace: 'nowrap'
            }
        }
    });
    exports.customLinkStyle = components_2.Styles.style({
        $nest: {
            'a': {
                color: `${Theme.colors.primary.main}!important`,
                display: `inline !important`,
            },
            'img': {
                maxWidth: '100%'
            }
        }
    });
    exports.uploadModalStyle = components_2.Styles.style({
        $nest: {
            '.heading': {
                display: 'block',
                fontSize: 'clamp(1rem, 0.875rem + 0.625vw, 1.625rem)',
                color: Theme.colors.primary.dark,
                marginBottom: '0.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
                textAlign: 'center',
            },
            '.label': {
                display: 'block',
                marginBottom: '0.5rem',
                color: Theme.text.primary,
                textAlign: 'center',
            },
            '.file-uploader-dropzone': {
                display: 'flex',
                flexDirection: 'column',
                gridRowGap: '2rem',
                rowGap: '1.5rem',
                marginBottom: '2.5rem',
                marginTop: '2rem',
                $nest: {
                    '.droparea': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gridRowGap: '1rem',
                        rowGap: '1rem',
                        padding: '1.875rem 0',
                        background: 'rgba(255,255,255,.1)',
                        border: `1px dashed ${Theme.colors.primary.light}`,
                        borderRadius: '0.625rem',
                        cursor: 'pointer',
                    },
                    'i-upload': {
                        position: 'absolute',
                        top: 0,
                        opacity: 0,
                        minHeight: 'auto',
                        minWidth: 'auto',
                        margin: 0,
                        zIndex: 1,
                        $nest: {
                            '.i-upload_preview-img': {
                                display: 'none!important',
                            },
                        },
                    },
                    '.filelist': {
                        marginBottom: '0.5rem',
                        $nest: {
                            '@media screen and (max-width: 767px)': {
                                flex: '1',
                                overflowY: 'auto'
                            },
                            '.file': {
                                border: `1px solid ${Theme.divider}`,
                                borderRadius: '0.5rem',
                                $nest: {
                                    '&:hover': {
                                        border: `1px solid ${Theme.colors.primary.main}`,
                                    }
                                }
                            },
                        },
                    },
                    '.pagination': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        $nest: {
                            '@media screen and (max-width: 767px)': {
                                display: 'none'
                            },
                            'i-button': {
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: Theme.colors.primary.dark,
                                backgroundColor: 'transparent',
                                border: `1px solid ${Theme.colors.primary.dark}`,
                                boxShadow: 'none',
                                gap: 'unset',
                                userSelect: 'none',
                                $nest: {
                                    '&.active': {
                                        color: Theme.colors.primary.contrastText,
                                        backgroundColor: Theme.colors.primary.dark,
                                    },
                                    '&.dots': {
                                        borderColor: 'transparent',
                                    },
                                    'i-icon': {
                                        height: '10px!important',
                                        width: '12px!important',
                                        fill: `${Theme.colors.primary.dark}!important`,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '.status-filter': {
                display: 'flex',
                justifyContent: 'space-between',
                $nest: {
                    '.filter-bar': {
                        display: 'flex',
                        gap: '10px',
                        $nest: {
                            '@media screen and (max-width: 767px)': {
                                display: 'none'
                            },
                            '.filter-btn': {
                                fontSize: '14px',
                                background: 'transparent',
                                color: Theme.text.secondary,
                                boxShadow: 'none',
                            },
                            '.filter-btn.filter-btn-active': {
                                fontWeight: 'bold',
                                color: Theme.colors.primary.dark,
                            },
                        },
                    },
                    '.filter-actions': {
                        $nest: {
                            'i-button': {
                                background: Theme.colors.primary.light,
                                color: Theme.colors.primary.contrastText,
                                padding: '5px 10px',
                                fontSize: '14px',
                                boxShadow: 'none',
                            },
                        },
                    },
                },
            },
            '.note': {
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.4375rem',
                paddingLeft: '1.25rem',
                paddingRight: '0.25rem',
                $nest: {
                    '&:not(:last-child)': {
                        marginBottom: '1.5rem',
                    },
                    '.head': {
                        fontSize: '14px',
                        fontWeight: 700,
                        color: Theme.text.primary,
                    },
                    '.desc': {
                        fontSize: '12px',
                        fontWeight: 400,
                        letterSpacing: 0,
                        color: Theme.text.secondary,
                    },
                },
            },
        },
    });
});
define("@scom/scom-storage/components/path.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/components/index.css.ts"], function (require, exports, components_3, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSPath = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomIPFSPath = class ScomIPFSPath extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.breadcrumb = {};
            this._data = {
                cid: ''
            };
            this._isMobileView = false;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        get isMobileView() {
            return this._isMobileView;
        }
        set isMobileView(value) {
            this._isMobileView = value;
        }
        setData(value) {
            this._data = value;
            this.onUpdateBreadcumbs(value);
        }
        clear() {
            this.pnlAddress.clearInnerHTML();
            this.pnlAddress.visible = false;
            this.breadcrumb = {};
            this._data = {
                cid: ''
            };
        }
        onUpdateBreadcumbs(node) {
            if (node) {
                if (!this.breadcrumb[node.path]) {
                    this.breadcrumb[node.path] = node;
                }
                const nodePaths = this.splitPath(node.path);
                const elmPath = [];
                if (nodePaths?.length) {
                    for (let nodePath of nodePaths) {
                        const data = this.breadcrumb[nodePath];
                        if (data) {
                            const folderName = data.name || components_3.FormatUtils.truncateWalletAddress(data.cid) || '';
                            const item = (this.$render("i-hstack", { verticalAlignment: "center", gap: "0.25rem" },
                                nodePath != node.path ? (this.$render("i-button", { caption: folderName, font: { size: this.isMobileView ? '0.875rem' : '0.75rem' }, boxShadow: 'none', background: { color: 'transparent' }, onClick: () => this.onBreadcrumbClick({ cid: data.cid, path: nodePath }) })) : (this.$render("i-label", { caption: folderName, font: { size: this.isMobileView ? '0.875rem' : '0.75rem' }, textOverflow: "ellipsis" })),
                                this.$render("i-icon", { name: "chevron-right", width: "0.675rem", height: "0.675rem", fill: Theme.text.primary })));
                            elmPath.push(item);
                        }
                    }
                    this.pnlAddress.clearInnerHTML();
                    this.pnlAddress.visible = !!elmPath.length;
                    this.pnlAddress.append(...elmPath);
                    this.pnlAddress.scrollLeft = this.pnlAddress.scrollWidth;
                }
            }
        }
        async onBreadcrumbClick({ cid, path }) {
            if (this.onItemClicked)
                this.onItemClicked({ cid, path });
        }
        splitPath(path) {
            const array = path.split('/');
            let i = 0;
            let final = [];
            while (i < array.length) {
                final.push(`${array
                    .slice(0, i + 1)
                    .join('/')
                    .toString()}`);
                i++;
            }
            return final;
        }
        init() {
            super.init();
            this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
            this.isMobileView = this.getAttribute('isMobileView', true, false);
            const data = this.getAttribute('data', true);
            if (data)
                this.setData(data);
        }
        render() {
            return (this.$render("i-hstack", { id: 'pnlAddress', class: index_css_1.addressPanelStyle, verticalAlignment: "center", padding: { top: '0.5rem', bottom: '0.5rem' }, height: '2.188rem', gap: '0.25rem', overflow: { x: 'auto', y: 'hidden' }, visible: false }));
        }
    };
    ScomIPFSPath = __decorate([
        (0, components_3.customElements)('i-scom-ipfs--path')
    ], ScomIPFSPath);
    exports.ScomIPFSPath = ScomIPFSPath;
});
define("@scom/scom-storage/components/folder.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/data.ts", "@scom/scom-storage/components/index.css.ts"], function (require, exports, components_4, data_1, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSFolder = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomIPFSFolder = class ScomIPFSFolder extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.mode = 'list';
            this.sortMapping = {};
            this.pathMapping = {};
            this.onSort = this.onSort.bind(this);
            this.onChangeMode = this.onChangeMode.bind(this);
            this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
            this.onSearchClicked = this.onSearchClicked.bind(this);
            this.onHandleSearch = this.onHandleSearch.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get list() {
            return this._data?.list ?? [];
        }
        set list(value) {
            this._data.list = value ?? [];
        }
        get type() {
            return this._data?.type ?? 'dir';
        }
        set type(value) {
            this._data.type = value ?? 'dir';
        }
        get title() {
            return this._data?.title ?? '';
        }
        set title(value) {
            this._data.title = value ?? '';
        }
        get filteredList() {
            const value = this.inputSearch?.value || '';
            if (!value)
                return [...this.list];
            return [...this.list].filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        }
        get isGridMode() {
            return this.mode === 'grid';
        }
        get currentPath() {
            return this._currentPath;
        }
        setData(data) {
            this._data = data;
            const path = this.pnlPath.data.path || '';
            this._currentPath = path;
            const sortData = this.sortMapping[path] ?? 'desc';
            const isDown = sortData === 'desc';
            this.iconSort.name = isDown ? 'angle-up' : 'angle-down';
            const sortFn = (a, b) => isDown ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            const folders = [...this.list].filter(item => item.type === 'dir').sort(sortFn);
            const files = [...this.list].filter(item => item.type === 'file').sort(sortFn);
            if (isDown) {
                this.list = [...folders, ...files];
            }
            else {
                this.list = [...files, ...folders];
            }
            this.renderUI();
        }
        clear() {
            this.pnlPath.clear();
            this.pathMapping = {};
        }
        updatePath(data) {
            if (data.path != null)
                this.pathMapping[data.path] = data;
            this.pnlPath.setData(data);
        }
        renderUI() {
            this.inputSearch.width = '0%';
            this.pnlSearch.width = '2rem';
            this.inputSearch.value = '';
            const defaultTitle = this.type === 'dir' ? 'All Folders' : 'All Files';
            this.lblTitle.caption = this.title || defaultTitle;
            this.renderList();
        }
        async onBreadcrumbClick({ cid, path }) {
            let childData;
            if (this.pathMapping[path]) {
                childData = this.pathMapping[path];
            }
            else {
                childData = await this.onFetchData({ cid, path });
                this.pathMapping[path] = childData;
            }
            const paths = path.split('/');
            this.iconBack.visible = paths.length > 1;
            this.updatePath(childData);
            this.setData({ list: childData?.links ?? [], type: 'dir' });
        }
        renderList() {
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
                    const nodeEl = (this.$render("i-stack", { direction: direction, alignItems: align, gap: gap, padding: padding, cursor: 'pointer', class: this.isGridMode ? index_css_2.backgroundStyle : '', onClick: () => this.onFolderClick(nodeData) },
                        this.$render("i-icon", { stack: { grow: '0', shrink: '0' }, name: isDir ? 'folder' : 'file', fill: isDir ? Theme.colors.warning.main : Theme.colors.info.main, width: '2.5rem', height: '2.5rem' }),
                        this.$render("i-vstack", { width: "100%", minWidth: 0, gap: '0.5rem' },
                            this.$render("i-label", { caption: nodeData.name, font: { weight: 600, size: '1.125rem' }, textOverflow: 'ellipsis' }),
                            this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                                this.$render("i-label", { caption: `${(0, data_1.formatBytes)(nodeData.size)}`, opacity: 0.5, font: { size: '0.675rem' } })))));
                    this.pnlFolders.append(nodeEl);
                }
            }
        }
        async handleFolderClick(data) {
            let childData;
            if (this.pathMapping[data.path]) {
                childData = this.pathMapping[data.path];
            }
            else {
                childData = await this.onFetchData(data);
                this.pathMapping[data.path] = childData;
            }
            if (!childData.name && data.name)
                childData.name = data.name;
            this.updatePath(childData);
            this.setData({ list: childData?.links ?? [], type: 'dir' });
            this.iconBack.visible = true;
        }
        async onFolderClick(data) {
            if (this.onItemClicked)
                this.onItemClicked(data);
            if (data.type === 'file')
                return;
            await this.handleFolderClick(data);
        }
        onSort(target) {
            const path = this.pnlPath.data.path || 'main';
            const oldSort = this.sortMapping[path] ?? 'desc';
            const currentSort = oldSort === 'desc' ? 'asc' : 'desc';
            this.iconSort.name = currentSort === 'desc' ? 'angle-up' : 'angle-down';
            this.list.reverse();
            this.sortMapping[path] = currentSort;
            this.renderList();
        }
        onChangeMode(target) {
            this.mode = this.isGridMode ? 'list' : 'grid';
            this.iconList.name = this.isGridMode ? 'list' : 'th-large';
            this.renderList();
        }
        goBack() {
            const paths = this._currentPath?.split('/');
            paths.pop();
            const prevPath = paths?.join('/');
            if (prevPath != null && this.pathMapping[prevPath]) {
                const data = this.pathMapping[prevPath];
                this.updatePath(data);
                this.setData({ list: data?.links ?? [], type: 'dir' });
            }
            else {
                // if (this.onClose) this.onClose();
                // this.pnlPath.clear();
                // this.pathMapping = {};
            }
            this.iconBack.visible = paths.length > 1;
        }
        onSearchClicked() {
            if (Number(this.pnlSearch.width) > 32) {
                this.inputSearch.width = '0%';
                this.pnlSearch.width = '2rem';
            }
            else {
                this.pnlSearch.width = '100%';
                this.inputSearch.width = '100%';
                this.inputSearch.focus();
            }
        }
        onHandleSearch() {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
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
            if (data)
                this.setData(data);
        }
        render() {
            return (this.$render("i-vstack", { gap: "1.25rem", width: '100%', minHeight: 'inherit', background: { color: Theme.colors.primary.main }, padding: { top: '1.25rem' } },
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', padding: { left: '1.25rem', right: '1.25rem' }, gap: "1rem" },
                    this.$render("i-icon", { id: "iconBack", width: '1.25rem', height: '1.25rem', name: "arrow-left", fill: Theme.colors.primary.contrastText, cursor: 'pointer', onClick: this.goBack.bind(this), visible: false }),
                    this.$render("i-hstack", { id: "pnlSearch", verticalAlignment: 'center', horizontalAlignment: 'end', gap: "0.5rem", border: { radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider }, padding: { left: '0.5rem', right: '0.5rem' }, margin: { left: 'auto' }, height: '2rem', width: '2rem', position: 'relative', overflow: 'hidden', class: index_css_2.transitionStyle, cursor: 'pointer', background: { color: Theme.input.background } },
                        this.$render("i-input", { id: "inputSearch", height: "100%", width: '0px', background: { color: 'transparent' }, border: { style: 'none', radius: '0.5rem 0 0.5rem 0' }, onKeyUp: this.onHandleSearch, margin: { right: '2rem' } }),
                        this.$render("i-icon", { width: '2rem', height: '2rem', position: 'absolute', right: '0px', name: "search", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, stack: { grow: '0', shrink: '0' }, fill: Theme.colors.primary.contrastText, onClick: this.onSearchClicked }))),
                this.$render("i-panel", { padding: { left: '1.25rem', right: '1.25rem' }, visible: false },
                    this.$render("i-label", { id: "lblTitle", caption: 'All Folders', font: { weight: 600, size: '1.25rem', color: Theme.colors.primary.contrastText } })),
                this.$render("i-vstack", { width: '100%', border: { radius: '1.25rem 1.25rem 0 0' }, padding: { top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }, margin: { bottom: '-1px' }, background: { color: Theme.background.main }, stack: { grow: '1' } },
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.5rem', margin: { bottom: '1rem' } },
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: "0.5rem", cursor: 'pointer', onClick: this.onSort },
                            this.$render("i-label", { caption: 'Name', font: { size: '0.875rem', weight: 500 } }),
                            this.$render("i-icon", { id: "iconSort", name: "angle-up", width: '0.75rem', height: '0.75rem', fill: Theme.text.primary })),
                        this.$render("i-panel", { cursor: 'pointer', opacity: 0.5, hover: { opacity: 1 }, onClick: this.onChangeMode },
                            this.$render("i-icon", { id: "iconList", name: "th-large", width: '1rem', height: '1rem', fill: Theme.text.primary }))),
                    this.$render("i-scom-ipfs--path", { id: "pnlPath", display: 'flex', width: '100%', margin: { bottom: 10 }, isMobileView: true, onItemClicked: this.onBreadcrumbClick }),
                    this.$render("i-grid-layout", { id: "pnlFolders", width: '100%', stack: { grow: '1' }, templateColumns: ['minmax(0, 1fr)'] }))));
        }
    };
    ScomIPFSFolder = __decorate([
        (0, components_4.customElements)('i-scom-ipfs--mobile-folder')
    ], ScomIPFSFolder);
    exports.ScomIPFSFolder = ScomIPFSFolder;
});
define("@scom/scom-storage/components/home.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSMobileHome = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomIPFSMobileHome = class ScomIPFSMobileHome extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get recents() {
            return this._data?.recents ?? [];
        }
        set recents(value) {
            this._data.recents = value ?? [];
        }
        get folders() {
            return this._data?.folders ?? [];
        }
        set folders(value) {
            this._data.folders = value ?? [];
        }
        get transportEndpoint() {
            return this._transportEndpoint;
        }
        set transportEndpoint(value) {
            this._transportEndpoint = value;
        }
        get manager() {
            return this._manager;
        }
        get currentPath() {
            return this.mobileFolder.currentPath;
        }
        async setData(data) {
            this._data = data;
            // this.mobileMain.visible = true;
            // this.mobileFolder.visible = false;
            // this.renderRecent();
            // this.renderFolders();
            const list = [...this.folders];
            if (this._data.parentNode) {
                this.mobileFolder.updatePath({ ...this._data.parentNode, links: list });
                await this.manager.setRootCid(this._data.parentNode.cid);
            }
            this.mobileFolder.clear();
            this.mobileFolder.setData({ list: list, type: 'dir' });
        }
        // private renderFolders() {
        //     let items = [];
        //     for (let folder of this.folders) {
        //         const isDir = folder.type === 'dir';
        //         const itemEl = (
        //             <i-vstack
        //                 verticalAlignment='center'
        //                 gap='0.5rem'
        //                 padding={{ top: '2rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
        //                 border={{ radius: '0.5rem' }}
        //                 background={{ color: Theme.divider }}
        //                 margin={{ right: '0.5rem' }}
        //                 class={backgroundStyle}
        //                 cursor="pointer"
        //                 onClick={() => this.onFolderClick(folder)}
        //             >
        //                 <i-icon
        //                     stack={{ grow: '0', shrink: '0' }}
        //                     name={isDir ? 'folder' : 'file'}
        //                     fill={isDir ? Theme.colors.warning.main : Theme.colors.info.main}
        //                     width={'1.25rem'} height={'1.25rem'}
        //                 ></i-icon>
        //                 <i-vstack gap={'0.5rem'}>
        //                     <i-label caption={folder.name} font={{ weight: 600, size: '0.875rem' }} textOverflow='ellipsis'></i-label>
        //                     <i-hstack
        //                         verticalAlignment='center'
        //                         gap={'0.5rem'}
        //                     >
        //                         <i-label caption={`${folder.links?.length || 0} files`} opacity={0.5} font={{ size: '0.675rem' }} visible={isDir}></i-label>
        //                         <i-panel width={1} height={'0.75rem'} background={{ color: Theme.divider }} visible={isDir}></i-panel>
        //                         <i-label caption={`${formatBytes(folder.size)}`} opacity={0.5} font={{ size: '0.675rem' }}></i-label>
        //                     </i-hstack>
        //                 </i-vstack>
        //             </i-vstack>
        //         )
        //         items.push({
        //             name: '',
        //             controls: [
        //                 itemEl
        //             ]
        //         })
        //     }
        //     this.foldersSlider.items = items;
        //     this.foldersSlider.activeSlide = 0;
        // }
        // private renderRecent() {
        //     this.pnlRecent.clearInnerHTML();
        //     const recentList = [...this.recents].slice(0, 3);
        //     if (recentList?.length) {
        //         for (let nodeData of recentList) {
        //             const nodeEl = (
        //                 <i-hstack
        //                     verticalAlignment='center'
        //                     gap='1.5rem'
        //                     padding={{ top: '0.5rem', bottom: '0.5rem' }}
        //                 >
        //                     <i-icon
        //                         stack={{ grow: '0', shrink: '0' }}
        //                         name={'file'}
        //                         fill={Theme.colors.info.main}
        //                         border={{ radius: '0.25rem' }}
        //                         width={'2.5rem'} height={'2.5rem'}
        //                     ></i-icon>
        //                     <i-vstack gap={'0.5rem'}>
        //                         <i-label caption={nodeData.name} font={{ weight: 600, size: '0.875rem' }} textOverflow='ellipsis'></i-label>
        //                         <i-label caption={`${formatBytes(nodeData.size)}`} opacity={0.5} font={{ size: '0.675rem' }}></i-label>
        //                     </i-vstack>
        //                 </i-hstack>
        //             )
        //             this.pnlRecent.append(nodeEl);
        //         }
        //     }
        // }
        // private async onFolderClick(data: IIPFSData) {
        //     if (data.type === 'file') return;
        //     await this.mobileFolder.handleFolderClick(data);
        //     this.mobileMain.visible = false;
        //     this.mobileFolder.visible = true;
        // }
        // private onViewFiles() {
        //     this.mobileMain.visible = false;
        //     this.mobileFolder.setData({ list: [...this.recents], type: 'file' });
        //     this.mobileFolder.visible = true;
        // }
        // private onViewFolders() {
        //     this.mobileMain.visible = false;
        //     const list = [...this.folders];
        //     if (this._data.parentNode) this.mobileFolder.updatePath({ ...this._data.parentNode, links: list });
        //     this.mobileFolder.setData({ list: list, type: 'dir' });
        //     this.mobileFolder.visible = true;
        // }
        // private onBack() {
        //     this.mobileMain.visible = true;
        //     this.mobileFolder.visible = false;
        // }
        async onFetchData(ipfsData) {
            let fileNode;
            if (ipfsData.path) {
                fileNode = await this.manager.getFileNode(ipfsData.path);
            }
            else {
                fileNode = await this.manager.setRootCid(this._data.parentNode.cid);
            }
            if (!fileNode._cidInfo.links)
                fileNode._cidInfo.links = [];
            if (fileNode._cidInfo.links.length) {
                await Promise.all(fileNode._cidInfo.links.map(async (data) => {
                    data.path = `${ipfsData.path}/${data.name}`;
                    if (!data.type) {
                        let node = await this.manager.getFileNode(data.path);
                        let isFolder = await node.isFolder();
                        data.type = isFolder ? 'dir' : 'file';
                    }
                }));
            }
            fileNode._cidInfo.path = ipfsData.path;
            return fileNode._cidInfo;
        }
        onItemClicked(data) {
            if (data.type === 'file') {
                const { cid, name } = data;
                this.onPreview({ cid, name });
            }
        }
        init() {
            super.init();
            this.onPreview = this.onPreview.bind(this) || this.onPreview;
            const recents = this.getAttribute('recents', true);
            const folders = this.getAttribute('folders', true);
            this.transportEndpoint = this.getAttribute('transportEndpoint', true);
            this.setData({ recents, folders });
            this._manager = new components_5.IPFS.FileManager({
                endpoint: this.transportEndpoint
            });
        }
        render() {
            return (this.$render("i-panel", { width: '100%', minHeight: 'inherit' },
                this.$render("i-scom-ipfs--mobile-folder", { id: "mobileFolder", width: '100%', minHeight: '100%', display: 'block', 
                    // visible={false}
                    onFetchData: this.onFetchData.bind(this), onItemClicked: this.onItemClicked.bind(this) })));
        }
    };
    ScomIPFSMobileHome = __decorate([
        (0, components_5.customElements)('i-scom-ipfs--mobile-home')
    ], ScomIPFSMobileHome);
    exports.ScomIPFSMobileHome = ScomIPFSMobileHome;
});
define("@scom/scom-storage/components/uploadModal.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/assets.ts", "@scom/scom-storage/components/index.css.ts"], function (require, exports, components_6, assets_2, index_css_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSUploadModal = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    var FILE_STATUS;
    (function (FILE_STATUS) {
        FILE_STATUS[FILE_STATUS["LISTED"] = 0] = "LISTED";
        FILE_STATUS[FILE_STATUS["SUCCESS"] = 1] = "SUCCESS";
        FILE_STATUS[FILE_STATUS["FAILED"] = 2] = "FAILED";
        FILE_STATUS[FILE_STATUS["UPLOADING"] = 3] = "UPLOADING";
    })(FILE_STATUS || (FILE_STATUS = {}));
    const ITEMS_PER_PAGE = 5;
    ;
    ;
    let ScomIPFSUploadModal = class ScomIPFSUploadModal extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isForcedCancelled = false;
            this.currentPage = 1;
            this.currentFilterStatus = FILE_STATUS.LISTED;
            this.files = [];
            this.fileListData = [];
        }
        get rootCid() {
            return this._rootCid;
        }
        set rootCid(value) {
            console.log('set rootCid: ', value);
            this._rootCid = value;
        }
        get parentDir() {
            return this._parentDir;
        }
        set parentDir(value) {
            console.log('set parentDir: ', value);
            this._parentDir = value;
        }
        get manager() {
            return this._manager;
        }
        set manager(value) {
            this._manager = value;
        }
        show(path) {
            this.folderPath = path;
            this.updateBtnCaption();
        }
        onBeforeDrop(target) {
            console.log('onBeforeDrop: ', target);
            this.fileUploader.enabled = false;
            this.imgFile.url = assets_2.default.fullPath("img/loading-icon.svg");
            this.lblDrag.caption = 'Processing your files...';
        }
        onBeforeUpload(target, file) {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
        filteredFileListData() {
            return this.currentFilterStatus === FILE_STATUS.LISTED
                ? this.fileListData
                : this.fileListData.filter((i) => i.status === this.currentFilterStatus);
        }
        numPages() {
            return Math.ceil(this.filteredFileListData().length / ITEMS_PER_PAGE);
        }
        setCurrentPage(page) {
            if (page >= 1 && page <= this.numPages())
                this.currentPage = page;
            this.renderFileList();
            this.renderPagination();
        }
        get isSmallWidth() {
            return !!window.matchMedia('(max-width: 767px)').matches;
        }
        async renderFilterBar() {
            this.pnlFilterBar.clearInnerHTML();
            this.pnlFilterBar.append(this.$render("i-button", { class: `filter-btn ${this.currentFilterStatus === FILE_STATUS.LISTED ? 'filter-btn-active' : ''}`, caption: `All (${this.fileListData.length})`, onClick: () => this.onChangeCurrentFilterStatus(FILE_STATUS.LISTED) }), this.$render("i-button", { class: `filter-btn ${this.currentFilterStatus === FILE_STATUS.SUCCESS ? 'filter-btn-active' : ''}`, caption: `Success (${this.fileListData.filter((i) => i.status === FILE_STATUS.SUCCESS).length})`, onClick: () => this.onChangeCurrentFilterStatus(FILE_STATUS.SUCCESS) }), this.$render("i-button", { class: `filter-btn ${this.currentFilterStatus === FILE_STATUS.FAILED ? 'filter-btn-active' : ''}`, caption: `Fail (${this.fileListData.filter((i) => i.status === FILE_STATUS.FAILED).length})`, onClick: () => this.onChangeCurrentFilterStatus(FILE_STATUS.FAILED) }), this.$render("i-button", { class: `filter-btn ${this.currentFilterStatus === FILE_STATUS.UPLOADING ? 'filter-btn-active' : ''}`, caption: `Uploading (${this.fileListData.filter((i) => i.status === FILE_STATUS.UPLOADING).length})`, onClick: () => this.onChangeCurrentFilterStatus(FILE_STATUS.UPLOADING) }));
            this.pnlFilterActions.clearInnerHTML();
            if (this.currentFilterStatus === FILE_STATUS.UPLOADING) {
                this.pnlFilterActions.appendChild(this.$render("i-button", { caption: "Cancel", onClick: this.onCancel.bind(this) }));
            }
            else {
                this.pnlFilterActions.appendChild(this.$render("i-button", { caption: "Clear", onClick: this.onClear.bind(this) }));
            }
        }
        async renderFileList() {
            this.pnlFileList.clearInnerHTML();
            const filteredFileListData = this.filteredFileListData();
            const paginatedFilteredFileListData = this.isSmallWidth ? this.fileListData : [...filteredFileListData].slice((this.currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE * this.currentPage);
            for (let i = 0; i < paginatedFilteredFileListData.length; i++) {
                const fileData = paginatedFilteredFileListData[i];
                const pnlRow2 = (this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem" },
                    this.$render("i-label", { maxWidth: "100%", caption: this.formatBytes(fileData.file.size || 0), font: { size: '0.75rem' }, textOverflow: "ellipsis", opacity: 0.75 })));
                this.renderStatus(fileData.status, pnlRow2);
                this.pnlFileList.appendChild(this.$render("i-hstack", { class: `file file-${i} status-${fileData.status}`, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, stack: { shrink: '0', grow: '1' }, overflow: "hidden", gap: "1rem" },
                    this.$render("i-icon", { width: "1.75rem", height: "1.75rem", name: "file", fill: Theme.colors.primary.main, border: { radius: '0.5rem', width: '1px', color: Theme.divider, style: 'solid' }, padding: { top: '0.35rem', bottom: '0.35rem', left: '0.35rem', right: '0.35rem' }, stack: { shrink: '0' } }),
                    this.$render("i-vstack", { maxWidth: "100%", stack: { shrink: '1', grow: '1' }, gap: "0.25rem", overflow: "hidden" },
                        this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "1rem" },
                            this.$render("i-label", { maxWidth: "100%", caption: fileData.file.path || fileData.file.name, font: { weight: 600, size: '0.875rem' }, textOverflow: "ellipsis" }),
                            this.$render("i-icon", { width: "0.875rem", height: "0.875rem", name: "times", fill: Theme.text.primary, cursor: "pointer", onClick: () => this.onRemoveFile(i) })),
                        pnlRow2,
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.75rem" },
                            this.$render("i-progress", { height: "auto", percent: +fileData.percentage, strokeWidth: 10, stack: { grow: '1', shrink: '1', basis: '60%' }, border: { radius: '0.5rem' } }),
                            this.$render("i-label", { caption: `${fileData.percentage}%`, font: { size: '0.75rem' }, stack: { grow: '1', shrink: '0' } })))));
            }
        }
        formatBytes(bytes, decimals = 2) {
            if (bytes === 0)
                return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        renderStatus(status, parent) {
            let uploadStatus = "";
            let iconOptions = { name: 'times', background: { color: Theme.text.primary }, visible: false };
            switch (status) {
                case 1:
                    iconOptions.name = 'check';
                    iconOptions.background.color = Theme.colors.success.main;
                    iconOptions.visible = true;
                    uploadStatus = 'Completed';
                    break;
                case 2:
                    iconOptions.name = 'times';
                    iconOptions.background.color = Theme.colors.error.main;
                    iconOptions.visible = true;
                    uploadStatus = 'Failed';
                case 3:
                    uploadStatus = 'Uploading';
            }
            parent.appendChild(this.$render("i-icon", { width: "0.875rem", height: "0.875rem", padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '50%' }, fill: Theme.colors.primary.contrastText, ...iconOptions }));
            parent.appendChild(this.$render("i-label", { caption: uploadStatus }));
        }
        getPagination(currentIndex, totalPages) {
            let current = currentIndex, last = totalPages, delta = 2, left = current - delta, right = current + delta + 1, range = [], rangeWithDots = [], l;
            for (let i = 1; i <= last; i++) {
                if (i == 1 || i == last || (i >= left && i < right)) {
                    range.push(i);
                }
            }
            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    }
                    else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }
            return rangeWithDots;
        }
        async renderPagination() {
            const numPages = this.numPages();
            const rangeWithDots = this.getPagination(this.currentPage, numPages);
            if (numPages >= 1) {
                if (this.currentPage > numPages) {
                    this.setCurrentPage(numPages);
                }
                else {
                    this.pnlPagination.clearInnerHTML();
                    const prevBtn = new components_6.Button(this.pnlPagination, {
                        icon: { name: 'chevron-left' },
                    });
                    prevBtn.onClick = () => {
                        this.setCurrentPage(this.currentPage - 1);
                    };
                    for (let i = 0; i < rangeWithDots.length; i++) {
                        const pageBtn = new components_6.Button(this.pnlPagination, {
                            class: this.currentPage === rangeWithDots[i] ? 'active' : '',
                            caption: rangeWithDots[i].toString(),
                        });
                        if (rangeWithDots[i] === '...') {
                            pageBtn.classList.add('dots');
                        }
                        else {
                            pageBtn.onClick = () => {
                                this.setCurrentPage(rangeWithDots[i]);
                            };
                        }
                    }
                    const nexBtn = new components_6.Button(this.pnlPagination, {
                        icon: { name: 'chevron-right' },
                    });
                    nexBtn.onClick = () => {
                        this.setCurrentPage(this.currentPage + 1);
                    };
                }
            }
            else {
                this.pnlPagination.clearInnerHTML();
            }
        }
        onChangeCurrentFilterStatus(status) {
            this.currentFilterStatus = status;
            this.renderFilterBar();
            this.renderPagination();
            this.renderFileList();
        }
        onClear() {
            switch (this.currentFilterStatus) {
                case FILE_STATUS.LISTED:
                    this.fileListData =
                        this.fileListData && this.fileListData.length
                            ? this.fileListData.filter((fileData) => ![
                                FILE_STATUS.LISTED,
                                FILE_STATUS.SUCCESS,
                                FILE_STATUS.FAILED,
                            ].includes(fileData.status))
                            : this.fileListData;
                    break;
                case FILE_STATUS.SUCCESS:
                    this.fileListData =
                        this.fileListData && this.fileListData.length
                            ? this.fileListData.filter((fileData) => ![FILE_STATUS.SUCCESS].includes(fileData.status))
                            : this.fileListData;
                    break;
                case FILE_STATUS.FAILED:
                    this.fileListData =
                        this.fileListData && this.fileListData.length
                            ? this.fileListData.filter((fileData) => ![FILE_STATUS.FAILED].includes(fileData.status))
                            : this.fileListData;
                    break;
            }
            this.renderFilterBar();
            this.renderFileList();
            this.renderPagination();
        }
        onCancel() {
            this.currentRequest.abort();
            this.isForcedCancelled = true;
        }
        async onChangeFile(source, files) {
            console.log('onChangeFile: ', files);
            return new Promise(async (resolve, reject) => {
                if (!files.length)
                    reject();
                this.fileUploader.enabled = true;
                this.imgFile.url = assets_2.default.fullPath("img/file-icon.png");
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
            });
        }
        updateBtnCaption() {
            this.lblDrag.caption = this.isSmallWidth ? 'Select Files' : 'Drag and drop your files here';
        }
        onRemove(source, file) { }
        onRemoveFile(index) {
            this.fileListData.splice(index, 1);
            this.files.splice(index, 1);
            this.renderFileList();
            this.renderFilterBar();
            this.renderPagination();
            if (!this.fileListData.length) {
                this.toggle(false);
            }
        }
        getDirItems(cidItem, result) {
            result = result || [];
            if (cidItem.type == 'dir') {
                let items = [];
                if (cidItem.links) {
                    for (let i = 0; i < cidItem.links?.length; i++) {
                        let item = cidItem.links[i];
                        if (item.type == 'dir')
                            this.getDirItems(item, result);
                        items.push({
                            cid: item.cid,
                            name: item.name,
                            size: item.size,
                            type: item.type,
                        });
                    }
                }
                result.push({
                    cid: cidItem.cid,
                    name: cidItem.name,
                    size: cidItem.size,
                    type: 'dir',
                    links: items,
                });
            }
            return result;
        }
        // private async onUpload() {
        //     return new Promise(async (resolve, reject) => {
        //         if (!this.fileListData.length) reject();
        //         this.btnUpload.caption = 'Uploading files to IPFS...';
        //         this.btnUpload.enabled = false;
        //         this.isForcedCancelled = false;
        //         // const cidItems: ICidInfo = await hashFiles(this.files);
        //         const cidItems: ICidInfo = {} as ICidInfo;
        //         console.dir('### IPFS Upload ###');
        //         console.log('cidItems: ', cidItems);
        //         let dirItems = this.getDirItems(cidItems);
        //         console.log('dirItems: ', dirItems);
        //         if (this.parentDir && this.rootCid) {
        //             // uploadTo
        //             const oldParentDirCID = cidItems.cid;
        //             dirItems = dirItems.filter(
        //                 (dirItem) => dirItem.cid !== oldParentDirCID
        //             );
        //             const items: IUploadItem[] = [];
        //             for (let i = 0; i < dirItems.length; i++) {
        //                 let item = dirItems[i];
        //                 items.push({ cid: item });
        //             }
        //             for (let i = 0; i < this.fileListData.length; i++) {
        //                 const file = this.fileListData[i];
        //                 const cidItem = cidItems.links?.find(
        //                     (cidItem) => cidItem.cid === file.file.cid?.cid
        //                 );
        //                 if (cidItem) items.push({ cid: cidItem, data: file.file });
        //             }
        //             try {
        //                 const uploadResult = await application.uploadTo(
        //                     this.parentDir.cid as string,
        //                     items as any
        //                 );
        //                 console.log('uploadToResult: ', uploadResult);
        //                 if (uploadResult && uploadResult.data) {
        //                     uploadResult.data.name = this.parentDir.name as string;
        //                     // Sync root folder
        //                     if (this.parentDir.cid !== this.rootCid) {
        //                         const syncResult = await application.uploadTo(this.rootCid, [
        //                             { cid: uploadResult.data },
        //                         ]);
        //                         console.log('syncResult: ', syncResult);
        //                         if (syncResult && syncResult.data) {
        //                             if (this.onBeforeUploaded)
        //                                 this.onBeforeUploaded(this, syncResult.data);
        //                         }
        //                     } else {
        //                         if (this.onBeforeUploaded)
        //                             this.onBeforeUploaded(this, uploadResult.data);
        //                     }
        //                     for (let i = 0; i < this.fileListData.length; i++) {
        //                         const file = this.fileListData[i];
        //                         if (this.onUploaded && file.file.cid)
        //                             this.onUploaded(this, file.file, file.file.cid?.cid);
        //                         file.status = FILE_STATUS.SUCCESS;
        //                     }
        //                     this.renderFilterBar();
        //                     this.renderFileList();
        //                 }
        //             } catch (err) {
        //                 console.log('Error! ', err);
        //             }
        //         } else {
        //             // upload
        //             if (this.onBeforeUploaded) this.onBeforeUploaded(this, cidItems);
        //             let uploadUrl = await application.getUploadUrl(cidItems as any);
        //             for (let i = 0; i < dirItems.length; i++) {
        //                 let item = dirItems[i];
        //                 if (uploadUrl[item.cid]) {
        //                     await application.upload(uploadUrl[item.cid], JSON.stringify(item));
        //                 }
        //             }
        //             for (let i = 0; i < this.fileListData.length; i++) {
        //                 if (this.isForcedCancelled) {
        //                     break;
        //                 } else {
        //                     const file = this.fileListData[i];
        //                     file.url = `/ipfs/${cidItems.cid}${file.file.path || file.file.name
        //                         }`;
        //                     if (
        //                         [FILE_STATUS.SUCCESS, FILE_STATUS.UPLOADING].includes(
        //                             file.status
        //                         ) ||
        //                         !file.file.cid?.cid
        //                     ) {
        //                         continue;
        //                     }
        //                     this.fileListData[i].status = FILE_STATUS.UPLOADING;
        //                     this.renderFilterBar();
        //                     if (uploadUrl[file.file.cid?.cid]) {
        //                         try {
        //                             let result = await application.upload(
        //                                 uploadUrl[file.file.cid?.cid],
        //                                 file.file
        //                             );
        //                             console.log('uploaded fileListData result: ', result);
        //                             if (this.onUploaded)
        //                                 this.onUploaded(this, file.file, file.file.cid?.cid);
        //                             this.fileListData[i].status = FILE_STATUS.SUCCESS;
        //                             this.renderFilterBar();
        //                             this.renderFileList();
        //                         } catch (err) {
        //                             console.log('Error! ', err);
        //                             this.fileListData[i].status = FILE_STATUS.FAILED;
        //                         }
        //                     }
        //                 }
        //             }
        //             this.renderFilterBar();
        //             this.renderFileList();
        //             this.renderPagination();
        //             this.btnUpload.caption = 'Upload file to IPFS';
        //             this.btnUpload.enabled = true;
        //         }
        //     });
        // }
        async onUpload() {
            return new Promise(async (resolve, reject) => {
                if (!this.fileListData.length || !this.manager)
                    reject();
                this.btnUpload.caption = 'Uploading files to IPFS...';
                this.btnUpload.enabled = false;
                this.isForcedCancelled = false;
                try {
                    for (let i = 0; i < this.fileListData.length; i++) {
                        const file = this.fileListData[i];
                        const filePath = this.folderPath ? `${this.folderPath}/${file.file.name}` : file.file.name;
                        await this.manager.addFile(filePath, file.file);
                    }
                    await this.manager.applyUpdates();
                    for (let i = 0; i < this.fileListData.length; i++) {
                        const file = this.fileListData[i];
                        file.status = FILE_STATUS.SUCCESS;
                        file.percentage = 100;
                    }
                    let rootNode = await this.manager.getRootNode();
                    if (this.onUploaded)
                        this.onUploaded(this, rootNode.cid);
                    this.renderFilterBar();
                    this.renderFileList();
                    this.renderPagination();
                    this.btnUpload.caption = 'Upload file to IPFS';
                    this.btnUpload.enabled = true;
                }
                catch (err) {
                    console.log('Error! ', err);
                }
            });
        }
        reset() {
            this.pnlFileList.clearInnerHTML();
            this.pnlPagination.clearInnerHTML();
            this.btnUpload.caption = 'Upload file to IPFS';
            this.btnUpload.enabled = true;
            this.fileListData = [];
            this.files = [];
            this.toggle(false);
        }
        toggle(showFileList) {
            if (showFileList) {
                this.pnlStatusFilter.visible = true;
                this.btnUpload.visible = true;
                this.pnlNote.visible = false;
            }
            else {
                this.pnlStatusFilter.visible = false;
                this.btnUpload.visible = false;
                this.pnlNote.visible = true;
            }
        }
        async init() {
            super.init();
            this.classList.add(index_css_3.uploadModalStyle);
            this.rootCid = this.getAttribute('rootCid', true);
            this.parentDir = this.getAttribute('parentDir', true);
        }
        render() {
            return (this.$render("i-panel", { height: "100%", overflow: "hidden", padding: { top: '3.125rem', bottom: '3.125rem', left: '8.125rem', right: '8.125rem' }, border: { radius: '0.375rem' }, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            padding: { top: '1.5rem', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }
                        }
                    }
                ] },
                this.$render("i-label", { class: "heading", caption: "Upload more files" }),
                this.$render("i-label", { class: "label", caption: "Choose file to upload to IPFS network" }),
                this.$render("i-panel", { class: "file-uploader-dropzone", maxHeight: "calc(100% - 4.5rem)" },
                    this.$render("i-panel", { class: "droparea" },
                        this.$render("i-upload", { id: "fileUploader", multiple: true, draggable: true, onBeforeDrop: this.onBeforeDrop, onUploading: this.onBeforeUpload, onChanged: this.onChangeFile, onRemoved: this.onRemove }),
                        this.$render("i-image", { id: "imgFile", width: 60, height: 60, class: "icon", url: assets_2.default.fullPath('img/file-icon.png') }),
                        this.$render("i-label", { id: "lblDrag", caption: "Drag and drop your files here" })),
                    this.$render("i-panel", { id: "pnlStatusFilter", class: "status-filter", visible: false },
                        this.$render("i-panel", { id: "pnlFilterBar", class: "filter-bar" }),
                        this.$render("i-panel", { id: "pnlFilterActions", class: "filter-actions", margin: { left: 'auto' } })),
                    this.$render("i-vstack", { id: "pnlFileList", class: "filelist", gap: "0.5rem" }),
                    this.$render("i-panel", { id: "pnlPagination", class: "pagination" }),
                    this.$render("i-button", { id: "btnUpload", class: "upload-btn", caption: "Upload files to IPFS", boxShadow: "none", background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, visible: false, onClick: this.onUpload })),
                this.$render("i-panel", { id: "pnlNote" },
                    this.$render("i-panel", { class: "note" },
                        this.$render("i-label", { class: "head", caption: "Public Data" }),
                        this.$render("i-label", { class: "desc", caption: "All data uploaded to IPFS Explorer is available to anyone who requests it using the correct CID. Do not store any private or sensitive information in an unencrypted form using IPFS Explorer." })),
                    this.$render("i-panel", { class: "note" },
                        this.$render("i-label", { class: "head", caption: "Permanent Data" }),
                        this.$render("i-label", { class: "desc", caption: "Deleting files from the IPFS Explorer site\u2019s Files page will remove them from the file listing for your account, but that doesn\u2019t prevent nodes on the decentralized storage network from retaining copies of the data indefinitely. Do not use IPFS Explorer for data that may need to be permanently deleted in the future." })))));
        }
    };
    ScomIPFSUploadModal = __decorate([
        (0, components_6.customElements)('i-scom-ipfs--upload-modal')
    ], ScomIPFSUploadModal);
    exports.ScomIPFSUploadModal = ScomIPFSUploadModal;
});
define("@scom/scom-storage/components/index.ts", ["require", "exports", "@scom/scom-storage/components/home.tsx", "@scom/scom-storage/components/path.tsx", "@scom/scom-storage/components/uploadModal.tsx"], function (require, exports, home_1, path_1, uploadModal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSUploadModal = exports.ScomIPFSPath = exports.ScomIPFSMobileHome = void 0;
    Object.defineProperty(exports, "ScomIPFSMobileHome", { enumerable: true, get: function () { return home_1.ScomIPFSMobileHome; } });
    Object.defineProperty(exports, "ScomIPFSPath", { enumerable: true, get: function () { return path_1.ScomIPFSPath; } });
    Object.defineProperty(exports, "ScomIPFSUploadModal", { enumerable: true, get: function () { return uploadModal_1.ScomIPFSUploadModal; } });
});
define("@scom/scom-storage/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_7.Styles.Theme.ThemeVars;
    exports.default = components_7.Styles.style({
        $nest: {
            '.storage-meter-uploaded': {
                backgroundSize: '410%',
                backgroundPosition: '0% 0px',
                transition: '.25s ease-out',
                filter: 'drop-shadow(0 2px 8px rgba(33,15,85,.33))',
            },
            'i-table .i-table-cell': {
                background: Theme.background.main
            }
        }
    });
});
define("@scom/scom-storage/utils.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEmbedElement = void 0;
    const getEmbedElement = async (moduleData, parent, callback) => {
        const { module, data } = moduleData;
        const elm = await components_8.application.createElement(module, true);
        if (!elm)
            throw new Error('not found');
        elm.parent = parent;
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders') : null;
        if (elm.ready)
            await elm.ready();
        elm.maxWidth = '100%';
        elm.maxHeight = '100%';
        elm.display = 'block';
        if (builderTarget?.setData && data.properties) {
            await builderTarget.setData(data.properties);
        }
        if (builderTarget?.setTag && data.tag) {
            await builderTarget.setTag(data.tag);
        }
        if (callback)
            callback(elm);
        return elm;
    };
    exports.getEmbedElement = getEmbedElement;
});
define("@scom/scom-storage/components/preview.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/components/index.css.ts", "@scom/scom-storage/data.ts", "@scom/scom-storage/utils.ts"], function (require, exports, components_9, index_css_4, data_2, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSPreview = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomIPFSPreview = class ScomIPFSPreview extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                cid: '',
                name: ''
            };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get name() {
            return this._data.name;
        }
        set name(value) {
            this._data.name = value;
        }
        get cid() {
            return this._data.cid;
        }
        set cid(value) {
            this._data.cid = value;
        }
        setData(value) {
            this._data = value;
            this.renderUI();
        }
        clear() {
            this.pnlPreview.clearInnerHTML();
        }
        renderUI() {
            this.clear();
            this.previewFile();
        }
        async previewFile() {
            try {
                const moduleData = await this.getModuleFromExtension();
                if (moduleData?.module) {
                    await (0, utils_1.getEmbedElement)(moduleData, this.pnlPreview);
                }
                else if (moduleData?.data) {
                    let content = moduleData.data || '';
                    const isHTML = content.indexOf('<html') > -1;
                    if (isHTML) {
                        content = content.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                        console.log(content);
                    }
                    this.appendLabel(content);
                }
                else {
                    this.appendLabel('No preview available');
                }
            }
            catch (error) { }
        }
        async getModuleFromExtension() {
            const { cid, name } = this._data;
            if (!cid)
                return null;
            const url = `${data_2.IPFS_GATEWAY}${cid}`;
            let moduleData = {
                module: '',
                data: null,
            };
            const ext = (name || '').split('.').pop().toLowerCase();
            const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
            const videodExts = ['mp4', 'webm', 'mov'];
            const audioExts = ['mp3', 'wav', 'ogg'];
            const streamingExts = ['m3u8'];
            const mdExts = ['md'];
            if (imgExts.includes(ext)) {
                moduleData = this.createImageElement(url);
            }
            else if (videodExts.includes(ext)) {
                moduleData = this.createVideoElement(url);
            }
            else if (audioExts.includes(ext)) {
                moduleData = this.createVideoElement(url);
            }
            else if (streamingExts.includes(ext)) {
                moduleData = this.createPlayerElement(url);
            }
            else {
                const result = await (0, data_2.getFileContent)(cid);
                if (!result)
                    return null;
                if (mdExts.includes(ext)) {
                    moduleData = this.createTextElement(result);
                }
                else {
                    moduleData = { module: '', data: result };
                }
            }
            return moduleData;
        }
        appendLabel(text) {
            const label = (this.$render("i-label", { width: '100%', overflowWrap: 'anywhere', class: index_css_4.customLinkStyle, lineHeight: 1.2, display: 'block', maxHeight: '100%', font: { size: '0.875rem' } }));
            const hrefRegex = /https?:\/\/\S+/g;
            text = text
                .replace(/\n/gm, ' <br> ')
                .replace(/\s/g, '&nbsp;')
                .replace(hrefRegex, (match) => {
                return ` <a href="${match}" target="_blank">${match}</a> `;
            });
            label.caption = text;
            this.pnlPreview.appendChild(label);
        }
        createTextElement(text) {
            return {
                module: '@scom/scom-markdown-editor',
                data: {
                    properties: {
                        content: text,
                    },
                    tag: {
                        width: '100%',
                        pt: 0,
                        pb: 0,
                        pl: 0,
                        pr: 0,
                    },
                },
            };
        }
        createImageElement(url) {
            return {
                module: '@scom/scom-image',
                data: {
                    properties: {
                        url: url,
                    },
                    tag: {
                        width: '100%',
                        pt: 0,
                        pb: 0,
                        pl: 0,
                        pr: 0,
                    },
                },
            };
        }
        createVideoElement(url, tag) {
            return {
                module: '@scom/scom-video',
                data: {
                    properties: {
                        url: url,
                    },
                    tag: {
                        width: '100%',
                        ...tag,
                    },
                },
            };
        }
        createPlayerElement(url, tag) {
            return {
                module: '@scom/scom-media-player',
                data: {
                    properties: {
                        url: url,
                    },
                    tag: {
                        width: '100%',
                        ...tag,
                    },
                },
            };
        }
        init() {
            super.init();
            const name = this.getAttribute('name', true);
            const cid = this.getAttribute('cid', true);
            this.setData({ name, cid });
        }
        render() {
            return (this.$render("i-vstack", { id: 'pnlPreview', width: '100%', height: '100%', overflow: { y: 'auto' }, padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }, verticalAlignment: 'center', horizontalAlignment: 'center' }));
        }
    };
    ScomIPFSPreview = __decorate([
        (0, components_9.customElements)('i-scom-ipfs--preview')
    ], ScomIPFSPreview);
    exports.ScomIPFSPreview = ScomIPFSPreview;
});
define("@scom/scom-storage", ["require", "exports", "@ijstech/components", "@scom/scom-storage/data.ts", "@scom/scom-storage/components/index.ts", "@scom/scom-storage/index.css.ts"], function (require, exports, components_10, data_3, components_11, index_css_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomStorage = void 0;
    const Theme = components_10.Styles.Theme.ThemeVars;
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
    };
    let ScomStorage = class ScomStorage extends components_10.Module {
        constructor() {
            super(...arguments);
            this.tag = {
                light: {},
                dark: {}
            };
            this._data = { cid: '' };
            this.filesColumns = [
                {
                    title: '',
                    fieldName: 'checkbox'
                },
                {
                    title: 'Name',
                    fieldName: 'name',
                    onRenderCell: (source, columnData, rowData) => {
                        switch (rowData.type) {
                            case 'dir':
                                return (this.$render("i-hstack", { verticalAlignment: "center", gap: "0.375rem" },
                                    this.$render("i-panel", { stack: { basis: '1rem' } },
                                        this.$render("i-icon", { name: "folder", width: '0.875rem', height: '0.875rem', display: "inline-flex", fill: "#fddd35" })),
                                    this.$render("i-label", { caption: columnData, font: { size: '0.875rem' } })));
                            case 'file':
                                return (this.$render("i-hstack", { verticalAlignment: "center", gap: "0.375rem" },
                                    this.$render("i-panel", { stack: { basis: '1rem' } },
                                        this.$render("i-icon", { name: "file", width: '0.875rem', height: '0.875rem', display: "inline-flex", fill: "#298de0" })),
                                    this.$render("i-label", { caption: columnData, font: { size: '0.875rem' } })));
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
                    onRenderCell: (source, columnData, rowData) => {
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
                    onRenderCell: (source, columnData, rowData) => {
                        return (0, data_3.formatBytes)(columnData);
                    },
                },
                {
                    title: '',
                    fieldName: 'blank',
                },
            ];
            this.columns = this.filesColumns.slice();
            this._uploadedTreeData = [];
            this._uploadedFileNodes = {};
        }
        async setData(value) {
            this._data = value;
            await this.initContent();
        }
        getData() {
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
            ];
        }
        getPropertiesSchema() {
            const schema = {
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
        _getActions() {
            const propertiesSchema = this.getPropertiesSchema();
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { cid: '' };
                        return {
                            execute: () => {
                                oldData = { ...this._data };
                                if (userInputData?.cid)
                                    this._data.cid = userInputData.cid;
                                this.initContent();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = { ...oldData };
                                this.initContent();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: propertiesSchema
                }
            ];
            return actions;
        }
        getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
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
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
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
        async initContent() {
            if (!this._data.cid)
                return;
            let rootNode = await this.manager.getRootNode();
            const ipfsData = rootNode._cidInfo;
            // const ipfsData = await fetchData({ cid: this._data.cid });
            // this._storedFileData = null;
            if (ipfsData) {
                const parentNode = (({ links, ...o }) => o)(ipfsData);
                parentNode.name = parentNode.name ? parentNode.name : components_10.FormatUtils.truncateWalletAddress(parentNode.cid);
                parentNode.path = '';
                parentNode.root = true;
                if (ipfsData.links?.length) {
                    await Promise.all(ipfsData.links.map(async (data) => {
                        data.path = `${parentNode.path}/${data.name}`;
                        if (!data.type) {
                            let node = await this.manager.getFileNode(`/${data.name}`);
                            let isFolder = await node.isFolder();
                            data.type = isFolder ? 'dir' : 'file';
                        }
                    }));
                }
                const data = ipfsData.links ? [parentNode, ...ipfsData.links] : [parentNode];
                this._uploadedTreeData = [...data];
                this.renderUploadedFileTreeUI();
                this.fileTable.data = this.processTableData(ipfsData);
                // this.mobileFolder.setData({ list: ipfsData.links ?? [] });
                this.mobileHome.setData({
                    recents: [...ipfsData.links].filter(item => item.type === 'file'),
                    folders: ipfsData.links ?? [],
                    parentNode: parentNode
                });
                if (parentNode.name)
                    this.pnlPath.setData(parentNode);
            }
        }
        async renderUploadedFileTreeUI(needReset = true, path) {
            if (needReset) {
                this.uploadedFileTree.clear();
                this._uploadedFileNodes = {};
            }
            for (let nodeData of this._uploadedTreeData) {
                await this.addUploadedFileNode(nodeData, path);
            }
        }
        async addUploadedFileNode(nodeData, path) {
            const name = nodeData.name;
            let idx = '';
            let items = nodeData.path?.split('/') ?? [];
            let node = null;
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
                        const isActive = path ? nodeData.path === path : nodeData.root;
                        if (nodeData.path === path)
                            node.active = true;
                        if (isActive || path?.startsWith(nodeData.path + "/"))
                            node.expanded = true;
                    }
                    else {
                        node = self._uploadedFileNodes[idx];
                        if (node && node.tag && idx === `/${nodeData.path}`)
                            node.tag.cid = nodeData.cid;
                    }
                    if (node && nodeData.root)
                        node.expanded = true;
                }
            }
        }
        async onUpdateContent({ data, toggle }) {
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
        onUpdateBreadcumbs(node) {
            this.pnlPath.setData(node);
        }
        async onFilesUploaded(source, rootCid) {
            this._data.cid = rootCid;
            const rootNode = await this.manager.setRootCid(rootCid);
            console.log("new root node cid: ", rootNode.cid);
            const ipfsData = rootNode._cidInfo;
            let path;
            if (window.matchMedia('(max-width: 767px)').matches) {
                path = this.mobileHome.currentPath;
            }
            else {
                path = this.pnlPath.data.path;
            }
            if (ipfsData) {
                const parentNode = (({ links, ...o }) => o)(ipfsData);
                parentNode.name = parentNode.name ? parentNode.name : components_10.FormatUtils.truncateWalletAddress(parentNode.cid);
                parentNode.path = '';
                parentNode.root = true;
                if (ipfsData.links?.length) {
                    await Promise.all(ipfsData.links.map(async (data) => {
                        data.path = `${parentNode.path}/${data.name}`;
                        if (!data.type) {
                            let node = await this.manager.getFileNode(`/${data.name}`);
                            let isFolder = await node.isFolder();
                            data.type = isFolder ? 'dir' : 'file';
                        }
                    }));
                }
                let data = ipfsData.links ? [parentNode, ...ipfsData.links] : [parentNode];
                let tableData;
                this.pnlPath.clear();
                if (parentNode.name)
                    this.pnlPath.setData(parentNode);
                if (path) {
                    const childrenData = await this.onFetchData({ path: path });
                    childrenData.links.map((child) => (child.path = `${parentNode.path}/${child.name}`));
                    data.push(...childrenData.links);
                    tableData = { ...childrenData };
                    let pathData = (({ links, ...o }) => o)(tableData);
                    pathData.name = pathData.name ? pathData.name : pathData.cid;
                    pathData.path = `${childrenData.path}`;
                    this.pnlPath.setData(pathData);
                }
                else {
                    tableData = ipfsData;
                }
                this._uploadedTreeData = [...data];
                this.renderUploadedFileTreeUI(true, path);
                this.fileTable.data = this.processTableData(tableData);
                this.mobileHome.setData({
                    recents: [...ipfsData.links].filter(item => item.type === 'file'),
                    folders: ipfsData.links ?? [],
                    parentNode: parentNode
                });
            }
        }
        onOpenUploadModal() {
            if (!this.uploadModal) {
                this.uploadModal = new components_11.ScomIPFSUploadModal();
                this.uploadModal.onUploaded = this.onFilesUploaded.bind(this);
            }
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
            }
            else {
                path = this.pnlPath.data.path;
                this.uploadModal.manager = this.manager;
            }
            this.uploadModal.show(path);
            modal.refresh();
        }
        async onActiveChange(parent, prevNode) {
            const ipfsData = parent.activeItem?.tag;
            await this.onOpenFolder(ipfsData, true);
        }
        async onOpenFolder(ipfsData, toggle) {
            if (ipfsData) {
                const childrenData = await this.onFetchData(ipfsData);
                this.onUpdateContent({ data: { ...childrenData }, toggle });
                if (childrenData.links)
                    childrenData.links.map((child) => (child.path = `${ipfsData.path}/${child.name}`));
                this.fileTable.data = this.processTableData({ ...childrenData });
            }
        }
        async onFetchData(ipfsData) {
            let fileNode;
            if (ipfsData.path) {
                fileNode = await this.manager.getFileNode(ipfsData.path);
            }
            else {
                fileNode = await this.manager.setRootCid(this._data.cid);
            }
            if (!fileNode._cidInfo.links)
                fileNode._cidInfo.links = [];
            if (fileNode._cidInfo.links.length) {
                await Promise.all(fileNode._cidInfo.links.map(async (data) => {
                    data.path = `${ipfsData.path}/${data.name}`;
                    if (!data.type) {
                        let node = await this.manager.getFileNode(data.path);
                        let isFolder = await node.isFolder();
                        data.type = isFolder ? 'dir' : 'file';
                    }
                }));
            }
            if (!fileNode._cidInfo.name) {
                if (ipfsData.name)
                    fileNode._cidInfo.name = ipfsData.name;
                else if (fileNode.name)
                    fileNode._cidInfo.name = fileNode.name;
            }
            fileNode._cidInfo.path = ipfsData.path;
            return fileNode._cidInfo;
        }
        processTableData(ipfsData) {
            const processedData = [];
            if (ipfsData && ipfsData.links && ipfsData.links.length) {
                const sortFn = (a, b) => a.name.localeCompare(b.name);
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
        onCellClick(target, rowIndex, columnIdx, record) {
            this.iePreview.clear();
            if (record.type === 'dir') {
                this.onOpenFolder(record, true);
            }
            else {
                const { cid, name } = record;
                this.previewFile({ cid, name });
            }
        }
        previewFile(record) {
            const { cid, name } = record;
            this.iePreview.visible = true;
            this.iePreview.setData({ cid, name });
            if (window.matchMedia('(max-width: 767px)').matches) {
                this.iePreview.openModal({
                    width: '100vw',
                    height: '100vh',
                    padding: { top: 0, bottom: 0, left: 0, right: 0 },
                    border: { radius: 0 },
                    overflow: 'auto',
                    closeIcon: {
                        name: 'times',
                        width: '1rem', height: '1rem',
                        fill: Theme.text.primary,
                        margin: { top: '1rem', right: '1rem', bottom: '1rem', left: '1rem' }
                    },
                    onClose: () => {
                        if (!window.matchMedia('(max-width: 767px)').matches) {
                            this.gridWrapper.appendChild(this.iePreview);
                            this.iePreview.visible = false;
                            this.bdPreview.visible = false;
                            this.gridWrapper.templateColumns = [
                                '15rem',
                                '1px',
                                '1fr'
                            ];
                        }
                    }
                });
            }
            else {
                if (!this.gridWrapper.contains(this.iePreview))
                    this.gridWrapper.appendChild(this.iePreview);
                this.bdPreview.visible = true;
                this.gridWrapper.templateColumns = [
                    '15rem',
                    '1px',
                    'auto',
                    '1px',
                    '20rem'
                ];
            }
        }
        onBreadcrumbClick({ cid, path }) {
            if (this.uploadedFileTree.activeItem)
                this.uploadedFileTree.activeItem.expanded = true;
            this.onOpenFolder({ cid, path }, false);
        }
        init() {
            this.transportEndpoint = this.getAttribute('transportEndpoint', true) || window.location.origin;
            super.init();
            this.classList.add(index_css_5.default);
            this.setTag(defaultColors);
            const cid = this.getAttribute('cid', true);
            this.manager = new components_10.IPFS.FileManager({
                endpoint: this.transportEndpoint,
                rootCid: cid
            });
            if (cid)
                this.setData({ cid });
        }
        render() {
            return (this.$render("i-panel", { height: '100%', width: '100%' },
                this.$render("i-scom-ipfs--mobile-home", { id: "mobileHome", width: '100%', minHeight: '100vh', display: 'block', background: { color: Theme.background.main }, onPreview: this.previewFile.bind(this), transportEndpoint: this.transportEndpoint, visible: false, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                visible: true
                            }
                        }
                    ] }),
                this.$render("i-vstack", { height: '100%', width: '100%', overflow: 'hidden', maxHeight: '100vh', background: { color: Theme.background.main }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                visible: false,
                                maxWidth: '100%'
                            }
                        }
                    ] },
                    this.$render("i-panel", { stack: { grow: '1', basis: '0%' }, overflow: 'hidden' },
                        this.$render("i-grid-layout", { id: 'gridWrapper', height: '100%', overflow: 'hidden', templateColumns: ['15rem', '1px', '1fr'], background: { color: Theme.background.main }, mediaQueries: [
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        templateColumns: ['auto'],
                                        templateRows: ['auto']
                                    }
                                }
                            ] },
                            this.$render("i-vstack", { id: 'ieSidebar', height: '100%', overflow: { y: 'auto' } },
                                this.$render("i-tree-view", { id: "uploadedFileTree", class: "file-manager-tree uploaded", onActiveChange: this.onActiveChange, stack: { grow: '1' }, maxHeight: '100%', overflow: 'auto' })),
                            this.$render("i-panel", { width: 1, cursor: 'col-resize', zIndex: 15, background: { color: Theme.colors.secondary.light }, mediaQueries: [
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            visible: false,
                                            maxWidth: '100%'
                                        }
                                    }
                                ] }),
                            this.$render("i-vstack", { id: 'ieContent', height: '100%', overflow: { y: 'auto' } },
                                this.$render("i-scom-ipfs--path", { id: "pnlPath", display: 'flex', width: '100%', padding: { left: '1rem', right: '1rem' }, onItemClicked: this.onBreadcrumbClick }),
                                this.$render("i-panel", { width: '100%', height: 'auto', border: { radius: 1 } },
                                    this.$render("i-panel", { border: {
                                            top: { width: '0.0625rem', style: 'solid', color: 'rgba(117, 122, 155, .15)' }
                                        }, background: { color: Theme.colors.primary.contrastText } },
                                        this.$render("i-table", { id: "fileTable", heading: true, columns: this.columns, headingStyles: {
                                                font: { size: '0.75rem', weight: 700, color: Theme.text.primary },
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' },
                                                height: '2rem',
                                                background: { color: '#f8f9fa' }
                                            }, bodyStyles: {
                                                font: { size: '0.75rem', color: Theme.text.primary },
                                                padding: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' },
                                                height: '2.25rem',
                                                cursor: 'pointer'
                                            }, onCellClick: this.onCellClick })))),
                            this.$render("i-panel", { id: "bdPreview", width: 1, cursor: 'col-resize', zIndex: 15, background: { color: Theme.colors.secondary.light }, visible: false, mediaQueries: [
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            visible: false,
                                            maxWidth: '100%'
                                        }
                                    }
                                ] }),
                            this.$render("i-scom-ipfs--preview", { id: "iePreview", width: '100%', height: '100%', display: 'block', visible: false })))),
                this.$render("i-button", { boxShadow: '0 10px 25px -5px rgba(44, 179, 240, 0.6)', border: { radius: '50%' }, background: { color: Theme.colors.primary.light }, lineHeight: '3.375rem', width: '3.375rem', height: '3.375rem', icon: { name: 'plus', width: '1.125rem', height: ' 1.125rem', fill: Theme.colors.primary.contrastText }, position: 'absolute', bottom: '3.125rem', right: '3.125rem', zIndex: 100, onClick: this.onOpenUploadModal, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                position: 'fixed',
                                bottom: '4rem',
                                right: '1.25rem'
                            }
                        }
                    ] })));
        }
    };
    ScomStorage = __decorate([
        (0, components_10.customElements)('i-scom-storage')
    ], ScomStorage);
    exports.ScomStorage = ScomStorage;
});
