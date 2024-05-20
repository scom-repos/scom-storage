import { Control } from "@ijstech/components";
import { IIPFSData, IStorageConfig } from "./interface";

interface IFileHandler {
  openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig): Promise<void>;
}

class Editor implements IFileHandler {
 async openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig) {
    console.log(`Opening editor for file: ${file.name}`);
  }
}

class Viewer implements IFileHandler {
  async openFile(file: IIPFSData, parentCid: string, parent: Control, config: IStorageConfig) {
    console.log(`Opening viewer for file: ${file.name}`);
  }
}

export { Editor, Viewer, IFileHandler };
