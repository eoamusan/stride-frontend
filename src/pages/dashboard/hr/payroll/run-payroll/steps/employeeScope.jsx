import { CustomButton, SearchInput } from '@/components/customs';
import CustomCheckbox from '@/components/customs/checkbox';
import SelectionCard from '@/components/customs/selectionCard';
import { useState } from 'react';

const departments = [
  { id: 'eng', name: 'Engineering', count: 40 },
  { id: 'sales', name: 'Sales', count: 40 },
  { id: 'marketing', name: 'Marketing', count: 40 },
  { id: 'hr', name: 'Human Resources', count: 40 },
];

const cadres = [
  { id: 'csuite', name: 'C-suite Executive', count: 40 },
  { id: 'senior', name: 'Senior Management', count: 40 },
  { id: 'middle', name: 'Middle Management', count: 40 },
  { id: 'entry', name: 'Entry Level', count: 40 },
  { id: 'intern', name: 'Internship/Trainee', count: 40 },
  { id: 'tech', name: 'Technicians', count: 40 },
];

const sampleEmployees = [
  {
    id: '1',
    name: 'Nathaniel Desire',
    initials: 'ND',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
  },
  {
    id: '2',
    name: 'Femi Johnson',
    initials: null, 
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
    avatar: 'https://i.pravatar.cc/40?u=femi', 
  },
  {
    id: '3',
    name: 'Sarah Adeyemi',
    initials: null,
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
  },
];

const EmployeeSelection = ({ onBack, onNext }) => {
  const totalEmployees = 142;

  const [selectionMode, setSelectionMode] = useState('all'); // 'all', 'department', 'cadre', 'specific'
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCadres, setSelectedCadres] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const getCurrentCount = () => {
    if (selectionMode === 'all') return totalEmployees;
    if (selectionMode === 'department') return selectedDepartments.length * 40; // simplified
    if (selectionMode === 'cadre') return selectedCadres.length * 40; // simplified
    if (selectionMode === 'specific') return selectedEmployees.length;
    return 0;
  };

  const handleDepartmentToggle = (deptId) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleCadreToggle = (cadreId) => {
    setSelectedCadres((prev) =>
      prev.includes(cadreId)
        ? prev.filter((id) => id !== cadreId)
        : [...prev, cadreId]
    );
  };

  const handleEmployeeToggle = (empId) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const isModeActive = (mode) => selectionMode === mode;

  return (
    <div className="mx-auto space-y-3">
      <div className="space-y-4">
        <SelectionCard
          title="All Eligible Employees"
          description="Include all 142 active employees"
          count={totalEmployees}
          active={isModeActive('all')}
          onClick={() => {
            setSelectionMode('all');
            setSelectedDepartments([]);
            setSelectedCadres([]);
            setSelectedEmployees([]);
          }}
        />

        <SelectionCard
          title="Filter by Department"
          description="Select specific departments to process"
          count={getCurrentCount()}
          active={isModeActive('department')}
          onClick={() => setSelectionMode('department')}
        >
          {isModeActive('department') && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {departments.map((dept) => (
                <label
                  key={dept.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-[#D3D3D380] bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <CustomCheckbox
                      checked={selectedDepartments.includes(dept.id)}
                      onChange={() => handleDepartmentToggle(dept.id)}
                      label={dept.name}
                    />
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D980] text-sm font-semibold text-gray-500">
                    {dept.count}
                  </span>
                </label>
              ))}
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Filter by Cadre"
          description="Select specific cadres to process"
          count={getCurrentCount()}
          active={isModeActive('cadre')}
          onClick={() => setSelectionMode('cadre')}
        >
          {isModeActive('cadre') && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cadres.map((cadre) => (
                <label
                  key={cadre.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-[#D3D3D380] bg-gray-50 p-3 transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <CustomCheckbox
                      checked={selectedCadres.includes(cadre.id)}
                      onChange={() => handleCadreToggle(cadre.id)}
                      label={cadre.name}
                    />
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D980] text-sm font-semibold text-gray-500">
                    {cadre.count}
                  </span>
                </label>
              ))}
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Specific Employees"
          description="Select individual employees manually"
          count={getCurrentCount()}
          active={isModeActive('specific')}
          onClick={() => setSelectionMode('specific')}
        >
          {isModeActive('specific') && (
            <div className="mt-4 flex flex-col gap-3">
              <SearchInput placeholder="Search employees..." />

              <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-[#E8E8E8] bg-white p-4">
                {sampleEmployees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <CustomCheckbox
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => handleEmployeeToggle(emp.id)}
                      />

                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                          {emp.initials || emp.name[0].toUpperCase()}
                        </div>
                      )}

                      <p className="truncate text-sm font-medium text-black">
                        {emp.name}
                      </p>
                    </div>

                    <p className="truncate text-sm font-medium text-black">
                      {emp.role}
                    </p>

                    <p className="truncate text-sm font-medium text-black">
                      {emp.department}
                    </p>

                    <span className="text-sm font-medium text-black">
                      {emp.empId}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </SelectionCard>
      </div>

      <hr />

      <div className="flex items-center justify-between">
        <CustomButton variant="outline" onClick={onBack}>Back</CustomButton>
        <CustomButton onClick={onNext}>Preview</CustomButton>
      </div>
    </div>
  );
};

export default EmployeeSelection;
