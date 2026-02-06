const SidebarCard = ({ title, children, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100">
    <div className="flex items-center gap-2 mb-3 pb-2">
      {icon} <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

export default SidebarCard;