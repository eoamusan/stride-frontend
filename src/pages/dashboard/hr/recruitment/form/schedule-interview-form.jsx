import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X, ChevronDown, Clock } from 'lucide-react';

export default function ScheduleInterviewForm({ onClose, initialData }) {
  const [formData, setFormData] = useState({
    interviewType: 'Online', // Default to Online as per image
    candidateId: '',
    jobTitle: '',
    date: '',
    time: '',
    duration: '1 hour',
    location: '',
    interviewer: '',
    status: 'Scheduled',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      {/* Custom Header matching design */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Calendar className="h-5 w-5 text-green-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Schedule Interview
          </h2>
        </div>
        {/* Close button is typically handled by DialogContent, but we can add one if we hide the default */}
      </div>

      {/* Info Banner */}
      <div className="mb-8 rounded-lg bg-[#F3E8FF] p-4 text-sm text-[#3300C9]">
        Setting up interview for{' '}
        <span className="font-bold">
          “{initialData?.applicantName || 'Candidate'}”
        </span>
        . An email invitation will be sent automatically.
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Interview Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Interview Type
          </label>
          <div className="relative">
            <select
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
            >
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Phone">Phone</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Date, Time, Duration Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Duration
            </label>
            <div className="relative">
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
              >
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Interviewers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Interviewers
          </label>
          <input
            type="text"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleChange}
            placeholder="Search team members..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
          />
          <p className="text-xs text-gray-500">
            Separate multiple interviewers with commas
          </p>
        </div>

        {/* Meeting Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Meeting Link
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Link is generated automatically if left blank"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full border-gray-300 px-8 py-6 text-gray-700 hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="rounded-full bg-[#3300C9] px-8 py-6 text-white hover:bg-[#2a00a8]"
          >
            Schedule Interview
          </Button>
        </div>
      </form>
    </div>
  );
}
