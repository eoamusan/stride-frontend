import { Outlet, useLocation, useNavigate } from 'react-router';
import { hrTopItems } from '@/constants/sidebar';
export default function HumanResourcesLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(item.link);
  };

  // Get current page from pathname
  const getCurrentPage = () => {
    const pathname = location.pathname;

    if (pathname.includes('/recruitment')) return 'recruitment';
    if (pathname.includes('/onboarding')) return 'onboarding';
    if (pathname.includes('/employee-directory/employees/')) return 'employeeDetail';
    if (pathname.includes('/employee-directory')) return 'employeeDirectory';
    if (pathname.includes('/attendance-leave')) return 'attendanceLeave';
    if (pathname.includes('/performance')) return 'performance';
    if (pathname.includes('/payroll')) return 'payroll';
    if (pathname.includes('/learning-and-development'))
      return 'learningAndDevelopement';
    if (pathname.includes('/engagement')) return 'engagement';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/disciplinary-and-exit'))
      return 'disciplinaryAndExit';
    if (pathname.includes('/setup')) return 'setup';

    // Default to overview if no specific page is detected
    return 'overview';
  };

  const currentPage = getCurrentPage();
  const currentItems = hrTopItems[currentPage] || [];
  return (
    <div className="mt-2 overflow-y-auto">
      {currentItems.length > 0 && (
        <div className="mt-2.5 flex items-center gap-6 overflow-x-auto scroll-auto border-b-2 border-[#D9D9D9] pt-4">
          {currentItems.map((item) => (
            <span
              key={item.link}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer pb-2.5 text-xs font-bold text-nowrap transition-colors ${
                location.pathname === item.link
                  ? 'text-primary border-primary border-b-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.title}
            </span>
          ))}
        </div>
      )}

      {/* Render child routes */}
      <Outlet />
    </div>
  );
}
