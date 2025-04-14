export const createElement = <T extends HTMLElement>(
  root: HTMLElement,
  tagType: keyof HTMLElementTagNameMap,
  options?: Partial<T>,
): T => {
  const element = document.createElement(tagType) as T;

  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      (element as any)[key] = value;
    });
  }

  root.appendChild(element);

  return element;
};
