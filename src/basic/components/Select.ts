interface Option {
  id: string;
  value: string;
  content: string;
}

interface SelectProps {
  id: string;
  className: string;
  options: Option[];
}

export default function Select({ id, className, options }: SelectProps) {
  const select = document.createElement('select');
  select.id = id;
  select.className = className;

  const render = () => {
    select.innerHTML = /* HTML */ `
      ${options
        .map(
          ({ id, value, content }: Option) =>
            `<option id=${id} value=${value}>${content}</option>`,
        )
        .join('')}
    `;
  };

  render();

  return select;
}
