import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon, StepsCheckIcon } from '@/components/ui/svgs';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock conversation and activity for demo
const MOCK_CONVERSATION = [
  {
    id: '1',
    author: 'Femi Johnson',
    time: 'May 12, 2024, 8:30am',
    body: 'Hi HR team, I need an employment verification letter for my visa application. Could you please provide one stating my current role and salary.',
  },
  {
    id: '2',
    author: 'HR Support',
    time: 'May 12, 2024, 8:30am',
    body: 'Hello Sarah, I can help with that. Do you need it addressed to a specific embassy or consulate?',
    isSupport: true,
  },
  {
    id: '3',
    author: 'Femi Johnson',
    time: 'May 12, 2024, 8:30am',
    body: 'Yes, please address it to the French Consulate. Thank you!',
  },
];

const STATUS_ORDER = ['Open', 'In Progress', 'Resolved', 'Closed'];

function getActivityLog(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return [
    {
      id: '1',
      label: 'Ticket created',
      by: 'Femi Johnson',
      time: 'May 12, 2024, 10:30 AM',
      done: true,
    },
    {
      id: '2',
      label: 'Status changed to Open',
      by: 'System',
      time: 'May 12, 2024, 10:30 AM',
      done: idx >= 0,
    },
    {
      id: '3',
      label: 'Status changed to In Progress',
      by: 'Admin User',
      time: 'May 12, 2024, 10:30 AM',
      done: idx >= 1,
    },
    {
      id: '4',
      label: 'Status changed to Resolved',
      by: 'Admin User',
      time: 'May 12, 2024, 10:30 AM',
      done: idx >= 2,
    },
    {
      id: '5',
      label: 'Status changed to Closed',
      by: 'Admin User',
      time: 'May 12, 2024, 10:30 AM',
      done: idx >= 3,
    },
  ];
}

const STATUS_STYLES = {
  Open: 'bg-[#FEE2E2] text-[#B91C1C]',
  'In Progress': 'bg-[#FEF9C3] text-[#A16207]',
  Closed: 'bg-[#DCFCE7] text-[#15803D]',
  Resolved: 'bg-[#DBEAFE] text-[#1D4ED8]',
};

export default function RequestDetailsView({
  ticket,
  onBack,
  onConfirmResolution,
  onReopenTicket,
  onSendReply,
}) {
  const [replyText, setReplyText] = useState('');
  const isClosed = ticket?.status === 'Closed';
  const activityLog = getActivityLog(ticket?.status);

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <button
        type="button"
        onClick={onBack}
        className="font-raleway flex items-center gap-2 text-[20px] leading-none font-semibold text-gray-900"
      >
        <ArrowLeftIcon className="size-5 shrink-0" />
        Request Details
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Ticket info + Conversation */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ticket meta row */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="grid grid-cols-4 gap-x-6">
              <div>
                <p className="font-raleway text-sm text-gray-500">Ticket ID</p>
                <p className="font-raleway mt-0.5 text-sm font-medium text-gray-900">
                  {ticket?.ticketId}
                </p>
              </div>
              <div>
                <p className="font-raleway text-sm text-gray-500">
                  Request Type
                </p>
                <p className="font-raleway mt-0.5 text-sm font-medium text-gray-900">
                  {ticket?.requestType}
                </p>
              </div>
              <div>
                <p className="font-raleway text-sm text-gray-500">
                  Submitted By
                </p>
                <p className="font-raleway mt-0.5 text-sm font-medium text-gray-900">
                  {ticket?.submittedBy}
                </p>
              </div>
              <div>
                <p className="font-raleway text-sm text-gray-500">
                  Date Submitted
                </p>
                <p className="font-raleway mt-0.5 text-sm font-medium text-gray-900">
                  {ticket?.dateSubmitted}
                </p>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-raleway text-base font-semibold text-gray-900">
                Conversation
              </h3>
              <span className="font-raleway rounded-full bg-[#FEE2E2] px-4 py-1 text-xs font-medium text-[#B91C1C]">
                High
              </span>
            </div>

            <div className="space-y-5">
              {MOCK_CONVERSATION.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col gap-1.5',
                    msg.isSupport && 'items-end'
                  )}
                >
                  <p
                    className={cn(
                      'font-raleway text-xs text-gray-500',
                      msg.isSupport && 'text-right'
                    )}
                  >
                    <span className="font-semibold text-gray-900">
                      {msg.author}
                    </span>
                    {'  '}
                    {msg.time}
                  </p>
                  <div
                    className={cn(
                      'font-raleway rounded-2xl px-4 py-3 text-sm',
                      msg.isSupport
                        ? 'bg-[#3300C9]/10 text-[#3300C9]'
                        : 'bg-gray-50 text-gray-800'
                    )}
                  >
                    {msg.body}
                  </div>
                </div>
              ))}
            </div>

            {!isClosed && (
              <div className="mt-6">
                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[90px] w-full resize-none rounded-xl border border-gray-200 text-sm"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      onSendReply?.(replyText);
                      setReplyText('');
                    }}
                    className="font-raleway rounded-full bg-[#3300C9] px-6 text-sm font-semibold text-white hover:bg-[#5A23B8]"
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Ticket Status Badge + Activity + Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-raleway mb-3 text-base font-semibold text-gray-900">
              Ticket Status
            </h3>
            <div
              className={cn(
                'font-raleway w-full rounded-full py-2 text-center text-sm font-medium',
                STATUS_STYLES[ticket?.status] || 'bg-gray-100 text-gray-700'
              )}
            >
              {ticket?.status ?? 'Open'}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-raleway mb-4 text-base font-semibold text-gray-900">
              Activity Log
            </h3>
            <div className="relative">
              {activityLog.map((item, i) => (
                <div
                  key={item.id}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  {i < activityLog.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-6 h-full border-l-2 border-dashed',
                        item.done ? 'border-green-400' : 'border-gray-300'
                      )}
                      style={{ left: '11px' }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full',
                      item.done ? 'bg-[#24A959]' : 'bg-gray-300'
                    )}
                  >
                    <StepsCheckIcon />
                  </span>
                  <div className="flex-1 pt-0.5">
                    <p className="font-raleway text-sm font-medium text-[#434343]">
                      {item.label}
                    </p>
                    <p className="font-raleway mt-0.5 text-xs text-[#434343]">
                      by {item.by} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-raleway mb-4 text-base font-semibold text-gray-900">
              Action
            </h3>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                disabled={isClosed}
                onClick={onConfirmResolution}
                className="font-raleway w-full rounded-lg bg-[#3300C9] py-[10px]! text-sm font-semibold text-white hover:bg-[#5A23B8] disabled:opacity-50"
              >
                Confirm Resolution
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onReopenTicket}
                className="font-raleway w-full rounded-lg border-[#254C00] text-sm font-semibold text-[#254C00] hover:bg-[#254C00]/5"
              >
                Reopen Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
