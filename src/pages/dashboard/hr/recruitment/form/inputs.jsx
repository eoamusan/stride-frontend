export function TextInput({ label, name, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-600 focus:outline-none"
        required
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export function SelectInput({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          name={name}
          className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          value={value}
          onChange={onChange}
          required
        >
          {options.map((option) => {
            return (
              <option value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function RadioInput({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-6 pt-1">
        {options.map((type) => (
          <label key={type} className="group flex cursor-pointer items-center">
            <div className="relative flex items-center">
              <input
                type="radio"
                name={name}
                value={type}
                checked={value === type}
                onChange={() => onChange(name, type)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 transition-all checked:border-purple-600 checked:bg-white"
              />
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 opacity-0 transition-opacity peer-checked:opacity-100"></div>
            </div>
            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
              {type}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function TextAreaInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  textLength,
  maxLength = 200,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        rows="4"
        maxLength={maxLength}
        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
        value={value}
        onChange={onChange}
      ></textarea>
      <div className="text-right text-xs text-gray-400">
        {textLength}/{maxLength}
      </div>
    </div>
  );
}

export function NumberInput({ label, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name={name}
        min="1"
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
