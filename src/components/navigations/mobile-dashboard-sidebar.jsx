import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon, X } from 'lucide-react';
import { sidebarItems } from '../../constants/sidebar';
import strideLogo from '@/assets/icons/stride.svg';
import { Button } from '../ui/button';

export default function MobileSidebar({ isOpen, onClose }) {
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
      onClose();
    }
  };

  const handleChildItemClick = (item) => {
    navigate(item.link);
    onClose();
  };

  const handleBackClick = () => {
    setCurrentView('main');
    setActiveParent(null);
  };

  const handleClose = () => {
    setCurrentView('main');
    setActiveParent(null);
    onClose();
  };

  const renderMainView = () => (
    <nav className="flex-1 overflow-y-auto">
      <ul className="space-y-2">
        {sidebarItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.link;

          return (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'text-primary bg-[#EFE6FD]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-primary' : 'border border-gray-200 bg-white'
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary'}`}
                  />
                </span>
                <span className="text-base font-medium">{item.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const renderChildrenView = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
        <button
          onClick={handleBackClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {activeParent?.title}
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {activeParent?.children.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.link;

            return (
              <li key={index}>
                <button
                  onClick={() => handleChildItemClick(item)}
                  className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'text-primary bg-[#EFE6FD]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary'
                        : 'border border-gray-200 bg-white'
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary'}`}
                    />
                  </span>
                  <span className="text-base font-medium">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur lg:hidden"
        onClick={handleClose}
      />

      {/* Mobile Sidebar */}
      <div className="fixed top-0 bottom-0 left-0 z-50 flex w-80 flex-col bg-white shadow-xl lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <img src={strideLogo} alt="Stride Logo" className="h-8" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col p-4">
          {currentView === 'main' ? renderMainView() : renderChildrenView()}
        </div>
      </div>
    </>
  );
}
