import { useState } from 'react';
import {
  Search,
  X,
  Filter,
  CheckCheckIcon,
  InboxIcon,
  ArchiveIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Extended messages data based on the screenshot
const messagesData = [
  {
    id: 1,
    company: 'JJ Solutions',
    avatar: 'J&J',
    message: 'When will you deliver the goods',
    date: 'Oct 2',
    unreadCount: 4,
    isOnline: true,
    avatarBg: 'bg-red-500',
  },
  {
    id: 2,
    company: 'Adefe Foods',
    avatar: '',
    message: 'When will you deliver the goods',
    date: 'Oct 1',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-purple-500',
    hasCheckmark: true,
  },
  {
    id: 3,
    company: 'Hema Ventures',
    avatar: 'H',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-yellow-500',
    hasCheckmark: true,
  },
  {
    id: 4,
    company: 'Fresh Foods',
    avatar: 'FF',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-400',
    hasCheckmark: true,
  },
  {
    id: 5,
    company: 'Ace Limited',
    avatar: 'A',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-blue-600',
    hasCheckmark: true,
  },
  {
    id: 6,
    company: 'Obade Groceries',
    avatar: 'OG',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-blue-500',
    hasCheckmark: true,
  },
  {
    id: 7,
    company: 'Dan Ventures',
    avatar: '',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-teal-500',
    hasCheckmark: true,
  },
  {
    id: 8,
    company: 'Esther Howard',
    avatar: 'EH',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-600',
    hasCheckmark: true,
  },
  {
    id: 9,
    company: 'Robert Fox',
    avatar: 'RF',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-700',
    hasCheckmark: true,
  },
  {
    id: 10,
    company: 'Jacob Jones',
    avatar: 'JJ',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-amber-600',
    hasCheckmark: true,
  },
  {
    id: 11,
    company: 'Fresh Foods',
    avatar: 'FF',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-400',
    hasCheckmark: true,
  },
  {
    id: 12,
    company: 'Fresh Foods',
    avatar: 'FF',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-400',
    hasCheckmark: true,
  },
  {
    id: 13,
    company: 'Fresh Foods',
    avatar: 'FF',
    message: 'When will you deliver the goods',
    date: 'Sept 30',
    unreadCount: 0,
    isOnline: true,
    avatarBg: 'bg-gray-400',
    hasCheckmark: true,
  },
];

export default function MessageList({ onChatSelect, onCloseChatPage }) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messagesData.filter((message) =>
    message.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const _handleChatClick = (message) => {
    if (onChatSelect) {
      onChatSelect(message);
    }
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-9rem)] w-full max-w-[393px] flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onCloseChatPage}>
            <X className="h-4 w-4 text-gray-500" />
          </Button>
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <Button variant="ghost" size="icon">
          <Filter className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 pt-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search Messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'inbox'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Inbox</span>
          <InboxIcon size={16} />
        </button>
        <button
          onClick={() => setActiveTab('outbox')}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'outbox'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Outbox</span>
          <InboxIcon size={16} />
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'archive'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Archive</span>
          <ArchiveIcon size={16} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className="flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar className={`size-6 ${message.avatarBg} text-white`}>
                  <AvatarFallback
                    className={`${message.avatarBg} text-xs font-medium text-white`}
                  >
                    {message.avatar || message.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {message.isOnline && (
                  <div className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border-2 border-white bg-green-500"></div>
                )}
              </div>

              {/* Message Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-sm font-semibold">
                    {message.company}
                  </h3>
                  {/*                 <span className="ml-2 text-xs whitespace-nowrap text-gray-500">
                    {message.date}
                  </span> */}
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-600">
                  {message.message}
                </p>
              </div>

              {/* Right side indicators */}
              <div className="flex flex-col items-end gap-1">
                <span className="ml-2 text-xs font-medium whitespace-nowrap">
                  {message.date}
                </span>
                {message.unreadCount > 0 && (
                  <Badge className="flex h-5 w-5 items-center justify-center rounded-full bg-[#254C00] font-mono text-xs text-white tabular-nums">
                    {message.unreadCount}
                  </Badge>
                )}
                {message.hasCheckmark && (
                  <div className="text-gray-400">
                    <CheckCheckIcon size={16} color="#254C00" />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
