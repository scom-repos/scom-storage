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
import { addressPanelStyle, fullScreenStyle } from './index.css';
import { IFileHandler } from '../file';
import { IIPFSData } from '../interface';
import { getFileContent } from '../data';
const Theme = Styles.Theme.ThemeVars

interface IEditor {
  content?: string;
  type?: 'md' | 'designer';
  isFullScreen?: boolean;
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
  private btnActions: Panel;

  private _data: IEditor = {
    content: '',
    type: 'md',
    isFullScreen: false
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

  get content() {
    return this._data.content ?? ''
  }
  set content(value: string) {
    this._data.content = value ?? ''
  }

  get type() {
    return this._data.type ?? 'md'
  }
  set type(value: 'md' | 'designer') {
    this._data.type = value ?? 'md'
  }

  get isFullScreen() {
    return this._data.isFullScreen ?? false
  }
  set isFullScreen(value: boolean) {
    this._data.isFullScreen = value ?? false
  }

  setData(value: IEditor) {
    const isTypeChanged = this.type !== value.type;
    this._data = value
    this.mdAlert.closeModal();
    this.btnSave.enabled = false;
    this.initialContent = '';
    this.renderUI(isTypeChanged)
  }

  async openFile(file: IIPFSData, endpoint: string, parentCid: string, parent: Control) {
    parent.append(this);
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    const mediaUrl = `${endpoint}/ipfs/${parentCid}/${path}`;
    const result = await getFileContent(mediaUrl);
    const ext = file.name.split('.').pop();
    this.type = ext === 'md' ? 'md' : 'designer';
    this.content = result || '';
    this.isFullScreen = false;
    this.renderUI();
    this.btnActions.visible = false;
  }

  onHide(): void {
    if (this.editorEl) this.editorEl.onHide();
  }

  private async renderUI(isTypeChanged?: boolean) {
    if (!this.editorEl || isTypeChanged) {
      this.pnlEditor.clearInnerHTML();
      this.editorEl = await getEmbedElement(this.createEditorElement(this.content), this.pnlEditor);
      this.initialContent = this.editorEl.value;
      this.editorEl.onChanged = (value: string) => {
        if (this.initialContent) {
          this.btnSave.enabled = value !== this.initialContent;
        } else {
          this.initialContent = value
        }
      }
    } else {
      this.initialContent = '';
      this.editorEl.setValue(this.content);
    }
    if (this.isFullScreen) {
      this.classList.add(fullScreenStyle);
      document.body.style.overflow = 'hidden';
    } else {
      this.classList.remove(fullScreenStyle);
    }
  }

  private createEditorElement(value: string) {
    return {
      module: this.type === 'md' ? '@scom/scom-editor' : '@scom/scom-designer',
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
    document.body.style.overflow = 'hidden auto';
    if (this.editorEl) this.editorEl.onHide();
    if (this.btnSave.enabled) {
      this.mdAlert.showModal()
    } else {
      if (this.onClose) this.onClose()
    } 
  }

  private onSubmit() {
    document.body.style.overflow = 'hidden auto';
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
          id="btnActions"
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
