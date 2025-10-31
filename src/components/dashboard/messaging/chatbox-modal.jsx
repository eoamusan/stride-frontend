import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router';
import ChatBox from './chat-box';
import { Maximize2, X } from 'lucide-react';

export default function ChatBoxModal({ onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMaximize = () => {
    // Add the chat=fullpage search parameter to the URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('chat', 'fullpage');
    setSearchParams(newSearchParams);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 w-full sm:relative  max-w-[618px] min-w-[341px] rounded-lg border border-gray-200 bg-white shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <button onClick={handleMaximize} className="cursor-pointer">
            <Maximize2 className="h-4 w-4 text-gray-500" />
          </button>
          <h2 className="text-lg font-semibold">New Message</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      <ChatBox />
    </div>
  );
}
