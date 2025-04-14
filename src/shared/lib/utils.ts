export const createElement = <T>(
  root: HTMLElement,
  tagType: keyof HTMLElementTagNameMap,
  options?: Partial<T>,
) => {
  const element = document.createElement(tagType);

  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      (element as any)[key] = value;
    });
  }

  root.appendChild(element);

  return element;
};
