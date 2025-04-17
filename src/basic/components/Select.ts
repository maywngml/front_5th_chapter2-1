interface Option {
  id: string;
  value: string;
  content: string;
  disabled: boolean;
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
          ({ id, value, content, disabled }: Option) =>
            `<option id=${id} value=${value} ${disabled && 'disabled'}>${content}</option>`,
        )
        .join('')}
    `;
  };

  render();

  return select;
}
