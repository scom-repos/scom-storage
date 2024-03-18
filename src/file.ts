import { Control } from "@ijstech/components";
import { IIPFSData } from "./interface";

interface IFileHandler {
  openFile(file: IIPFSData, parent: Control): void;
}

class Editor implements IFileHandler {
  openFile(file: IIPFSData, parent: Control) {
    console.log(`Opening Markdown editor for file: ${file.name}`);
  }
}

class Viewer implements IFileHandler {
  openFile(file: IIPFSData, parent: Control) {
    console.log(`Opening Markdown viewer for file: ${file.name}`);
  }
}

export { Editor, Viewer, IFileHandler };
