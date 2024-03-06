import {
  Container,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Styles,
} from '@ijstech/components'
import { customLinkStyle } from './index.css'
import { formatBytes, getFileContent } from '../data'
import { getEmbedElement } from '../utils';
import { IPreview } from '../interface';
import { ScomIPFSEditor } from '../components/index';
const Theme = Styles.Theme.ThemeVars

type fileChangedCallback = (filePath: string, content: string) => void

interface ScomIPFSPreviewElement extends ControlElement {
  data?: IPreview;
  onClose?: () => void;
  onOpenEditor?: () => void;
  onCloseEditor?: () => void;
  onFileChanged?: fileChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-ipfs--preview']: ScomIPFSPreviewElement
    }
  }
}

@customElements('i-scom-ipfs--preview')
export class ScomIPFSPreview extends Module {
  private previewer: Panel;
  private lblName: Label;
  private lblSize: Label;
  private pnlEdit: Panel;
  private previewerPanel: Panel;
  private editorPanel: Panel;
  private editor: ScomIPFSEditor;

  private _data: IPreview = {
    cid: '',
    name: ''
  }
  private currentContent: string = '';
  onClose: () => void
  onOpenEditor: () => void;
  onCloseEditor: () => void;
  onFileChanged: fileChangedCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.closePreview = this.closePreview.bind(this)
  }

  static async create(options?: ScomIPFSPreviewElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get data() {
    return this._data
  }
  set data(value: IPreview) {
    this._data = value
  }

  get transportEndpoint(): string {
    return this._data?.transportEndpoint
  }
  set transportEndpoint(value: string) {
    this._data.transportEndpoint = value
  }

  setData(value: IPreview) {
    this.data = value
    this.renderUI()
  }

  clear() {
    this.previewer.clearInnerHTML()
    this.lblName.caption = ''
    this.lblSize.caption = ''
  }

  private renderUI() {
    this.clear();
    this.previewFile();
    this.renderFileInfo();
  }

  private renderFileInfo() {
    this.lblName.caption = this._data?.name || '';
    this.lblSize.caption = formatBytes(this._data?.size || 0);
  }

  private async previewFile() {
    this.pnlEdit.visible = false;
    try {
      const moduleData = await this.getModuleFromExtension()
      if (moduleData?.module) {
        await getEmbedElement(moduleData, this.previewer)
      } else if (moduleData?.data) {
        let content = moduleData.data || ''
        const isHTML = content.indexOf('<html') > -1
        if (isHTML) {
          content = content.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
        }
        this.appendLabel(content)
      } else {
        this.renderFilePreview()
      }
    } catch (error) { }
  }

  private async getModuleFromExtension() {
    const { cid, name, parentCid } = this._data;
    if (!cid) return null
    let moduleData = {
      module: '',
      data: null,
    }
    const ext = (name || '').split('.').pop().toLowerCase()
    const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'svg']
    const videodExts = ['mp4', 'webm', 'mov']
    const audioExts = ['mp3', 'wav', 'ogg']
    const streamingExts = ['m3u8']
    const mdExts = ['md']
    const mediaUrl = `${this.transportEndpoint}/ipfs/${parentCid}/${name}`

    if (imgExts.includes(ext)) {
      moduleData = this.createImageElement(mediaUrl)
    } else if (videodExts.includes(ext)) {
      moduleData = this.createVideoElement(mediaUrl)
    } else if (audioExts.includes(ext)) {
      moduleData = this.createVideoElement(mediaUrl)
    } else if (streamingExts.includes(ext)) {
      moduleData = this.createPlayerElement(mediaUrl)
    } else if (mdExts.includes(ext)) {
      let content = '';
      this.pnlEdit.visible = true;
      try {
        const result = await fetch(mediaUrl);
        content = await result.text();
      } catch(err) {}
      this.currentContent = content;
      moduleData = this.createTextElement(content)
    } else {
      const result = await getFileContent(mediaUrl)
      if (!result) return null
      if (mdExts.includes(ext)) {
        moduleData = this.createTextElement(result)
      } else {
        moduleData = { module: '', data: result }
      }
    }
    return moduleData
  }

  private appendLabel(text: string) {
    const label = (
      <i-label
        width={'100%'}
        overflowWrap='anywhere'
        class={customLinkStyle}
        lineHeight={1.2}
        display='block'
        maxHeight={'100%'}
        font={{ size: '0.875rem' }}
      ></i-label>
    ) as Label
    const hrefRegex = /https?:\/\/\S+/g
    text = text
      .replace(/\n/gm, ' <br> ')
      .replace(/\s/g, '&nbsp;')
      .replace(hrefRegex, (match) => {
        return ` <a href="${match}" target="_blank">${match}</a> `
      })
    label.caption = text
    this.previewer.appendChild(label)
  }

  private renderFilePreview() {
    const wrapper = <i-panel width={'100%'}>
      <i-hstack
        horizontalAlignment='center'
      >
        <i-icon width={'3rem'} height={'3rem'} name="file"></i-icon>
      </i-hstack>
    </i-panel>
    this.previewer.appendChild(wrapper)
  }

  private createTextElement(text: string) {
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
    }
  }

  private createImageElement(url: string) {
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
    }
  }

  private createVideoElement(url: string, tag?: any) {
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
    }
  }

  private createPlayerElement(url: string, tag?: any) {
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
    }
  }

  private closePreview() {
    if (this.onClose) this.onClose()
  }

  private async downloadFile() {
    let url = `${this.transportEndpoint}/ipfs/${this._data.parentCid}/${this._data.name}`;
    try {
      let response = await fetch(url);
      let blob = await response.blob();
      var objectUrl = window.URL.createObjectURL(blob); 
      var a = document.createElement('a');
      a.href = objectUrl;
      a.download = this._data.name;
      a.target = '_blank';
      a.click();
    } catch (err) {
      console.error("download file error: ", err);
    }
    // let a = document.createElement('a');
    // a.href = `${this.transportEndpoint}/ipfs/${this._data.path}`;
    // a.download = this._data.name;
    // a.target = '_blank';
    // a.click();
  }

  private onEditClicked() {
    this.editorPanel.visible = true;
    this.previewerPanel.visible = false;
    this.editor.setData({content: this.currentContent});
    if (this.onOpenEditor) this.onOpenEditor();
  }

  private closeEditor() {
    this.editorPanel.visible = false;
    this.previewerPanel.visible = true;
    if (this.onCloseEditor) this.onCloseEditor();
    if (this.onClose) this.onClose();
  }

  private onChanged(content: string) {
    if (this.onFileChanged) this.onFileChanged(this._data.path, content);
  }

  init() {
    super.init()
    this.onClose = this.getAttribute('onClose', true) || this.onClose
    this.onCloseEditor = this.getAttribute('onCloseEditor', true) || this.onCloseEditor
    this.onOpenEditor = this.getAttribute('onOpenEditor', true) || this.onOpenEditor
    this.onFileChanged = this.getAttribute('onFileChanged', true) || this.onFileChanged
    const data = this.getAttribute('data', true)
    if (data) this.setData(data)
  }

  render() {
    return (
      <i-panel width={'100%'} height={'100%'}>
        <i-vstack
          id="previewerPanel"
          width={'100%'}
          height={'100%'}
          padding={{ left: '1rem', right: '1rem' }}
        >
          <i-hstack
            width={'100%'} height={36}
            verticalAlignment='center' horizontalAlignment='space-between'
            border={{ bottom: { width: '1px', style: 'solid', color: Theme.divider } }}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  visible: false,
                  maxWidth: '100%'
                }
              }
            ]}
          >
            <i-hstack
              verticalAlignment='center'
              gap="0.5rem"
            >
              <i-icon name="file-alt" width={'0.875rem'} height={'0.875rem'} stack={{ shrink: '0' }} opacity={0.7}></i-icon>
              <i-label caption={'File Preview'} font={{ size: '1rem' }}></i-label>
            </i-hstack>
            <i-icon
              name="times"
              width={'0.875rem'}
              height={'0.875rem'}
              stack={{ shrink: '0' }}
              opacity={0.7}
              cursor='pointer'
              onClick={this.closePreview}
            ></i-icon>
          </i-hstack>
          <i-hstack
            id="pnlEdit"
            verticalAlignment='center'
            horizontalAlignment='end'
            visible={false}
            padding={{top: '1rem'}}
          >
            <i-button
              padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
              border={{radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider}}
              background={{color: 'transparent'}}
              icon={{name: 'pencil-alt', width: '1rem', height: '1rem', fill: Theme.text.primary}}
              onClick={this.onEditClicked}
            ></i-button>
          </i-hstack>
          <i-vstack
            minHeight="3rem"
            stack={{ shrink: '1' }}
            overflow={{ y: 'auto' }}
            margin={{ top: '1.5rem', bottom: '1.5rem' }}
            gap={'1.5rem'}
          >
            <i-panel
              id={'previewer'}
              width={'100%'}
            ></i-panel>
          </i-vstack>
          <i-hstack
            width={'100%'}
            padding={{ bottom: '1.25rem', top: '1.25rem' }}
            border={{ top: { width: '1px', style: 'solid', color: Theme.divider } }}
            horizontalAlignment="space-between"
            gap="0.5rem"
          >
            <i-vstack width={'100%'} gap="0.5rem">
              <i-label id="lblName"
                font={{ size: '1rem', weight: 600 }}
                wordBreak='break-all'
                lineHeight={1.2}
              ></i-label>
              <i-label
                id="lblSize"
                font={{ size: `0.75rem` }}
                opacity={0.7}
              ></i-label>
            </i-vstack>
            <i-hstack
              width={35}
              height={35}
              border={{ radius: '50%' }}
              horizontalAlignment="center"
              verticalAlignment="center"
              stack={{ shrink: "0" }}
              cursor="pointer"
              background={{ color: Theme.colors.secondary.main }}
              hover={{ backgroundColor: Theme.action.hoverBackground }}
              onClick={this.downloadFile}
            >
              <i-icon width={15} height={15} name='download' />
            </i-hstack>
          </i-hstack>
        </i-vstack>
        <i-vstack
          id="editorPanel"
          maxHeight={'100%'}
          overflow={'hidden'}
          visible={false}
        >
          <i-scom-ipfs--editor
            id="editor"
            stack={{ shrink: '1', grow: '1' }}
            width={'100%'}
            display='flex'
            overflow={'hidden'}
            onClose={this.closeEditor.bind(this)}
            onChanged = {this.onChanged.bind(this)}
          />
        </i-vstack>
      </i-panel>
      
    )
  }
}
