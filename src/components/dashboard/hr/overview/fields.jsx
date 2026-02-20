export default function Fields({ title, header, icon }) {
  return (
    <div>
      <label className="mb-4 block text-sm text-gray-800">{header}</label>
      <div className="flex items-center gap-2 text-sm font-medium capitalize">
        {icon}
        {title}
      </div>
    </div>
  );
}
