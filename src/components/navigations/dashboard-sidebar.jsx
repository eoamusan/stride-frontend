import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { sidebarItems } from '../../constants/sidebar';
import strideLogo from '@/assets/icons/stride.svg';

export default function Sidebar() {
  const [currentView, setCurrentView] = useState('main');
  const [activeParent, setActiveParent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to automatically set view based on pathname
  useEffect(() => {
    // Dynamically find the parent item based on the current path
    const activeItem = sidebarItems.find(
      (item) =>
        item.children?.length > 0 && location.pathname.startsWith(item.link)
    );

    if (activeItem) {
      setCurrentView('children');
      setActiveParent(activeItem);
    } else {
      // Reset to main view if no matching parent with children is found
      setCurrentView('main');
      setActiveParent(null);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      setCurrentView('children');
      setActiveParent(item);
      navigate(item.children[0].link);
    } else {
      navigate(item.link);
    }
  };

  const handleChildItemClick = (item) => {
    navigate(item.link);
  };

  const handleBackClick = () => {
    setCurrentView('main');
    setActiveParent(null);
    navigate('/dashboard');
  };

  const renderMainView = () => (
    <nav className="p-4">
      <ul className="">
        {sidebarItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.link;

          return (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className={`flex w-full max-w-64 cursor-pointer items-center gap-2.5 rounded-lg ${isActive ? 'bg-[#EFE6FD]' : 'bg-white hover:bg-[#EFE6FD]/40'} px-4 py-2.5`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-primary' : 'border border-gray-200 bg-white'
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${isActive ? 'text-white' : 'text-primary'}`}
                  />
                </span>
                <span className="text-xs font-medium">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const renderChildrenView = () => (
    <nav className="px-4 pb-4">
      <div
        className="sticky top-0 flex cursor-pointer items-center bg-white pt-2 pb-1"
        onClick={handleBackClick}
      >
        <button className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-800">
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {activeParent?.title}
        </h2>
      </div>
      <ul>
        {activeParent?.children.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname.includes(item.link);

          return (
            <li key={index}>
              <button
                onClick={() => handleChildItemClick(item)}
                className={`flex w-full max-w-64 flex-1 cursor-pointer items-center gap-2.5 rounded-lg ${isActive ? 'bg-[#EFE6FD]' : 'bg-white hover:bg-[#EFE6FD]/40'} px-4 py-2.5`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-primary' : 'border border-gray-200 bg-white'
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${isActive ? 'text-white' : 'text-primary'}`}
                  />
                </span>
                <span className="text-left text-xs font-medium">
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="-mt-22 bg-white">
      {/* Logo */}
      <div className="p-8 pt-4">
        <img src={strideLogo} alt="Oneda Logo" className="h-10" />
      </div>
      <aside className="flex h-[85vh] w-72 flex-col overflow-y-auto scroll-auto bg-white">
        {currentView === 'main' ? renderMainView() : renderChildrenView()}
      </aside>
    </div>
  );
}
