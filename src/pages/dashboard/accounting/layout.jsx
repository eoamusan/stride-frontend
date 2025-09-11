import { accountingTopItems } from '@/constants/sidebar';
import { useLocation, useNavigate, Outlet } from 'react-router';

export default function AccountingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(item.link);
  };

  // Get current page from pathname
  const getCurrentPage = () => {
    const pathname = location.pathname;

    if (pathname.includes('/invoicing')) return 'invoicing';
    if (pathname.includes('/expense-management')) return 'expenseManagement';
    if (pathname.includes('/bookkeeping')) return 'bookkeeping';
    if (pathname.includes('/financial-reports')) return 'financialReports';
    if (pathname.includes('/accounts-receivable')) return 'accountsReceivable';
    if (pathname.includes('/accounts-payable')) return 'accountsPayable';
    if (pathname.includes('/inventory'))
      return 'inventoryManagement';
    if (pathname.includes('/budgeting')) return 'budgeting';
    if (pathname.includes('/fixed-asset-management'))
      return 'fixedAssetManagement';
    if (pathname.includes('/tax-management')) return 'taxManagement';
    if (pathname.includes('/banking-reconciliation'))
      return 'bankingReconciliation';

    // Default to overview if no specific page is detected
    return 'overview';
  };

  const currentPage = getCurrentPage();
  const currentItems = accountingTopItems[currentPage] || [];

  return (
    <div className="mt-2 overflow-y-auto">
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

      {/* Render child routes */}
      <Outlet />
    </div>
  );
}
