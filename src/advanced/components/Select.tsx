import { Ref } from 'react';

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
  ref: Ref<HTMLSelectElement>;
}

export default function Select({ id, className, options, ref }: SelectProps) {
  return (
    <select id={id} className={className} ref={ref}>
      {options.map(({ id, value, content, disabled = false }: Option) => (
        <option
          id={id}
          value={value}
          disabled={disabled}
          key={`product-option-${id}`}
        >
          {content}
        </option>
      ))}
    </select>
  );
}
