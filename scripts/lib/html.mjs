export function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes || []) walk(child, visit);
}
export const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
export function setAttr(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find((item) => item.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}
export function nodes(document, tagName) {
  const found = [];
  walk(document, (node) => {
    if (node.tagName === tagName) found.push(node);
  });
  return found;
}
export function text(node) {
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
}
