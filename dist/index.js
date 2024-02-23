var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
define("@scom/scom-storage/inteface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-storage/data.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatBytes = exports.fetchData = exports.autoRetryGetContent = void 0;
    const IPFS_GATEWAY = 'https://ipfs.scom.dev/ipfs/';
    const autoRetryGetContent = async (cid) => {
        return new Promise((resolve, reject) => {
            const load = async (counter) => {
                try {
                    if (counter >= 10)
                        return reject();
                    const response = await fetch(`${IPFS_GATEWAY}${cid}`);
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
define("@scom/scom-storage/components/path.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSPath = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomIPFSPath = class ScomIPFSPath extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.breadcrumb = {};
            this._data = {
                cid: ''
            };
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
                            const folderName = data.name || components_2.FormatUtils.truncateWalletAddress(data.cid) || '';
                            const item = (this.$render("i-hstack", { verticalAlignment: "center", gap: "0.25rem" },
                                nodePath != node.path ? (this.$render("i-button", { caption: folderName, font: { size: '0.75rem' }, boxShadow: 'none', background: { color: 'transparent' }, onClick: () => this.onBreadcrumbClick({ cid: data.cid, path: nodePath }) })) : (this.$render("i-label", { caption: folderName, font: { size: '0.75rem' } })),
                                this.$render("i-icon", { name: "chevron-right", width: "0.675rem", height: "0.675rem", fill: Theme.text.primary })));
                            elmPath.push(item);
                        }
                    }
                    this.pnlAddress.clearInnerHTML();
                    this.pnlAddress.visible = !!elmPath.length;
                    this.pnlAddress.append(...elmPath);
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
            const data = this.getAttribute('data', true);
            if (data)
                this.setData(data);
        }
        render() {
            return (this.$render("i-hstack", { id: 'pnlAddress', verticalAlignment: "center", padding: { top: '0.5rem', bottom: '0.5rem' }, height: '2.188rem', gap: '0.25rem', visible: false }));
        }
    };
    ScomIPFSPath = __decorate([
        (0, components_2.customElements)('i-scom-ipfs--path')
    ], ScomIPFSPath);
    exports.ScomIPFSPath = ScomIPFSPath;
});
define("@scom/scom-storage/components/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-storage/assets.ts"], function (require, exports, components_3, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transitionStyle = exports.backgroundStyle = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.backgroundStyle = components_3.Styles.style({
        backgroundColor: Theme.divider,
        aspectRatio: '3 / 2',
        '-webkit-mask': `url(${assets_1.default.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
        mask: `url(${assets_1.default.fullPath('img/bg.svg')}) no-repeat 100% 100%`,
        '-webkit-mask-size': 'cover',
        maskSize: 'cover'
    });
    exports.transitionStyle = components_3.Styles.style({
        '-webkit-transition': 'width 0.4s ease-in-out',
        transition: 'width 0.4s ease-in-out'
    });
});
define("@scom/scom-storage/components/folder.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/data.ts", "@scom/scom-storage/components/index.css.ts"], function (require, exports, components_4, data_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomIPFSFolder = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomIPFSFolder = class ScomIPFSFolder extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.mode = 'list';
            this.sortMapping = {};
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
        setData(data) {
            this._data = data;
            const path = this.pnlPath.data.path || 'main';
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
        updatePath(data) {
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
            let childData = await this.onFetchData({ cid, path });
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
                    const nodeEl = (this.$render("i-stack", { direction: direction, alignItems: align, gap: gap, padding: padding, cursor: 'pointer', class: this.isGridMode ? index_css_1.backgroundStyle : '', onClick: () => this.onFolderClick(nodeData) },
                        this.$render("i-icon", { stack: { grow: '0', shrink: '0' }, name: isDir ? 'folder' : 'file', fill: isDir ? Theme.colors.warning.main : Theme.colors.info.main, width: '2.5rem', height: '2.5rem' }),
                        this.$render("i-vstack", { width: "100%", minWidth: 0, gap: '0.5rem' },
                            this.$render("i-label", { caption: nodeData.name, font: { weight: 600, size: '1.125rem' }, textOverflow: 'ellipsis' }),
                            this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                                this.$render("i-label", { caption: `${nodeData.links?.length || 0} files`, opacity: 0.5, font: { size: '0.675rem' }, visible: isDir }),
                                this.$render("i-panel", { width: 1, height: '0.75rem', background: { color: Theme.divider }, visible: isDir }),
                                this.$render("i-label", { caption: `${(0, data_1.formatBytes)(nodeData.size)}`, opacity: 0.5, font: { size: '0.675rem' } })))));
                    this.pnlFolders.append(nodeEl);
                }
            }
        }
        async onFolderClick(data) {
            if (data.type === 'file')
                return;
            let childData = await this.onFetchData(data);
            this.updatePath(childData);
            this.setData({ list: childData?.links ?? [], type: 'dir' });
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
            if (this.onClose)
                this.onClose();
            this.pnlPath.clear();
        }
        onSearchClicked() {
            if (Number(this.pnlSearch.width) > 32) {
                this.inputSearch.width = '0%';
                this.pnlSearch.width = '2rem';
            }
            else {
                this.pnlSearch.width = '100%';
                this.inputSearch.width = '100%';
            }
        }
        onHandleSearch() {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.renderList();
            }, 1000);
        }
        init() {
            super.init();
            this.onFetchData = this.getAttribute('onFetchData', true) || this.onFetchData;
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
            const data = this.getAttribute('data', true);
            if (data)
                this.setData(data);
        }
        render() {
            return (this.$render("i-vstack", { gap: "1.25rem", width: '100%', minHeight: 'inherit', background: { color: Theme.colors.primary.main }, padding: { top: '1.25rem' } },
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', padding: { left: '1.25rem', right: '1.25rem' }, gap: "1rem" },
                    this.$render("i-icon", { width: '1.25rem', height: '1.25rem', name: "arrow-left", fill: Theme.colors.primary.contrastText, cursor: 'pointer', onClick: this.goBack.bind(this) }),
                    this.$render("i-hstack", { id: "pnlSearch", verticalAlignment: 'center', horizontalAlignment: 'end', gap: "0.5rem", border: { radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider }, padding: { left: '0.5rem', right: '0.5rem' }, height: '2rem', width: '2rem', position: 'relative', overflow: 'hidden', class: index_css_1.transitionStyle, cursor: 'pointer', background: { color: Theme.input.background } },
                        this.$render("i-input", { id: "inputSearch", height: "100%", width: '0px', background: { color: 'transparent' }, border: { style: 'none', radius: '0.5rem 0 0.5rem 0' }, onKeyUp: this.onHandleSearch, margin: { right: '2rem' } }),
                        this.$render("i-icon", { width: '2rem', height: '2rem', position: 'absolute', right: '0px', name: "search", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, stack: { grow: '0', shrink: '0' }, fill: Theme.colors.primary.contrastText, onClick: this.onSearchClicked }))),
                this.$render("i-panel", { padding: { left: '1.25rem', right: '1.25rem' } },
                    this.$render("i-label", { id: "lblTitle", caption: 'All Folders', font: { weight: 600, size: '1.25rem', color: Theme.colors.primary.contrastText } })),
                this.$render("i-vstack", { width: '100%', border: { radius: '1.25rem 1.25rem 0 0' }, padding: { top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }, margin: { bottom: '-1px' }, background: { color: Theme.background.main }, stack: { grow: '1' } },
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.5rem', margin: { bottom: '1rem' } },
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: "0.5rem", cursor: 'pointer', onClick: this.onSort },
                            this.$render("i-label", { caption: 'Name', font: { size: '0.875rem', weight: 500 } }),
                            this.$render("i-icon", { id: "iconSort", name: "angle-up", width: '0.75rem', height: '0.75rem', fill: Theme.text.primary })),
                        this.$render("i-panel", { cursor: 'pointer', opacity: 0.5, hover: { opacity: 1 }, onClick: this.onChangeMode },
                            this.$render("i-icon", { id: "iconList", name: "th-large", width: '1rem', height: '1rem', fill: Theme.text.primary }))),
                    this.$render("i-scom-ipfs--path", { id: "pnlPath", display: 'flex', width: '100%', margin: { bottom: 10 }, onItemClicked: this.onBreadcrumbClick }),
                    this.$render("i-grid-layout", { id: "pnlFolders", width: '100%', stack: { grow: '1' }, templateColumns: ['minmax(0, 1fr)'] }))));
        }
    };
    ScomIPFSFolder = __decorate([
        (0, components_4.customElements)('i-scom-ipfs--mobile-folder')
    ], ScomIPFSFolder);
    exports.ScomIPFSFolder = ScomIPFSFolder;
});
define("@scom/scom-storage/components/home.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage/data.ts", "@scom/scom-storage/components/index.css.ts"], function (require, exports, components_5, data_2, index_css_2) {
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
        setData(data) {
            this._data = data;
            this.mobileMain.visible = true;
            this.mobileFolder.visible = false;
            this.renderRecent();
            this.renderFolders();
        }
        renderFolders() {
            let items = [];
            for (let folder of this.folders) {
                const isDir = folder.type === 'dir';
                const itemEl = (this.$render("i-vstack", { verticalAlignment: 'center', gap: '0.5rem', padding: { top: '2rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { radius: '0.5rem' }, background: { color: Theme.divider }, margin: { right: '0.5rem' }, class: index_css_2.backgroundStyle, cursor: "pointer", onClick: () => this.onFolderClick(folder) },
                    this.$render("i-icon", { stack: { grow: '0', shrink: '0' }, name: isDir ? 'folder' : 'file', fill: isDir ? Theme.colors.warning.main : Theme.colors.info.main, width: '1.25rem', height: '1.25rem' }),
                    this.$render("i-vstack", { gap: '0.5rem' },
                        this.$render("i-label", { caption: folder.name, font: { weight: 600, size: '0.875rem' }, textOverflow: 'ellipsis' }),
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                            this.$render("i-label", { caption: `${folder.links?.length || 0} files`, opacity: 0.5, font: { size: '0.675rem' }, visible: isDir }),
                            this.$render("i-panel", { width: 1, height: '0.75rem', background: { color: Theme.divider }, visible: isDir }),
                            this.$render("i-label", { caption: `${(0, data_2.formatBytes)(folder.size)}`, opacity: 0.5, font: { size: '0.675rem' } })))));
                items.push({
                    name: '',
                    controls: [
                        itemEl
                    ]
                });
            }
            this.foldersSlider.items = items;
        }
        renderRecent() {
            this.pnlRecent.clearInnerHTML();
            const recentList = [...this.recents].slice(0, 3);
            if (recentList?.length) {
                for (let nodeData of recentList) {
                    const nodeEl = (this.$render("i-hstack", { verticalAlignment: 'center', gap: '1.5rem', padding: { top: '0.5rem', bottom: '0.5rem' } },
                        this.$render("i-icon", { stack: { grow: '0', shrink: '0' }, name: 'file', fill: Theme.colors.info.main, border: { radius: '0.25rem' }, width: '2.5rem', height: '2.5rem' }),
                        this.$render("i-vstack", { gap: '0.5rem' },
                            this.$render("i-label", { caption: nodeData.name, font: { weight: 600, size: '0.875rem' }, textOverflow: 'ellipsis' }),
                            this.$render("i-label", { caption: `${(0, data_2.formatBytes)(nodeData.size)}`, opacity: 0.5, font: { size: '0.675rem' } }))));
                    this.pnlRecent.append(nodeEl);
                }
            }
        }
        async onFolderClick(data) {
            if (data.type === 'file')
                return;
            let childData = await this.onFetchData(data);
            this.mobileMain.visible = false;
            if (!childData.name && data.name)
                childData.name = data.name;
            this.mobileFolder.updatePath(childData);
            this.mobileFolder.setData({ list: childData?.links ?? [], type: 'dir' });
            this.mobileFolder.visible = true;
        }
        onViewFiles() {
            this.mobileMain.visible = false;
            this.mobileFolder.setData({ list: [...this.recents], type: 'file' });
            this.mobileFolder.visible = true;
        }
        onViewFolders() {
            this.mobileMain.visible = false;
            this.mobileFolder.setData({ list: [...this.folders], type: 'dir' });
            this.mobileFolder.visible = true;
        }
        onBack() {
            this.mobileMain.visible = true;
            this.mobileFolder.visible = false;
        }
        async onFetchData(ipfsData) {
            const childrenData = await (0, data_2.autoRetryGetContent)(ipfsData.cid);
            childrenData.path = ipfsData.path;
            if (childrenData.links) {
                for (let child of childrenData.links) {
                    child.path = `${ipfsData.path}/${child.name}`;
                    // child.links = (await autoRetryGetContent(child.cid))?.links || [];
                }
            }
            return childrenData;
        }
        init() {
            super.init();
            const recents = this.getAttribute('recents', true);
            const folders = this.getAttribute('folders', true);
            this.setData({ recents, folders });
        }
        render() {
            return (this.$render("i-panel", { width: '100%', minHeight: 'inherit' },
                this.$render("i-vstack", { id: "mobileMain", gap: "1.5rem", width: '100%', padding: { top: '1.25rem', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' } },
                    this.$render("i-vstack", { gap: "1.25rem" },
                        this.$render("i-label", { caption: 'Your storage', font: { size: '1.5rem', weight: 600 } }),
                        this.$render("i-vstack", { id: 'storageBar', padding: { top: '0.75rem', right: '0.75rem', left: '0.75rem', bottom: '0.75rem' }, background: { color: Theme.colors.primary.main }, border: { radius: '1rem' }, gap: '0.5rem', width: '100%' },
                            this.$render("i-label", { caption: "Avaliable space", font: { color: Theme.colors.primary.contrastText, size: '1rem', weight: 700 } }),
                            this.$render("i-hstack", { position: "relative", verticalAlignment: "center", border: { radius: '1rem' }, height: '1.5rem', overflow: 'hidden', zIndex: 1, background: { color: Theme.colors.secondary.main } },
                                this.$render("i-panel", { id: 'pnlMeter', class: "storage-meter-uploaded", position: "absolute", left: '-2rem', top: 0, background: { color: Theme.colors.primary.light }, border: { radius: '1rem' }, width: `calc(max(7.29%, 0.25rem) + 2rem)`, height: '100%', zIndex: 10 })),
                            this.$render("i-hstack", { class: "storage-used", verticalAlignment: "center", gap: "0.125rem", margin: { bottom: '0.75rem' } },
                                this.$render("i-label", { id: 'lblUsed', caption: "0", font: { color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true } }),
                                this.$render("i-label", { caption: "of", font: { color: Theme.colors.primary.contrastText, size: '0.75rem' } }),
                                this.$render("i-label", { caption: "5 GiB", font: { color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true } }),
                                this.$render("i-label", { caption: "used", font: { color: Theme.colors.primary.contrastText, size: '0.75rem' } })))),
                    this.$render("i-panel", null,
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: "0.5rem", margin: { bottom: '1.25rem' } },
                            this.$render("i-label", { caption: 'All folders', font: { size: '0.875rem', transform: 'uppercase', weight: 600 } }),
                            this.$render("i-label", { caption: 'See All', font: { size: '0.875rem', weight: 500 }, cursor: 'pointer', onClick: this.onViewFolders })),
                        this.$render("i-carousel-slider", { id: "foldersSlider", width: '100%', slidesToShow: 2, indicators: false, swipe: true })),
                    this.$render("i-panel", null,
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: "0.5rem", margin: { bottom: '0.75rem' } },
                            this.$render("i-label", { caption: 'Recent file', font: { size: '0.875rem', transform: 'uppercase', weight: 600 } }),
                            this.$render("i-label", { caption: 'See All', font: { size: '0.875rem', weight: 500 }, cursor: 'pointer', onClick: this.onViewFiles })),
                        this.$render("i-vstack", { id: "pnlRecent", gap: "0.5rem", width: '100%' }))),
                this.$render("i-scom-ipfs--mobile-folder", { id: "mobileFolder", width: '100%', minHeight: '100%', display: 'block', visible: false, onFetchData: this.onFetchData.bind(this), onClose: this.onBack.bind(this) })));
        }
    };
    ScomIPFSMobileHome = __decorate([
        (0, components_5.customElements)('i-scom-ipfs--mobile-home')
    ], ScomIPFSMobileHome);
    exports.ScomIPFSMobileHome = ScomIPFSMobileHome;
});
define("@scom/scom-storage/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    exports.default = components_6.Styles.style({
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
define("@scom/scom-storage", ["require", "exports", "@ijstech/components", "@scom/scom-storage/data.ts", "@scom/scom-storage/index.css.ts"], function (require, exports, components_7, data_3, index_css_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomStorage = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
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
    let ScomStorage = class ScomStorage extends components_7.Module {
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
                                    this.$render("i-label", { caption: columnData })));
                            case 'file':
                                return (this.$render("i-hstack", { verticalAlignment: "center", gap: "0.375rem" },
                                    this.$render("i-panel", { stack: { basis: '1rem' } },
                                        this.$render("i-icon", { name: "file", width: '0.875rem', height: '0.875rem', display: "inline-flex", fill: "#298de0" })),
                                    this.$render("i-label", { caption: columnData })));
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
            this.currentParentDir = null;
            this.breadcrumb = {};
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
            const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
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
            const ipfsData = await (0, data_3.fetchData)({ cid: this._data.cid });
            // this._storedFileData = null;
            if (ipfsData) {
                const parentNode = (({ links, ...o }) => o)(ipfsData);
                parentNode.name = parentNode.name ? parentNode.name : components_7.FormatUtils.truncateWalletAddress(parentNode.cid);
                parentNode.path = parentNode.name;
                parentNode.root = true;
                if (ipfsData.links)
                    ipfsData.links.map((data) => (data.path = `${parentNode.path}/${data.name}`));
                const data = ipfsData.links ? [parentNode, ...ipfsData.links] : [parentNode];
                this._uploadedTreeData = [...data];
                this.renderUploadedFileTreeUI();
                this.breadcrumb[parentNode.path] = parentNode;
                this.fileTable.data = this.processTableData(ipfsData);
                // this.mobileFolder.setData({ list: ipfsData.links ?? [] });
                this.mobileHome.setData({
                    recents: [...ipfsData.links].filter(item => item.type === 'file'),
                    folders: ipfsData.links ?? [],
                });
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
        async addUploadedFileNode(nodeData) {
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
                        if (nodeData.root)
                            node.active = true;
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
        onOpenUploadModal() {
            components_7.application.showUploadModal();
        }
        async onActiveChange(parent, prevNode) {
            const ipfsData = parent.activeItem?.tag;
            await this.onOpenFolder(ipfsData, true);
        }
        async onOpenFolder(ipfsData, toggle) {
            if (ipfsData && ipfsData.cid) {
                this.currentParentDir = ipfsData;
                const childrenData = await this.onFetchData(ipfsData);
                this.onUpdateContent({ data: { ...childrenData }, toggle });
                if (childrenData.links)
                    childrenData.links.map((child) => (child.path = `${ipfsData.path}/${child.name}`));
                this.fileTable.data = this.processTableData({ ...childrenData });
            }
        }
        async onFetchData(ipfsData) {
            const childrenData = await (0, data_3.autoRetryGetContent)(ipfsData.cid);
            childrenData.path = ipfsData.path;
            return childrenData;
        }
        processTableData(ipfsData) {
            const processedData = [];
            if (ipfsData && ipfsData.links && ipfsData.links.length) {
                ipfsData.links.forEach((data) => {
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
            if (record.type === 'dir') {
                this.onOpenFolder(record, true);
            }
        }
        onBreadcrumbClick({ cid, path }) {
            if (this.uploadedFileTree.activeItem)
                this.uploadedFileTree.activeItem.expanded = true;
            this.onOpenFolder({ cid, path }, false);
        }
        init() {
            super.init();
            this.classList.add(index_css_3.default);
            this.setTag(defaultColors);
            const cid = this.getAttribute('cid', true);
            if (cid)
                this.setData({ cid });
        }
        render() {
            return (this.$render("i-panel", { height: '100%', width: '100%' },
                this.$render("i-scom-ipfs--mobile-home", { id: "mobileHome", width: '100%', minHeight: '100vh', display: 'block', background: { color: Theme.background.main }, visible: false, mediaQueries: [
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
                                visible: false
                            }
                        }
                    ] },
                    this.$render("i-panel", { stack: { grow: '1', basis: '0%' }, overflow: 'hidden' },
                        this.$render("i-grid-layout", { id: 'pnlExplorer', height: '100%', overflow: 'hidden', templateColumns: ['15rem', '1px', '1fr'], background: { color: Theme.background.main }, mediaQueries: [
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        templateColumns: ['auto'],
                                        templateRows: ['auto']
                                    }
                                }
                            ] },
                            this.$render("i-vstack", { id: 'ieSidebar', height: '100%', overflow: { y: 'auto' } },
                                this.$render("i-tree-view", { id: "uploadedFileTree", class: "file-manager-tree uploaded", onActiveChange: this.onActiveChange, stack: { grow: '1' }, maxHeight: '100%', overflow: 'auto' }),
                                this.$render("i-vstack", { id: 'storageBar', mediaQueries: [
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                position: 'fixed',
                                                bottom: 0,
                                                left: 0,
                                                zIndex: 999,
                                                width: '100%'
                                            }
                                        }
                                    ] },
                                    this.$render("i-panel", { padding: { top: '0.5rem', right: '0.5rem', left: '0.5rem', bottom: '0.5rem' }, background: { color: Theme.colors.primary.dark }, border: { bottom: { style: 'solid', width: '1px', color: Theme.background.main } } },
                                        this.$render("i-label", { caption: "Editable Part", font: { color: Theme.colors.primary.contrastText, size: '0.875rem' } })),
                                    this.$render("i-vstack", { class: "storage-container", padding: { top: '0.75rem', right: '0.75rem', left: '0.75rem', bottom: '1.5rem' }, background: { color: Theme.colors.primary.dark } },
                                        this.$render("i-hstack", { class: "storage-used", verticalAlignment: "center", gap: "0.125rem", margin: { bottom: '0.75rem' } },
                                            this.$render("i-label", { caption: "Storage: ", font: { color: Theme.colors.primary.contrastText, size: '0.75rem', weight: 700 } }),
                                            this.$render("i-label", { id: 'lblUsed', caption: "0", font: { color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true } }),
                                            this.$render("i-label", { caption: "of", font: { color: Theme.colors.primary.contrastText, size: '0.75rem' } }),
                                            this.$render("i-label", { caption: "5 GiB", font: { color: Theme.colors.primary.contrastText, size: '0.75rem', italic: true } }),
                                            this.$render("i-label", { caption: "used", font: { color: Theme.colors.primary.contrastText, size: '0.75rem' } })),
                                        this.$render("i-hstack", { position: "relative", verticalAlignment: "center", border: { radius: '1rem' }, height: '1.5rem', overflow: 'hidden', zIndex: 1, background: { color: Theme.colors.secondary.main } },
                                            this.$render("i-panel", { id: 'pnlMeter', class: "storage-meter-uploaded", position: "absolute", left: '-2rem', top: 0, background: { color: Theme.colors.primary.light }, border: { radius: '1rem' }, width: `calc(max(7.29%, 0.25rem) + 2rem)`, height: '100%', zIndex: 10 }))))),
                            this.$render("i-panel", { width: 1, cursor: 'col-resize', zIndex: 15, background: { color: Theme.colors.secondary.light }, mediaQueries: [
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            visible: false
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
                                            }, onCellClick: this.onCellClick }))))))),
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
        (0, components_7.customElements)('i-scom-storage')
    ], ScomStorage);
    exports.ScomStorage = ScomStorage;
});
