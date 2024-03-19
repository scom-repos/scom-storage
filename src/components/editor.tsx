import {
  Button,
  Container,
  ControlElement,
  customElements,
  Module,
  Panel,
  Styles,
  Alert,
  Control
} from '@ijstech/components'
import { getEmbedElement } from '../utils';
import { addressPanelStyle } from './index.css';
import { IFileHandler } from '../file';
import { IIPFSData } from '../interface';
import { getFileContent } from '../data';
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
export class ScomIPFSEditor extends Module implements IFileHandler {
  private pnlEditor: Panel;
  private editorEl: any;
  private btnSave: Button;
  private mdAlert: Alert;

  private _data: IEditor = {
    content: ''
  };
  private initialContent: string = '';
  onClose: () => void
  onChanged: (content: string) => void

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onAlertConfirm = this.onAlertConfirm.bind(this)
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
    this.mdAlert.closeModal();
    this.btnSave.enabled = false;
    this.initialContent = '';
    this.renderUI()
  }

  async openFile(file: IIPFSData, endpoint: string, parentCid: string, parent: Control) {
    // TODO: for test
    parent.append(this);
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`;
    const result = await getFileContent(mediaUrl);
    this.data = { content: result || '' };
    this.renderUI();
  }

  private async renderUI() {
    if (this.editorEl) {
      this.initialContent = '';
      this.editorEl.setValue(this.data.content);
    } else {
      this.editorEl = await getEmbedElement(this.createTextEditorElement(this.data.content), this.pnlEditor);
      this.initialContent = this.editorEl.value;
      this.editorEl.onChanged = (value: string) => {
        if (this.initialContent) {
          this.btnSave.enabled = value !== this.initialContent;
        } else {
          this.initialContent = value
        }
      }
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
    if (this.btnSave.enabled) {
      this.mdAlert.showModal()
    } else {
      if (this.onClose) this.onClose()
    } 
  }

  private onSubmit() {
    if (this.onClose) this.onClose()
    if (this.onChanged) this.onChanged(this.editorEl.value)
  }

  private onAlertConfirm() {
    if (this.onClose) this.onClose()
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
            id="btnCancel"
            padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
            border={{radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider}}
            background={{color: 'transparent'}}
            font={{color: Theme.text.primary}}
            icon={{name: 'times', width: '0.875rem', height: '0.875rem', fill: Theme.text.primary}}
            caption='Cancel'
            onClick={this.onCancel}
          ></i-button>
           <i-button
            id="btnSave"
            padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
            border={{radius: '0.5rem', width: '1px', style: 'solid', color: Theme.divider}}
            background={{color: Theme.colors.primary.main}}
            font={{color: Theme.colors.primary.contrastText}}
            icon={{name: 'save', width: '0.875rem', height: '0.875rem', fill: Theme.colors.primary.contrastText}}
            caption='Save'
            enabled={false}
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
        <i-alert
          id="mdAlert"
          title=''
          status='confirm'
          content='Do you want to discard changes?'
          onConfirm={this.onAlertConfirm}
          onClose={() => this.mdAlert.closeModal()}
        ></i-alert>
      </i-vstack>
    )
  }
}
