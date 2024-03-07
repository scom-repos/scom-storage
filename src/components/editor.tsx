import {
  Container,
  ControlElement,
  customElements,
  Module,
  Panel,
  Styles,
} from '@ijstech/components'
import { getEmbedElement } from '../utils';
import { addressPanelStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars

interface IEditor {
  content?: string;
}
interface ScomIPFSEditorElement extends ControlElement {
  data?: IEditor;
  onClose?: () => void
  onChanged?: (content: string) => void
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-ipfs--editor']: ScomIPFSEditorElement
    }
  }
}

@customElements('i-scom-ipfs--editor')
export class ScomIPFSEditor extends Module {
  private pnlEditor: Panel;
  private editorEl: any;

  private _data: IEditor = {
    content: ''
  };
  onClose: () => void
  onChanged: (content: string) => void

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  static async create(options?: ScomIPFSEditorElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get data() {
    return this._data
  }
  set data(value: IEditor) {
    this._data = value
  }

  setData(value: IEditor) {
    this.data = value
    this.renderUI()
  }

  private async renderUI() {
    if (this.editorEl) {
      this.editorEl.setValue(this.data.content)
    } else {
      this.editorEl = await getEmbedElement(this.createTextEditorElement(this.data.content), this.pnlEditor)
    }
  }

  private createTextEditorElement(value: string) {
    return {
      module: '@scom/scom-editor',
      data: {
        properties: {
          value
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

  private onCancel() {
    this.editorEl.setValue('')
    if (this.onClose) this.onClose()
  }

  private onSubmit() {
    if (this.onClose) this.onClose()
    if (this.onChanged) this.onChanged(this.editorEl.value)
    this.editorEl.setValue('')
  }

  init() {
    super.init()
    this.onClose = this.getAttribute('onClose', true) || this.onClose
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged
    const data = this.getAttribute('data', true)
    if (data) this.setData(data)
  }

  render() {
    return (
      <i-vstack
        maxHeight={'100%'}
        width={'100%'}
        overflow={'hidden'}
        gap="0.75rem"
      >
         <i-hstack
          verticalAlignment='center'
          horizontalAlignment='end'
          width={'100%'}
          gap="0.5rem"
          padding={{ left: '1rem', right: '1rem', top: '0.75rem' }}
        >
          <i-button
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
            border={{radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider}}
            background={{color: 'transparent'}}
            font={{color: Theme.text.primary}}
            caption='Cancel changes'
            onClick={this.onCancel}
          ></i-button>
           <i-button
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
            border={{radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider}}
            background={{color: Theme.colors.primary.main}}
            font={{color: Theme.colors.primary.contrastText}}
            caption='Commit changes'
            onClick={this.onSubmit}
          ></i-button>
        </i-hstack>
        <i-vstack
          id="pnlEditor"
          stack={{ shrink: '1', grow: '1' }}
          width={'100%'}
          overflow={{y: 'auto', x: 'hidden'}}
          padding={{ left: '1rem', right: '1rem' }}
          class={addressPanelStyle}
        ></i-vstack>
      </i-vstack>
    )
  }
}
