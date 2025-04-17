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
  return (
    <select id={id} className={className}>
      {options.map(({ id, value, content, disabled = false }: Option) => (
        <option id={id} value={value} disabled={disabled}>
          ${content}
        </option>
      ))}
    </select>
  );
}
