export default function Fields({ title, header, icon }) {
  return (
    <div>
      <label className="text-base font-medium text-gray-600">{header}</label>
      <div className="mt-4 flex items-center gap-2 text-gray-900">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
}
