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
import { formatBytes, IPFS_GATEWAY } from '../data'
import { getEmbedElement } from '../utils';
import { IPreview } from '../interface';
const Theme = Styles.Theme.ThemeVars

interface ScomIPFSPreviewElement extends ControlElement {
  data?: IPreview;
  onClose?: () => void
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
  private pnlPreview: Panel;
  private lblName: Label;
  private lblSize: Label;

  private _data: IPreview = {
    cid: '',
    name: ''
  }
  onClose: () => void

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onClosePreview = this.onClosePreview.bind(this)
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
    this.pnlPreview.clearInnerHTML()
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
    try {
      const moduleData = await this.getModuleFromExtension()
      if (moduleData?.module) {
        await getEmbedElement(moduleData, this.pnlPreview)
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
    } catch (error) {}
  }

  private async getModuleFromExtension() {
    const { cid, name, path } = this._data;
    if (!cid) return null
    const url = `${IPFS_GATEWAY}${cid}`
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
    const mediaUrl = `${this.transportEndpoint}/ipfs/${path}`

    if (imgExts.includes(ext)) {
      moduleData = this.createImageElement(url)
    } else if (videodExts.includes(ext)) {
      moduleData = this.createVideoElement(mediaUrl)
    } else if (audioExts.includes(ext)) {
      moduleData = this.createVideoElement(mediaUrl)
    } else if (streamingExts.includes(ext)) {
      moduleData = this.createPlayerElement(mediaUrl)
    } else {
      // const result = await getFileContent(cid)
      // if (!result) return null
      // if (mdExts.includes(ext)) {
      //   moduleData = this.createTextElement(result)
      // } else {
      //   moduleData = { module: '', data: result }
      // }
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
    this.pnlPreview.appendChild(label)
  }

  private renderFilePreview() {
    const wrapper = <i-panel width={'100%'}>
      <i-hstack
        horizontalAlignment='center'
      >
        <i-icon width={'3rem'} height={'3rem'} name="file"></i-icon>
      </i-hstack>
    </i-panel>
    this.pnlPreview.appendChild(wrapper)
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

  private onClosePreview() {
    if (this.onClose) this.onClose()
  }

  init() {
    super.init()
    this.onClose = this.getAttribute('onClose', true) || this.onClose
    const data = this.getAttribute('data', true)
    if (data) this.setData(data)
  }

  render() {
    return (
      <i-vstack
        width={'100%'}
        height={'100%'}
        padding={{ left: '1rem', right: '1rem' }}
      >
        <i-hstack
          width={'100%'} height={'2.188rem'}
          verticalAlignment='center' horizontalAlignment='space-between'
          border={{bottom: {width: '1px', style: 'solid', color: Theme.divider}}}
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
            <i-icon name="file-alt" width={'0.875rem'} height={'0.875rem'} stack={{shrink: '0'}} opacity={0.7}></i-icon>
            <i-label caption={'File Preview'} font={{size: '1rem'}}></i-label>
          </i-hstack>
          <i-icon
            name="times"
            width={'0.875rem'}
            height={'0.875rem'}
            stack={{shrink: '0'}}
            opacity={0.7}
            cursor='pointer'
            onClick={this.onClosePreview}
          ></i-icon>
        </i-hstack>
        <i-vstack
          stack={{ shrink: '1', grow: '1' }}
          overflow={{ y: 'auto' }}
          padding={{ top: '1.5rem', bottom: '1.5rem' }}
          gap={'1.5rem'}
        >
          <i-panel
            id={'pnlPreview'}
            width={'100%'}
          ></i-panel>
          <i-vstack
            width={'100%'}
            gap="0.5rem"
            padding={{bottom: '1.25rem', top: '1.25rem'}}
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
          >
            <i-label id="lblName"
              font={{size: '1rem', weight: 600}}
              wordBreak='break-all'
              lineHeight={1.2}
            ></i-label>
            <i-label
              id="lblSize"
              font={{size: `0.75rem`}}
              opacity={0.7}
            ></i-label>
          </i-vstack>
        </i-vstack>
      </i-vstack>
    )
  }
}
