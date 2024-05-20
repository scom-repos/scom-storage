import { Control } from "@ijstech/components";
import { IIPFSData } from "./interface";

interface IFileHandler {
  openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control, config?: any): Promise<void>;
}

class Editor implements IFileHandler {
 async openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control) {
    console.log(`Opening editor for file: ${file.name}`);
  }
}

class Viewer implements IFileHandler {
  async openFile(file: IIPFSData, transportEndpoint: string, parentCid: string, parent: Control) {
    console.log(`Opening viewer for file: ${file.name}`);
  }
}

export { Editor, Viewer, IFileHandler };
