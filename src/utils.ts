import { Control, application } from "@ijstech/components";

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
  elm.stack = {grow: '1'};
  if (builderTarget?.setData && data.properties) {
    await builderTarget.setData(data.properties);
  }
  if (builderTarget?.setTag && data.tag) {
    await builderTarget.setTag(data.tag);
  }
  if (callback) callback(elm);
  return elm;
}
