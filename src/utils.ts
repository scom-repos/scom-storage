import { Control, IPFS, application } from "@ijstech/components";

export const getEmbedElement = async (moduleData: any, parent: Control, callback?: any) => {
  const { module, data } = moduleData;
  parent.clearInnerHTML();
  const elm = await application.createElement(module, true) as any;
  if (!elm) throw new Error('not found');
  elm.parent = parent;
  const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf: any) => conf.target === 'Builders') : null;
  if (elm.ready) await elm.ready();
  elm.maxWidth = '100%';
  elm.maxHeight = '100%';
  elm.display = 'block';
  elm.stack = { grow: '1' };
  if (builderTarget?.setData && data.properties) {
    await builderTarget.setData(data.properties);
  }
  if (builderTarget?.setTag && data.tag) {
    await builderTarget.setTag(data.tag);
  }
  if (callback) callback(elm);
  return elm;
}


export const getNewFileName = async (parentNode: any, fileName: string) => {
  const arr = fileName.split('.');
  let newName = arr.slice(0, -1).join('.');
  let ext = arr[arr.length - 1];
  while (await parentNode.findItem(`${newName}.${ext}`)) {
    const regex = /\((\d+)\)$/;
    const matches = newName.match(regex);
    if (matches) {
      const lastNumber = parseInt(matches[1]);
      const updatedString = newName.replace(/\((\d+)\)$/, '');
      newName = `${updatedString}(${lastNumber + 1})`;
    } else {
      newName = `${newName}(1)`;
    }
  }
  return `${newName}.${ext}`;
}

export const isFileExists = async (manager: IPFS.FileManager, filePath: string) => {
  let newFilePath: string;
  const arr = filePath.split('/');
  const parentPath = arr.slice(0, -1).join('/');
  const fileName = arr.slice(-1)[0];
  let fileNode;
  if (parentPath) {
    fileNode = await manager.getFileNode(parentPath);
  } else {
    fileNode = await manager.getRootNode();
  }
  const node = await fileNode.findItem(fileName);
  if (node) {
    let newName = await getNewFileName(fileNode, fileName);
    newFilePath = `${parentPath}/${newName}`;
  }
  return { isExists: !!node, newFilePath };
}