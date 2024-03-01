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
import { getFileContent, IPFS_GATEWAY } from '../data'
import { getEmbedElement } from '../utils';
import { IPreview } from '../interface';
const Theme = Styles.Theme.ThemeVars

interface ScomIPFSPreviewElement extends ControlElement {
  cid?: string
  name?: string
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

  private _data: IPreview = {
    cid: '',
    name: ''
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomIPFSPreviewElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get name() {
    return this._data.name
  }
  set name(value: string) {
    this._data.name = value
  }

  get cid() {
    return this._data.cid
  }
  set cid(value: string) {
    this._data.cid = value
  }

  setData(value: IPreview) {
    this._data = value
    this.renderUI()
  }

  clear() {
    this.pnlPreview.clearInnerHTML()
  }

  private renderUI() {
    this.clear();
    this.previewFile();
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
          console.log(content)
        }
        this.appendLabel(content)
      } else {
        this.appendLabel('No preview available')
      }
    } catch (error) {}
  }

  private async getModuleFromExtension() {
    const { cid, name } = this._data;
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
    if (imgExts.includes(ext)) {
      moduleData = this.createImageElement(url)
    } else if (videodExts.includes(ext)) {
      moduleData = this.createVideoElement(url)
    } else if (audioExts.includes(ext)) {
      moduleData = this.createVideoElement(url)
    } else if (streamingExts.includes(ext)) {
      moduleData = this.createPlayerElement(url)
    } else {
      const result = await getFileContent(cid)
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
    this.pnlPreview.appendChild(label)
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

  init() {
    super.init()
    const name = this.getAttribute('name', true)
    const cid = this.getAttribute('cid', true)
    this.setData({ name, cid })
  }

  render() {
    return (
      <i-vstack
        id={'pnlPreview'}
        width={'100%'}
        height={'100%'}
        overflow={{ y: 'auto' }}
        padding={{ left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }}
        verticalAlignment='center' horizontalAlignment='center'
      ></i-vstack>
    )
  }
}
