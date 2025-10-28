import ChatBox from '@/components/dashboard/messaging/chat-box';
import MessageList from '@/components/dashboard/messaging/message-list';
import { useSearchParams } from 'react-router';

export default function Chats() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChatSelect = (message) => {
    console.log('Selected chat:', message);
    // TODO: Handle chat selection - open chat view, navigate to conversation, etc.
  };

  const closeChatPage = () => {
    // Remove the chat search parameter from the URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('chat');

    // Update the URL without the chat parameter
    setSearchParams(newSearchParams);
  };

  return (
    <div className="mt-2 flex h-full w-full gap-4 overflow-y-auto bg-white">
      <MessageList
        onChatSelect={handleChatSelect}
        onCloseChatPage={closeChatPage}
      />
      <ChatBox />
    </div>
  );
}
