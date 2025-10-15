import { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  RedoIcon,
  UndoIcon,
  PaperclipIcon,
  SendIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import EmojiPicker from 'emoji-picker-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Sample conversation data matching the screenshot
const conversationData = [
  {
    id: 1,
    message: 'When will you deliver the goods',
    time: '04:45 PM',
    isOwn: false,
    hasActions: true,
  },
  {
    id: 2,
    message:
      'I will deliver it hopefully on monday and also send me the list of goods',
    time: '04:45 PM',
    isOwn: true,
    hasActions: true,
  },
  {
    id: 3,
    message: 'When will you deliver the goods',
    time: '04:45 PM',
    isOwn: false,
    hasActions: true,
  },
  {
    id: 4,
    message:
      'I will deliver it hopefully on monday and also send me the list of goods',
    time: '04:45 PM',
    isOwn: true,
    hasActions: true,
  },
];

// Default chat data for JJ Solutions
const defaultChat = {
  company: 'JJ Solutions',
  avatar: 'J&J',
  avatarBg: 'bg-red-500',
  isOnline: true,
  status: 'Messaging',
};

export default function ChatBox({
  selectedChat = defaultChat,
  onBack,
  isModal = false,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleSendMessage = () => {
    if (messageInput.trim() || attachedFiles.length > 0) {
      // TODO: Send message logic with attachments
      console.log('Sending message:', messageInput);
      console.log('Attached files:', attachedFiles);
      setMessageInput('');
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emojiData) => {
    setMessageInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files]);
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`z-40 flex ${isModal ? '' : 'h-[calc(100vh-9rem)]'} w-full flex-col bg-white`}
    >
      {/* Chat Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Avatar className={`h-12 w-12 ${selectedChat.avatarBg} text-white`}>
            <AvatarFallback
              className={`${selectedChat.avatarBg} font-medium text-white`}
            >
              {selectedChat.avatar || selectedChat.company.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{selectedChat.company}</h3>
            <p className="text-xs text-[#434343]">Marketting</p>
            <div className="mt-0.5 flex items-center gap-1 text-sm font-medium text-[#434343]">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              {'Online'}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="size-4" />
        </Button>
      </div>

      {/* Date Separator */}
      <div className="flex flex-shrink-0 justify-center py-2">
        <span className="text-xs text-[#434343]">Today</span>
      </div>

      {/* Messages Container */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        <div className="space-y-6">
          {conversationData.map((msg, index) => (
            <div key={msg.id} className="space-y-1">
              {/* Message Bubble */}
              <div
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div>
                  <div
                    className={`max-w-sm rounded-full px-6 py-4 ${
                      msg.isOwn
                        ? 'bg-primary rounded-br-none text-white'
                        : 'rounded-bl-none bg-[#EFE6FD]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>

                  {/* Message Actions */}
                  <div
                    className={`flex w-full items-center px-2 pt-1 text-xs text-gray-400`}
                  >
                    <div
                      className={`flex w-full items-center justify-between gap-4 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <span>{msg.time}</span>
                      {msg.hasActions && (
                        <div className="flex items-center gap-4">
                          <button className="flex items-center justify-center gap-0.5 transition-colors hover:text-gray-600">
                            Forward
                            <RedoIcon size={12} />
                          </button>

                          <button className="flex items-center justify-center gap-0.5 transition-colors hover:text-gray-600">
                            Reply
                            <UndoIcon size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-6">
        {/* File Attachments Preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Attached files:
            </h4>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                >
                  <PaperclipIcon size={14} />
                  <span className="max-w-32 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                  <button
                    onClick={() => removeAttachedFile(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary/5 flex h-[60px] items-center gap-4 rounded-2xl pr-4">
          <Input
            placeholder="Type your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent pl-6 text-sm shadow-none placeholder:text-[#434343] focus:ring-0 focus-visible:ring-0 h-9 overflow-y-auto max-h-[60px]"
          />
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <span className="text-base">😊</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="top" align="center">
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                lazyLoadEmojis={true}
              />
            </PopoverContent>
          </Popover>
          <div className="relative">
            <input
              type="file"
              id="file-input"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <PaperclipIcon size={16} className="-rotate-45" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            size="lg"
            className={'h-11'}
            disabled={!messageInput.trim() && attachedFiles.length === 0}
          >
            <SendIcon size={20} className="rounded-2xl text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
