interface Props {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const inputClass =
  'w-full bg-white border border-[#ebebeb] text-[#171717] placeholder-[#888888] rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 disabled:opacity-40 disabled:bg-[#fafafa] transition-all';

export default function RepeatableInputList({
  values,
  onChange,
  placeholder = 'Add value',
  disabled = false,
}: Props) {
  function updateAt(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function addRow() {
    onChange([...values, '']);
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  const rows = values.length > 0 ? values : [''];

  return (
    <div className="space-y-2">
      {rows.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => updateAt(index, e.target.value)}
            className={inputClass}
          />
          {rows.length > 1 && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeAt(index)}
              className="shrink-0 px-2.5 h-10 rounded-md border border-[#ebebeb] text-xs text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] disabled:opacity-40"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={addRow}
        className="text-xs font-medium text-[#0070f3] hover:text-[#0761d1] disabled:opacity-40"
      >
        + Add
      </button>
    </div>
  );
}
