import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, ChevronDown, Trash2 } from 'lucide-react';

export default function JobPostingForm() {
  // 1. Updated State to match your specific requirement
  const [formData, setFormData] = useState({
    requisitionId: '',
    title: '',
    department: '',
    requestedBy: '', // Added input
    openings: 0, // Added input
    status: 'Draft', // Default status
    application: 0, // Default
    dateCreated: new Date().toISOString().split('T')[0],
    postedDate: '',
    location: '',
    type: 'Full Time',
    salary: '', // Populated based on Cadre/Selection
    deadline: '',
    description: '',
    requirements: [], // Handled via dynamic list
    responsibilities: [], // Handled via dynamic list
  });

  // Helper state for array inputs
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [cadre, setCadre] = useState('Senior Management'); // UI specific state

  // Handle simple text/select changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Radio changes
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Logic to update salary based on Cadre selection (simulating the UI logic)
  useEffect(() => {
    let salaryRange = '';
    if (cadre === 'Senior Management')
      salaryRange = '₦15,000,000 - ₦25,000,000';
    else if (cadre === 'Mid Level') salaryRange = '₦8,000,000 - ₦15,000,000';
    else if (cadre === 'Junior') salaryRange = '₦3,000,000 - ₦8,000,000';

    setFormData((prev) => ({ ...prev, salary: salaryRange }));
  }, [cadre]);

  // Handle Array Additions (Responsibilities/Requirements)
  const addItem = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
    setter('');
  };

  // Handle Array Removals
  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // postedDate is set on submit
    const finalData = {
      ...formData,
      postedDate: new Date().toISOString().split('T')[0],
    };
    console.log('Final Form Data:', finalData);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-2">
      <form onSubmit={handleSubmit}>
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a5d1a] text-white">
              <Plus size={24} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Post New Job</h2>
              <p className="text-sm text-gray-500">
                Create and publish a new job opening
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 space-y-6 overflow-y-auto py-4">
          {/* Requisition ID */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Create job from requisition{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="requisitionId"
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={formData.requisitionId}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select existing requisition
                </option>
                <option value="req-001">REQ-001: Senior Engineer</option>
                <option value="req-002">REQ-002: Product Manager</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Job Title & Department Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          {/* Requested By & Openings Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Requested By
              </label>
              <input
                type="text"
                name="requestedBy"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
                value={formData.requestedBy}
                onChange={handleInputChange}
                placeholder="Hiring Manager Name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Openings
              </label>
              <input
                type="number"
                name="openings"
                min="1"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
                value={formData.openings || ''}
                onChange={handleInputChange}
                placeholder="e.g. 1"
              />
            </div>
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {['Full Time', 'Contract', 'Internship'].map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="type"
                      className="peer h-5 w-5 appearance-none rounded-full border border-gray-300 checked:border-[#3b07bb]"
                      checked={formData.type === t}
                      onChange={() => handleRadioChange('type', t)}
                    />
                    <div className="pointer-events-none absolute h-2.5 w-2.5 scale-0 rounded-full bg-[#3b07bb] transition-transform peer-checked:scale-100" />
                  </div>
                  <span className="text-sm text-gray-600">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location & Deadline */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g Lagos, Nigeria"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="deadline"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
                <Calendar className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Cadre Selection (Drives Salary) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Cadre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600"
                value={cadre}
                onChange={(e) => setCadre(e.target.value)}
              >
                <option>Senior Management</option>
                <option>Mid Level</option>
                <option>Junior</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Salary Info (Read-only driven by logic, but stored in form data) */}
          <div className="rounded-lg bg-purple-50 p-4 text-sm text-purple-900">
            Typical salary range for "<span className="font-bold">{cadre}</span>
            " is "<span className="font-bold">{formData.salary || '...'}</span>
            ".
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the role..."
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-600"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Responsibilities (Array Input) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a responsibility..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-600"
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addItem(
                    'responsibilities',
                    newResponsibility,
                    setNewResponsibility
                  ))
                }
              />
              <button
                type="button"
                onClick={() =>
                  addItem(
                    'responsibilities',
                    newResponsibility,
                    setNewResponsibility
                  )
                }
                className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {formData.responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="group flex justify-between text-sm text-gray-600"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem('responsibilities', index)}
                    className="text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements (Array Input) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a requirement..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-600"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addItem('requirements', newRequirement, setNewRequirement))
                }
              />
              <button
                type="button"
                onClick={() =>
                  addItem('requirements', newRequirement, setNewRequirement)
                }
                className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {formData.requirements.map((item, index) => (
                <li
                  key={index}
                  className="group flex justify-between text-sm text-gray-600"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem('requirements', index)}
                    className="text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 p-6">
          <button
            type="button"
            className="rounded-full border border-green-700 px-8 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            Back
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#3b07bb] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#2f0596]"
            >
              Post Job
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
