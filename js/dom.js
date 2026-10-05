export function el(tag, { className, text, attrs, on } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (on) Object.entries(on).forEach(([k, fn]) => node.addEventListener(k, fn));
  children.forEach((c) => node.append(c));
  return node;
}
