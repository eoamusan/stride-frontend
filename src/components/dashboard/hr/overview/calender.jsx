import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parseISO,
  isWithinInterval,
  isBefore,
} from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// --- MOCK DATA AND SERVICES ---

const generateDemoData = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [
    {
      id: 1,
      userId: 'u1',
      name: 'Nathaniel Desire',
      role: 'UI Designer',
      title: 'Sick Leave',
      startTime: new Date(year, month, today.getDate(), 9, 0).toISOString(),
      endTime: new Date(year, month, today.getDate(), 17, 0).toISOString(),
      type: 'leave',
      leaveRemaining: 4,
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: 2,
      userId: 'u2',
      name: 'Sarah Connor',
      role: 'Product Manager',
      title: 'Strategy Meeting',
      startTime: new Date(year, month, today.getDate(), 14, 0).toISOString(),
      endTime: new Date(year, month, today.getDate(), 15, 30).toISOString(),
      type: 'meeting',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
      id: 3,
      userId: 'u1',
      name: 'Nathaniel Desire',
      role: 'UI Designer',
      title: 'Annual Leave',
      startTime: new Date(year, month, today.getDate() + 2, 9, 0).toISOString(),
      endTime: new Date(year, month, today.getDate() + 2, 17, 0).toISOString(),
      type: 'leave',
      leaveRemaining: 3,
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: 4,
      userId: 'u3',
      name: 'Jim Halpert',
      role: 'Sales Lead',
      title: 'Client Call',
      startTime: new Date(
        year,
        month,
        today.getDate() + 5,
        10,
        0
      ).toISOString(),
      endTime: new Date(year, month, today.getDate() + 5, 11, 0).toISOString(),
      type: 'meeting',
      avatar: 'https://i.pravatar.cc/150?u=3',
    },
    {
      id: 5,
      userId: 'u2',
      name: 'Sarah Connor',
      role: 'Product Manager',
      title: 'Design Review',
      startTime: new Date(year, month, today.getDate(), 10, 0).toISOString(),
      endTime: new Date(year, month, today.getDate(), 11, 0).toISOString(),
      type: 'meeting',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
  ];
};

const mockFetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDemoData());
    }, 500);
  });
};

// --- HELPER FUNCTIONS ---

const getEventStatus = (event) => {
  const now = new Date();
  const start = parseISO(event.startTime);
  const end = parseISO(event.endTime);

  if (isWithinInterval(now, { start, end })) return 'Present';
  if (isBefore(end, now)) return 'Past';
  return 'Future';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return 'text-green-600 bg-green-100';
    case 'Past':
      return 'text-gray-500 bg-gray-100';
    case 'Future':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-500';
  }
};

// --- SUB-COMPONENTS ---

const CalendarHeader = ({ currentMonth, setCurrentMonth }) => (
  <div className="mb-6 flex items-center justify-between px-2">
    <h2 className="text-xl font-bold text-gray-900">Calendar</h2>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="rounded p-1 hover:bg-gray-100"
      >
        <ChevronLeft size={16} className="text-gray-400" />
      </button>
      <div className="flex cursor-pointer items-center text-sm font-medium text-gray-600 hover:text-gray-900">
        {format(currentMonth, 'MMMM yyyy')}
        <ChevronDown size={16} className="ml-1" />
      </div>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="rounded p-1 hover:bg-gray-100"
      >
        <ChevronRight size={16} className="text-gray-400" />
      </button>
    </div>
  </div>
);

const CalendarGrid = ({
  currentMonth,
  selectedDate,
  setSelectedDate,
  events,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  // Header Row
  const headerRow = (
    <div className="mb-4 grid grid-cols-7">
      {weekDays.map((d) => (
        <div key={d} className="text-center text-sm font-medium text-gray-400">
          {d}
        </div>
      ))}
    </div>
  );

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      // Check for events on this day
      const dayEvents = events.filter((e) =>
        isSameDay(parseISO(e.startTime), day)
      );
      const hasMeeting = dayEvents.some((e) => e.type === 'meeting');
      const hasLeave = dayEvents.some((e) => e.type === 'leave');

      days.push(
        <div
          key={day.toString()}
          onClick={() => setSelectedDate(cloneDay)}
          className={`relative flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl transition-all ${!isCurrentMonth ? 'text-gray-300' : 'font-semibold text-gray-700'} ${isSelected ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'hover:bg-gray-50'} `}
        >
          <span className="text-sm">{format(day, 'd')}</span>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 mt-1 flex gap-1">
            {hasMeeting && (
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400"></div>
            )}
            {hasLeave && (
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-y-2" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="mb-6">
      {headerRow}
      {rows}

      {/* Legend */}
      <div className="mt-4 flex justify-end gap-4 px-2 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
          <span>Meetings</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Leave</span>
        </div>
      </div>
    </div>
  );
};

const TabToggle = ({ activeTab, setActiveTab }) => (
  <div className="relative mb-6 flex rounded-full bg-gray-100 p-1">
    <button
      onClick={() => setActiveTab('leave')}
      className={`z-10 flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-all ${
        activeTab === 'leave'
          ? 'bg-[#4F46E5] text-white shadow-md'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Upcoming Leaves
    </button>
    <button
      onClick={() => setActiveTab('meeting')}
      className={`z-10 flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-all ${
        activeTab === 'meeting'
          ? 'bg-[#4F46E5] text-white shadow-md'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Meetings
    </button>
  </div>
);

const EventItem = ({ event, getEventStatus, getStatusColor }) => {
  const status = getEventStatus(event);
  return (
    <div className="flex items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Avatar */}
      <img
        src={event.avatar}
        alt={event.name}
        className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
      />

      {/* Info */}
      <div className="ml-3 flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-gray-800">{event.name}</h4>
          <p className="mt-0.5 text-xs text-gray-400">{event.role}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(status)}`}
        >
          {status}
        </span>
      </div>

      {/* Right Side Meta */}
      <div className="ml-2 text-right">
        {event.type === 'leave' ? (
          <span className="text-xs font-medium text-gray-500">
            {event.leaveRemaining} days left
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-500">
            {format(parseISO(event.startTime), 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
};

const EventList = ({
  selectedDate,
  activeTab,
  events,
  getEventStatus,
  getStatusColor,
}) => {
  const listEvents = events.filter(
    (e) =>
      isSameDay(parseISO(e.startTime), selectedDate) && e.type === activeTab
  );

  return (
    <div>
      <h3 className="mb-3 px-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {format(selectedDate, 'dd/MM/yyyy')}
      </h3>

      <div className="scrollbar-hide max-h-64 space-y-3 overflow-y-auto pr-1">
        {listEvents.length > 0 ? (
          listEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              getEventStatus={getEventStatus}
              getStatusColor={getStatusColor}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">
              No {activeTab}s for this day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const CalendarWidget = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('leave'); // 'leave' or 'meeting'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockFetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-43 min-w-full items-start justify-center overflow-hidden font-sans">
      {/* Main Card Container */}
      <div className="max-w-md min-w-full rounded-md p-8 shadow-xl">
        <CalendarHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : (
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            events={events}
          />
        )}

        <TabToggle activeTab={activeTab} setActiveTab={setActiveTab} />

        <EventList
          selectedDate={selectedDate}
          activeTab={activeTab}
          events={events}
          getEventStatus={getEventStatus}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
};

export default CalendarWidget;
