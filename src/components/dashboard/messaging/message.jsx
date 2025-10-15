import chatImg from '@/assets/icons/message.png';
import { Badge } from '../../ui/badge';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import AllMessagesCard from './all-messages-card';
import ContactList from './contact-list';
import ChatBoxModal from './chatbox-modal';

export default function Messaging() {
  const [searchParams] = useSearchParams();
  const [openAllMessages, setOpenAllMessages] = useState(false);
  const [showContactList, setShowContactList] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);

  // Don't render if chat=fullpage is in search params
  if (searchParams.get('chat') === 'fullpage') {
    return null;
  }

  const toggleMessages = () => {
    setOpenAllMessages((prev) => !prev);
    // Reset to AllMessages view when closing/opening
    setShowContactList(false);
    setShowChatBox(false);
  };

  const handleContactsView = () => {
    setShowContactList(true);
    setShowChatBox(false);
  };

  const handleBackToMessages = () => {
    setShowContactList(false);
    setShowChatBox(false);
  };

  const handleChat = () => {
    setShowChatBox(true);
    setShowContactList(false);
  };

  const handleContactSelect = (contact) => {
    // When a contact is selected, go to chat view
    setShowChatBox(true);
    setShowContactList(false);
  };

  const handleBackToChatFromBox = () => {
    setShowChatBox(false);
  };

  return (
    <>
      <div className="fixed right-8 bottom-8">
        <button
          onClick={toggleMessages}
          className="bg-primary/10 drop-shadow-primary/30 hover:bg-primary/20 relative flex h-16 w-16 cursor-pointer items-center justify-center gap-2 rounded-full drop-shadow backdrop-blur-sm transition"
        >
          <img src={chatImg} alt="chat" className="h-8 w-8" />
          <Badge
            variant={'destructive'}
            className="absolute top-[25%] right-[25%] h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
          >
            8
          </Badge>
        </button>
      </div>

      {openAllMessages && (
        <div className="fixed right-8 bottom-28 z-50 max-h-[calc(100vh-8rem)]">
          {showContactList ? (
            <ContactList
              onClose={handleBackToMessages}
              onContactSelect={handleContactSelect}
            />
          ) : showChatBox ? (
            <ChatBoxModal onClose={handleBackToChatFromBox} />
          ) : (
            <AllMessagesCard
              onClose={toggleMessages}
              handleContactsView={handleContactsView}
              handleChat={handleChat}
            />
          )}
        </div>
      )}
    </>
  );
}
