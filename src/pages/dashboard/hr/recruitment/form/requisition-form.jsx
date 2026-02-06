import React, { useState } from 'react';
import { Calendar, CheckCircle, Pencil } from 'lucide-react';
import {
  NumberInput,
  RadioInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from './inputs';

export default function ManpowerRequisitionForm() {
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    employmentType: '',
    detailedReason: '',
    grade: '',
    minBudget: '',
    maxBudget: '',
    noOfOpenings: 1,
    reason: '',
    startDate: '',
    urgency: '',
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
    setIsPreview(true);
  };

  const handleFinalSubmit = () => {
    console.log('Final Submission:', formData);
    // Add your submission logic here
  };

  if (isPreview) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Preview Requisition
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="w-1/3 px-6 py-4 text-sm font-medium text-gray-500">
                    Job Title
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.jobTitle || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Department
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {formData.department || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Employment Type
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.employmentType || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Cadre
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {formData.grade || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Budget Range
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.minBudget} - {formData.maxBudget}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Number of Openings
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.noOfOpenings}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Urgency
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.urgency || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Expected Start Date
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.startDate || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Reason for Hire
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.reason || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    Detailed Reason
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formData.detailedReason || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4" />
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b07bb] py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#2f0596]"
            >
              <CheckCircle className="h-4 w-4" />
              Submit Requisition
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <TextInput
          label="Job Title"
          name="jobTitle"
          placeholder="e.g Senior Software Engineer"
          value={formData.jobTitle}
          onChange={handleInputChange}
        />

        {/* Department */}
        <SelectInput
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          options={[
            { label: 'Engineering', value: '', disabled: true },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Design', value: 'design' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Human Resources', value: 'hr' },
          ]}
        />

        {/* Employment Type */}
        <RadioInput
          label="Employment Type"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleRadioChange}
          options={['Full Time', 'Contract', 'Internship']}
        />

        {/* Cadre */}
        <SelectInput
          label="Cadre"
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          options={[
            {
              label: 'Select the role level or grade',
              value: '',
              disabled: true,
            },
            { label: 'Junior (L1-L2)', value: 'junior' },
            { label: 'Mid-Level (L3-L4)', value: 'mid' },
            { label: 'Senior (L5+)', value: 'senior' },
          ]}
        />

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
                  name="minBudget"
                  placeholder="₦15,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.minBudget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400">
                  Max
                </span>
                <input
                  type="text"
                  name="maxBudget"
                  placeholder="₦25,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.maxBudget}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <NumberInput
            label="Number of Openings"
            name="noOfOpenings"
            value={formData.noOfOpenings}
            onChange={handleInputChange}
          />
        </div>

        {/* Urgency */}
        <RadioInput
          label="Urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleRadioChange}
          options={['Low', 'High']}
        />

        {/* Expected Start Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Start Date
          </label>
          <div className="relative">
            <input
              type="text"
              name="startDate"
              placeholder="20/12/2025"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-600 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              value={formData.startDate}
              onChange={handleInputChange}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
            />
            <Calendar className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Reason for Hire */}
        <RadioInput
          label="Reason for Hire"
          name="reason"
          value={formData.reason}
          onChange={handleRadioChange}
          options={['New Role', 'Replacement', 'Growth']}
        />

        {/* Detailed Reason */}
        <TextAreaInput
          label="Detailed Reason"
          name="detailedReason"
          placeholder="Explain with details the reasons for this hire and how it benefits the company"
          value={formData.detailedReason}
          onChange={handleInputChange}
          textLength={formData.detailedReason.length}
        />

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
