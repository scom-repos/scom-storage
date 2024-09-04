import {
  Container,
  ControlElement,
  customElements,
  Module,
  CodeEditor
} from '@ijstech/components'
import { getFileContent } from '../data';

type onChangedCallback = (target: CodeEditor, event: Event) => void

interface ICodeEditor {
  url?: string;
  content?: string;
  path?: string;
}

interface ScomIPFSCodecodeEditorement extends ControlElement {
  url?: string;
  content?: string;
  path?: string;
  onChange?: onChangedCallback
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-ipfs--code-editor']: ScomIPFSCodecodeEditorement
    }
  }
}

@customElements('i-scom-ipfs--code-editor')
export class ScomIPFSCodeEditor extends Module {
  private codeEditor: CodeEditor;

  private _data: ICodeEditor = {
    url: '',
    path: '',
    content: ''
  };
  onChange: onChangedCallback

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomIPFSCodecodeEditorement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get url() {
    return this._data.url ?? ''
  }
  set url(value: string) {
    this._data.url = value ?? ''
  }

  get content() {
    return this._data.content ?? ''
  }
  set content(value: string) {
    this._data.content = value ?? ''
  }

  get path() {
    return this._data.path ?? ''
  }
  set path(value: string) {
    this._data.path = value ?? ''
  }

  get value() {
    return this.codeEditor?.value || ''
  }

  async setData(value: ICodeEditor) {
    this._data = value
    await this.renderUI()
  }

  onHide(): void {
  }

  private async renderUI() {
    const content = this.content || await getFileContent(this.url);
    await this.codeEditor.loadContent(content, 'json', this.path);
  }

  private handleEditorChanged(target: CodeEditor, event: Event) {
    if (typeof this.onChange === 'function') this.onChange(target, event);
  }

  init() {
    super.init()
    const url = this.getAttribute('url', true);
    const content = this.getAttribute('content', true);
    const path = this.getAttribute('path', true);
    if (url || content) this.setData({ url, content, path });
  }

  render() {
    return (
      <i-code-editor
        id="codeEditor"
        width={'100%'} height={'100%'}
        onChange={this.handleEditorChanged}
      />
    )
  }
}
