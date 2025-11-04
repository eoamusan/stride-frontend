import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  RedoIcon,
  UndoIcon,
  PaperclipIcon,
  SendIcon,
  SmileIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import EmojiPicker from 'emoji-picker-react';

// Sample conversation data matching the screenshot
const conversationData = [
  {
    id: 1,
    message: 'When will you deliver the goods',
    time: '04:45 PM',
    isOwn: false,
    hasActions: true,
    reaction: null,
  },
  {
    id: 2,
    message:
      'I will deliver it hopefully on monday and also send me the list of goods',
    time: '04:45 PM',
    isOwn: true,
    hasActions: true,
    reaction: null,
  },
  {
    id: 3,
    message: 'When will you deliver the goods',
    time: '04:45 PM',
    isOwn: false,
    hasActions: true,
    reaction: null,
  },
  {
    id: 4,
    message:
      'I will deliver it hopefully on monday and also send me the list of goods',
    time: '04:45 PM',
    isOwn: true,
    hasActions: true,
    reaction: null,
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

// Quick reaction emojis (like WhatsApp)
const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function ChatBox({
  selectedChat = defaultChat,
  onBack,
  isModal = false,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [messages, setMessages] = useState(conversationData);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Max height of 120px (about 5 lines), min height of 40px
      const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim() || attachedFiles.length > 0) {
      // TODO: Send message logic with attachments
      console.log('Sending message:', messageInput);
      console.log('Attached files:', attachedFiles);
      setMessageInput('');
      setAttachedFiles([]);
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

  // Toggle a single reaction for a message (only one active emoji per message)
  const handleToggleReaction = (messageId, emoji) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          // If same emoji is already selected, remove it (toggle off)
          if (msg.reaction === emoji) {
            return { ...msg, reaction: null };
          }

          // Otherwise set the selected emoji as the single reaction
          return { ...msg, reaction: emoji };
        }
        return msg;
      })
    );
    setReactionPickerOpen(null);
  };

  return (
    <div
      className={`z-40 flex ${isModal ? 'h-full w-full flex-col bg-white' : 'h-[calc(100vh-9rem)]'} w-full flex-col bg-white`}
    >
      {/* Chat Header */}
      <div className="flex shrink-0 items-center justify-between border-b p-4">
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
      <div className="flex shrink-0 justify-center py-2">
        <span className="text-xs text-[#434343]">Today</span>
      </div>

      {/* Messages Container */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="group space-y-1">
              {/* Message Bubble */}
              <div
                className={`flex items-center gap-2 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative">
                  <div
                    className={`max-w-sm rounded-full px-6 py-4 ${
                      msg.isOwn
                        ? 'bg-primary rounded-br-none text-white'
                        : 'rounded-bl-none bg-[#EFE6FD]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>

                  {/* (Reactions shown in actions row now) */}

                  {/* Message Actions */}
                  <div
                    className={`flex w-full items-center px-2 ${msg.reaction ? 'pt-3' : 'pt-1'} text-xs text-gray-400`}
                  >
                    <div
                      className={`flex w-full items-center justify-between gap-4 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <span>{msg.time}</span>
                      {msg.hasActions && (
                        <div className="flex items-center gap-4">
                          {/* Selected reaction displayed inline next to actions */}
                          {msg.reaction && msg.isOwn && (
                            <div className="flex items-center">
                              <div className="bg-muted rounded-full px-2 py-0.5 text-sm text-white">
                                {msg.reaction}
                              </div>
                            </div>
                          )}

                          <button className="flex items-center justify-center gap-0.5 transition-colors hover:text-gray-600">
                            Forward
                            <RedoIcon size={12} />
                          </button>

                          <button className="flex items-center justify-center gap-0.5 transition-colors hover:text-gray-600">
                            Reply
                            <UndoIcon size={12} />
                          </button>

                          {/* Selected reaction displayed inline next to actions */}
                          {msg.reaction && !msg.isOwn && (
                            <div className="flex items-center">
                              <div className="bg-muted rounded-full px-2 py-0.5 text-sm text-white">
                                {msg.reaction}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reaction Button - appears on right for received (not own), left for sent (own) */}
                {msg.hasActions && (
                  <div
                    className={`flex items-center ${msg.isOwn ? 'order-first' : ''}`}
                  >
                    <Popover
                      open={reactionPickerOpen === msg.id}
                      onOpenChange={(open) =>
                        setReactionPickerOpen(open ? msg.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <button className="-mt-5 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-700">
                          <SmileIcon size={18} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-2"
                        side="top"
                        align="center"
                      >
                        <div className="flex gap-2">
                          {quickReactions.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() =>
                                handleToggleReaction(msg.id, emoji)
                              }
                              className={`rounded-lg p-2 text-2xl transition-transform hover:scale-125 hover:bg-gray-100 ${msg.reaction === emoji ? 'bg-muted text-white' : ''}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="shrink-0 p-6">
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

        {/* WhatsApp-style Input Area */}
        <div className="flex min-h-[52px] items-end gap-2">
          {/* Attachment Button */}
          <div className="relative mb-1 max-sm:hidden">
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
              className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <PaperclipIcon size={20} className="rotate-45" />
            </Button>
          </div>

          {/* Message Input Container */}
          <div className="focus-within:border-primary flex max-h-[120px] min-h-10 flex-1 items-end rounded-3xl border border-gray-200 bg-gray-50 transition-colors">
            {/* Text Input */}
            <textarea
              ref={textareaRef}
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="scrollbar-thin scrollbar-thumb-gray-300 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm leading-5 placeholder:text-gray-500 focus:outline-none"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                lineHeight: '20px',
              }}
              rows={1}
            />

            {/* Emoji Button */}
            <div className="flex items-end pr-2 pb-3">
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-gray-200"
                  >
                    <span className="text-lg">😊</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  side="top"
                  align="center"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    lazyLoadEmojis={true}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Send Button */}
          <div className="mb-1">
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              disabled={!messageInput.trim() && attachedFiles.length === 0}
            >
              <SendIcon size={18} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
