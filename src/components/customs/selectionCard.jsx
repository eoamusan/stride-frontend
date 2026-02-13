const SelectionCard = ({ title, description, count, active, onClick, children }) => {
  return (
    <div
      className={`p-5 border rounded-xl transition-all ${
        active
          ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 bg-[#D9D9D926]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
              active ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
            }`}
            onClick={onClick}
          >
            {active && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h6 className="font-semibold text-gray-900">{title}</h6>
            <span
              className={`px-3 py-2 text-sm font-medium rounded-full ${
                active ? 'bg-purple-100 text-purple-700' : 'bg-[#4343431A] text-gray-600'
              }`}
            >
              {count} Employees
            </span>
          </div>

          <p className="mt-1 text-gray-600 text-sm">{description}</p>

          {children}
        </div>
      </div>
    </div>
  );
}

export default SelectionCard;