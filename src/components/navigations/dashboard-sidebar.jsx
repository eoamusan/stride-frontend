import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { sidebarItems } from '../../constants/sidebar';

export default function Sidebar() {
  const [currentView, setCurrentView] = useState('main');
  const [activeParent, setActiveParent] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      setCurrentView('children');
      setActiveParent(item);
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
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const renderChildrenView = () => (
    <nav className="px-4 pb-4">
      <div className="sticky top-0 flex items-center bg-white pt-2 pb-1">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-800"
        >
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {activeParent?.title}
        </h2>
      </div>
      <ul>
        {activeParent?.children.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.link;

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
                <span className="text-left text-sm font-medium">
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
    <aside className="flex h-full w-64 flex-col overflow-y-auto bg-white">
      {currentView === 'main' ? renderMainView() : renderChildrenView()}
    </aside>
  );
}
