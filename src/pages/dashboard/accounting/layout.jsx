import { sidebarItems } from '@/constants/sidebar';
import { useLocation, useNavigate, Outlet } from 'react-router';

export default function AccountingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(item.link);
  };

  return (
    <div className="mt-2 overflow-y-auto">
      <div className="mt-2.5 flex items-center gap-6 overflow-x-auto scroll-auto border-b-2 border-[#D9D9D9] pt-4">
        {sidebarItems
          .find((item) => item.title === 'Accounting')
          .children.map((item) => {
            const isActive = location.pathname === item.link;

            return (
              <span
                key={item.link}
                onClick={() => handleItemClick(item)}
                className={`cursor-pointer pb-4 text-xs font-bold text-nowrap transition-colors ${
                  isActive
                    ? 'text-primary border-primary border-b-2'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.title}
              </span>
            );
          })}
      </div>

      {/* Render child routes */}
      <Outlet />
    </div>
  );
}
