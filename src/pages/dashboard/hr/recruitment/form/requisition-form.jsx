import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function ManpowerRequisitionForm() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    employmentType: '',
    cadre: '',
    budgetMin: '',
    budgetMax: '',
    openings: 1,
    urgency: '',
    expectedStartDate: '',
    reasonForHire: '',
    detailedReason: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add your submission logic here
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 bg-white"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Man-Power Requisition Form
        </h2>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobTitle"
            placeholder="e.g Senior Software Engineer"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-600 focus:outline-none"
            required
            value={formData.jobTitle}
            onChange={handleInputChange}
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="department"
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Engineering
              </option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Human Resources</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 pt-1">
            {['Full Time', 'Contract', 'Internship'].map((type) => (
              <label
                key={type}
                className="group flex cursor-pointer items-center"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="employmentType"
                    value={type}
                    checked={formData.employmentType === type}
                    onChange={() => handleRadioChange('employmentType', type)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 transition-all checked:border-purple-600 checked:bg-white"
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cadre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cadre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="cadre"
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-500 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              value={formData.cadre}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select the role level or grade
              </option>
              <option value="junior">Junior (L1-L2)</option>
              <option value="mid">Mid-Level (L3-L4)</option>
              <option value="senior">Senior (L5+)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Budget Range & Number of Openings */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget Range{' '}
              <span className="text-xs text-gray-400">(Per Annum)</span>{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400">
                  Min
                </span>
                <input
                  type="text"
                  name="budgetMin"
                  placeholder="₦15,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.budgetMin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400">
                  Max
                </span>
                <input
                  type="text"
                  name="budgetMax"
                  placeholder="₦25,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number of Openings <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="openings"
              min="1"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              value={formData.openings}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Urgency
          </label>
          <div className="flex gap-6 pt-1">
            {['Low', 'High'].map((level) => (
              <label
                key={level}
                className="group flex cursor-pointer items-center"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={() => handleRadioChange('urgency', level)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 transition-all checked:border-purple-600 checked:bg-white"
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Expected Start Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Start Date
          </label>
          <div className="relative">
            <input
              type="text"
              name="expectedStartDate"
              placeholder="20/12/2025"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-600 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              value={formData.expectedStartDate}
              onChange={handleInputChange}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
            />
            <Calendar className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Reason for Hire */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Reason for Hire <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 pt-1">
            {['New Role', 'Replacement', 'Growth'].map((reason) => (
              <label
                key={reason}
                className="group flex cursor-pointer items-center"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="reasonForHire"
                    value={reason}
                    checked={formData.reasonForHire === reason}
                    onChange={() => handleRadioChange('reasonForHire', reason)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 transition-all checked:border-purple-600 checked:bg-white"
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                </div>
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Reason */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Detailed Reason
          </label>
          <textarea
            name="detailedReason"
            rows="4"
            maxLength="200"
            placeholder="Explain with details the reasons for this hire and how it benefits the company"
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            value={formData.detailedReason}
            onChange={handleInputChange}
          ></textarea>
          <div className="text-right text-xs text-gray-400">
            {formData.detailedReason.length}/200
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-[#3b07bb] py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#2f0596]"
        >
          Preview Requisition
        </button>
      </form>
    </div>
  );
}
