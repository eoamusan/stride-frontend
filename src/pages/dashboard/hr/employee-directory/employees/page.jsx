import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  BriefcaseIcon,
  BuildingIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SaveIcon,
  LandmarkIcon,
  CreditCardIcon,
  BanknoteIcon,
  FileTextIcon,
  WalletIcon,
  UploadCloudIcon,
  DownloadIcon,
  ArrowUpRightIcon,
  InboxIcon,
  ClockIcon,
} from 'lucide-react';
import {
  AddIcon,
  ArrowLeftIcon,
  EyeIcon,
  EditIcon,
  DeleteIcon,
  DateIcon,
} from '@/components/ui/svgs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import EmployeeService from '@/api/employee';
import toast from 'react-hot-toast';
import SuccessModal from '@/components/dashboard/hr/success-modal';

// Set to true to always use dummy data for UI testing (e.g. when opening /employees/1 … /employees/4)
const USE_MOCK_FOR_TESTING = true;

// Dummy data for employee detail UI testing (matches directory mock ids 1–4)
const MOCK_EMPLOYEES_BY_ID = {
  1: {
    id: '1',
    firstName: 'Nathaniel',
    lastName: 'Desire',
    employeeId: '345321231',
    email: 'nathaniel.desire@example.com',
    phoneNumber: '+234 800 000 0001',
    gender: 'Male',
    dateOfBirth: '1990-05-12',
    department: 'Engineering',
    departmentName: 'Engineering',
    positionTitle: 'Senior Software Engineer',
    position: 'Senior Software Engineer',
    employmentType: 'FULL_TIME',
    homeAddress: '12 Marina Street, Lagos Island, Lagos',
    address: { address1: '12 Marina Street, Lagos Island, Lagos' },
    hireDate: '2023-01-15',
    startDate: '2023-01-15',
    lineManager: 'Ada Okafor',
    status: 'ACTIVE',
    bankName: 'GTBank',
    accountName: 'Nathaniel Desire',
    accountNumber: '0123456789',
    salary: 850000,
    taxId: 'TIN-NG-123456',
    bvn: '22123456789',
    payrollStatus: 'Active',
  },
  2: {
    id: '2',
    firstName: 'Femi',
    lastName: 'Johnson',
    employeeId: '345321232',
    email: 'femi.johnson@example.com',
    phoneNumber: '+234 800 000 0002',
    gender: 'Male',
    dateOfBirth: '1988-11-03',
    department: 'Engineering',
    departmentName: 'Engineering',
    positionTitle: 'Senior Software Engineer',
    position: 'Senior Software Engineer',
    employmentType: 'FULL_TIME',
    homeAddress: '45 Adeola Odeku Street, Victoria Island, Lagos',
    address: { address1: '45 Adeola Odeku Street, Victoria Island, Lagos' },
    hireDate: '2022-06-01',
    startDate: '2022-06-01',
    lineManager: 'Ada Okafor',
    status: 'ON_LEAVE',
    bankName: 'Access Bank',
    accountName: 'Femi Johnson',
    accountNumber: '0987654321',
    salary: 920000,
    taxId: 'TIN-NG-234567',
    bvn: '22987654321',
    payrollStatus: 'Active',
  },
  3: {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Adeyemi',
    employeeId: '345321233',
    email: 'sarah.adeyemi@example.com',
    phoneNumber: '+234 800 000 0003',
    gender: 'Female',
    dateOfBirth: '1992-07-22',
    department: 'Engineering',
    departmentName: 'Engineering',
    positionTitle: 'Senior Software Engineer',
    position: 'Senior Software Engineer',
    employmentType: 'CONTRACT',
    homeAddress: '78 Allen Avenue, Ikeja, Lagos',
    address: { address1: '78 Allen Avenue, Ikeja, Lagos' },
    hireDate: '2021-03-10',
    startDate: '2021-03-10',
    lineManager: 'Chidi Nwosu',
    status: 'TERMINATED',
    bankName: 'Zenith Bank',
    accountName: 'Sarah Adeyemi',
    accountNumber: '1122334455',
    salary: 780000,
    taxId: 'TIN-NG-345678',
    bvn: '22345678901',
    payrollStatus: 'Inactive',
  },
  4: {
    id: '4',
    firstName: 'Kemi',
    lastName: 'Jakada',
    employeeId: '345321234',
    email: 'kemi.jakada@example.com',
    phoneNumber: '+234 800 000 0004',
    gender: 'Female',
    dateOfBirth: '1995-01-08',
    department: 'Engineering',
    departmentName: 'Engineering',
    positionTitle: 'Senior Software Engineer',
    position: 'Senior Software Engineer',
    employmentType: 'INTERN',
    homeAddress: '3 Bourdillon Road, Ikoyi, Lagos',
    address: { address1: '3 Bourdillon Road, Ikoyi, Lagos' },
    hireDate: '2024-02-20',
    startDate: '2024-02-20',
    lineManager: 'Nathaniel Desire',
    status: 'ACTIVE',
    bankName: 'First Bank',
    accountName: 'Kemi Jakada',
    accountNumber: '5544332211',
    salary: 450000,
    taxId: 'TIN-NG-456789',
    bvn: '22567890123',
    payrollStatus: 'Active',
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'documents', label: 'Documents' },
];

const STATUS_STYLES = {
  Active: 'bg-green-50 text-green-700 border border-green-200',
  Inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
  'On Leave': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Terminated: 'bg-red-50 text-red-700 border border-red-200',
};

// Edit form input/select style: full width, 44px height, 8px radius, 1px border, padding 10px 12px
const EDIT_FIELD_CLASS =
  'h-[44px] w-full rounded-[8px] border border-input py-[10px] px-3';

// White content card: ~90% of container height so the bg fills most of the page
const WHITE_CARD_CLASS =
  'mt-4 min-h-[90vh] rounded-xl border border-gray-100 bg-white p-6';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="flex items-center gap-2 text-sm text-gray-800">
        {Icon && <Icon className="size-4 shrink-0 text-gray-400" />}
        <span>{value || '-'}</span>
      </div>
    </div>
  );
}

// ─── Salary Breakdown Modal (view) ───────────────────────────────────────────
function SalaryBreakdownModal({ open, onOpenChange, onEditSalary }) {
  const earnings = [
    {
      component: 'Basic Salary',
      taxable: 'Yes 15%',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
    {
      component: 'Housing Allowance',
      taxable: 'Yes 15%',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
    {
      component: 'Transport Allowance',
      taxable: 'Yes 15%',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
    {
      component: 'Utility Allowance',
      taxable: 'Yes 15%',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
  ];
  const deductions = [
    {
      component: 'Employer Pension (10%)',
      taxable: 'No',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
    {
      component: 'PAYE Tax',
      taxable: 'No',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
    {
      component: 'NHF Contribution',
      taxable: 'No',
      monthly: '₦145,000',
      annual: '₦145,000',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8"
        overlayClassName="bg-[#0C0C0CE5]"
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#254C00]">
            <BanknoteIcon className="size-5 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Salary Breakdown
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <h4 className="text-sm font-semibold text-gray-800">
            Salary Components
          </h4>

          {/* Earnings */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Earnings</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Components</th>
                  <th className="pb-2 font-normal">Taxable</th>
                  <th className="pb-2 font-normal">Monthly (₦)</th>
                  <th className="pb-2 font-normal">Annual (₦)</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((row, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.component}
                    </td>
                    <td className="py-1.5 text-gray-600">{row.taxable}</td>
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.monthly}
                    </td>
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.annual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Deductions</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Components</th>
                  <th className="pb-2 font-normal">Taxable</th>
                  <th className="pb-2 font-normal">Monthly (₦)</th>
                  <th className="pb-2 font-normal">Annual (₦)</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((row, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.component}
                    </td>
                    <td className="py-1.5 text-gray-600">{row.taxable}</td>
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.monthly}
                    </td>
                    <td className="py-1.5 font-semibold text-gray-800">
                      {row.annual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compensation Summary */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[#6C2BD9]">
              Compensation Summary
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Duration</th>
                  <th className="pb-2 font-normal">Gross Pay (₦)</th>
                  <th className="pb-2 font-normal">Deductions (₦)</th>
                  <th className="pb-2 font-normal">Net Pay (₦)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-50">
                  <td className="py-1.5 font-semibold text-gray-800">
                    Monthly
                  </td>
                  <td className="py-1.5 font-semibold text-gray-800">
                    ₦200,000
                  </td>
                  <td className="py-1.5 font-semibold text-red-500">
                    -₦12,000
                  </td>
                  <td className="py-1.5 font-semibold text-green-600">
                    ₦188,000
                  </td>
                </tr>
                <tr className="border-t border-gray-50">
                  <td className="py-1.5 font-semibold text-gray-800">Annual</td>
                  <td className="py-1.5 font-semibold text-gray-800">
                    ₦2,400,000
                  </td>
                  <td className="py-1.5 font-semibold text-red-500">
                    -₦144,000
                  </td>
                  <td className="py-1.5 font-semibold text-green-600">
                    ₦2,256,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-[#254C00] px-6 text-[#254C00] hover:bg-[#254C00] hover:text-white"
          >
            Back
          </Button>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="rounded-full px-6">
              <DownloadIcon className="mr-2 size-4" />
              Download PDF
            </Button>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onEditSalary?.();
              }}
              className="font-raleway rounded-full bg-[#3300C9] px-8 text-white hover:bg-[#3300C9]/90"
            >
              Edit Salary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSalaryBreakdown, setShowSalaryBreakdown] = useState(false);
  const [showEditSalaryBreakdown, setShowEditSalaryBreakdown] = useState(false);
  const [showSalaryUpdatedModal, setShowSalaryUpdatedModal] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [docCategory, setDocCategory] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [documentCategories, setDocumentCategories] = useState([
    'Personal',
    'Offer Letter',
    'Tax',
    'Contract of Employment',
    'Certificate',
    'Others',
  ]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  // Date picker popovers
  const [dobOpen, setDobOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);

  // Personal info form state
  const [personalForm, setPersonalForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: null,
    department: '',
    employmentType: '',
    jobTitle: '',
    homeAddress: '',
    startDate: null,
    lineManager: '',
  });

  // Payroll form state
  const [payrollForm, setPayrollForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    salaryAmount: '',
    taxId: '',
    bvn: '',
    payrollStatus: 'Active',
  });

  function applyEmployeeToState(emp) {
    setEmployee(emp);
    setPersonalForm({
      employeeId: emp.employeeId || emp._id || '',
      name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
      email: emp.email || '',
      phone: emp.phoneNumber || emp.phone || '',
      gender: emp.gender || '',
      dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null,
      department: emp.departmentName || emp.department || '',
      employmentType:
        emp.employmentType === 'FULL_TIME'
          ? 'Full-time'
          : emp.employmentType === 'PART_TIME'
            ? 'Part-time'
            : emp.employmentType === 'CONTRACT'
              ? 'Contract'
              : emp.employmentType === 'INTERN'
                ? 'Intern'
                : emp.employmentType || '',
      jobTitle: emp.positionTitle || emp.position || '',
      homeAddress: emp.address?.address1 || emp.homeAddress || '',
      startDate: emp.hireDate ? new Date(emp.hireDate) : null,
      lineManager: emp.lineManager || '',
    });
    setPayrollForm({
      bankName: emp.bankName || '',
      accountName: emp.accountName || '',
      accountNumber: emp.accountNumber || '',
      salaryAmount: emp.salary ? `₦${Number(emp.salary).toLocaleString()}` : '',
      taxId: emp.taxId || '',
      bvn: emp.bvn || '',
      payrollStatus: emp.payrollStatus || 'Active',
    });
  }

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setIsLoading(true);

        if (USE_MOCK_FOR_TESTING && MOCK_EMPLOYEES_BY_ID[id]) {
          const mockEmp = MOCK_EMPLOYEES_BY_ID[id];
          setDepartments([
            { id: 'eng', name: 'Engineering' },
            { id: 'sales', name: 'Sales' },
            { id: 'marketing', name: 'Marketing' },
            { id: 'hr', name: 'Human Resources' },
            { id: 'finance', name: 'Finance' },
          ]);
          applyEmployeeToState(mockEmp);
          setUploadedDocs([
            { id: 'doc-1', name: 'ID_Card.pdf', category: 'Personal' },
            { id: 'doc-2', name: 'Resume.pdf', category: 'Personal' },
            { id: 'doc-3', name: 'Offer_Letter.pdf', category: 'Employment' },
            { id: 'doc-4', name: 'Bank_Details.pdf', category: 'Payroll' },
          ]);
          setIsLoading(false);
          return;
        }

        const [empRes, deptRes] = await Promise.all([
          EmployeeService.get({ id }),
          EmployeeService.getDepartments(),
        ]);
        const emp = empRes.data?.data || empRes.data || {};
        setDepartments(deptRes.data?.data || []);
        applyEmployeeToState(emp);
      } catch (err) {
        console.error('Error fetching employee:', err);
        if (MOCK_EMPLOYEES_BY_ID[id]) {
          setDepartments([
            { id: 'eng', name: 'Engineering' },
            { id: 'sales', name: 'Sales' },
            { id: 'marketing', name: 'Marketing' },
            { id: 'hr', name: 'Human Resources' },
            { id: 'finance', name: 'Finance' },
          ]);
          applyEmployeeToState(MOCK_EMPLOYEES_BY_ID[id]);
        } else {
          toast.error('Failed to load employee data');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleSavePersonal = async () => {
    try {
      setIsSaving(true);
      const nameParts = personalForm.name.trim().split(' ');
      await EmployeeService.update({
        id,
        data: {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: personalForm.email,
          phoneNumber: personalForm.phone,
          gender: personalForm.gender,
          dateOfBirth: personalForm.dateOfBirth,
          department: personalForm.department,
          employmentType: personalForm.employmentType,
          position: personalForm.jobTitle,
          address: { address1: personalForm.homeAddress },
          hireDate: personalForm.startDate,
          lineManager: personalForm.lineManager,
        },
      });
      toast.success('Employee details updated');
      setIsEditing(false);
      const empRes = await EmployeeService.get({ id });
      setEmployee(empRes.data?.data || empRes.data);
    } catch (err) {
      console.error('Error saving personal info:', err);
      toast.error('Failed to update employee details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayroll = async () => {
    try {
      setIsSaving(true);
      await EmployeeService.update({
        id,
        data: {
          bankName: payrollForm.bankName,
          accountName: payrollForm.accountName,
          accountNumber: payrollForm.accountNumber,
          salary:
            parseFloat(payrollForm.salaryAmount.replace(/[₦,]/g, '')) || 0,
          taxId: payrollForm.taxId,
          bvn: payrollForm.bvn,
          payrollStatus: payrollForm.payrollStatus,
        },
      });
      toast.success('Payroll details updated');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving payroll info:', err);
      toast.error('Failed to update payroll details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newDocs = files.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      category: docCategory || 'Personal',
    }));
    setUploadedDocs((prev) => [...prev, ...newDocs]);
    toast.success('Document(s) uploaded successfully');
    e.target.value = '';
  };

  // ── Derived display values ────────────────────────────────────────────────
  const rawStatus = employee?.status || 'ACTIVE';
  const displayStatus =
    rawStatus === 'ACTIVE'
      ? 'Active'
      : rawStatus === 'ON_LEAVE'
        ? 'On Leave'
        : rawStatus === 'TERMINATED'
          ? 'Terminated'
          : 'Inactive';

  const displayName = employee
    ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
    : '';
  const displayJobTitle = employee?.positionTitle || employee?.position || '';
  const displayDept = employee?.departmentName || employee?.department || '';
  const displayDate = employee?.hireDate
    ? format(new Date(employee.hireDate), 'MMMM d, yyyy.')
    : '';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ── Header action button ──────────────────────────────────────────────────
  const renderActionButton = () => {
    if (activeTab === 'documents') {
      return (
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="font-raleway h-10 gap-2 rounded-[16px] bg-[#3300C9] px-5 text-[14px] leading-6 font-semibold text-white hover:bg-[#5A23B8]"
        >
          <UploadCloudIcon className="size-4" />
          Upload Document
        </Button>
      );
    }
    if (isEditing) {
      return (
        <Button
          onClick={
            activeTab === 'personal' ? handleSavePersonal : handleSavePayroll
          }
          disabled={isSaving}
          className="font-raleway h-10 gap-2 rounded-[16px] bg-[#3300C9] px-5 text-[14px] leading-6 font-semibold text-white hover:bg-[#5A23B8]"
        >
          <SaveIcon className="size-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      );
    }
    return (
      <Button
        onClick={() => setIsEditing(true)}
        className="font-family-raleway h-10 gap-2 rounded-[16px] bg-[#3300C9] px-5 text-[14px] leading-[24px] font-semibold text-white hover:bg-[#5A23B8]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.0399 3.02123L8.15988 10.9012C7.85988 11.2012 7.55988 11.7912 7.49988 12.2212L7.06988 15.2312C6.90988 16.3212 7.67988 17.0812 8.76988 16.9312L11.7799 16.5012C12.1999 16.4412 12.7899 16.1412 13.0999 15.8412L20.9799 7.96123C22.3399 6.60123 22.9799 5.02123 20.9799 3.02123C18.9799 1.02123 17.3999 1.66123 16.0399 3.02123Z"
            stroke="white"
            strokeWidth="1.5"
            stroke-miterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.9102 4.14844C15.5802 6.53844 17.4502 8.40844 19.8502 9.08844"
            stroke="white"
            strokeWidth="1.5"
            stroke-miterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Edit Profile
      </Button>
    );
  };

  // ── Personal Info Tab ─────────────────────────────────────────────────────
  const renderPersonalView = () => (
    <div className={WHITE_CARD_CLASS}>
      <h3 className="text-base font-semibold text-gray-900">
        Personal Information
      </h3>
      <div className="mt-6 grid grid-cols-3 gap-[30px]">
        <FieldRow
          icon={CreditCardIcon}
          label="Employee ID"
          value={personalForm.employeeId}
        />
        <FieldRow icon={UserIcon} label="Name" value={personalForm.name} />
        <FieldRow
          icon={MailIcon}
          label="Email Address"
          value={personalForm.email}
        />
        <FieldRow icon={PhoneIcon} label="Phone" value={personalForm.phone} />
        <FieldRow icon={UserIcon} label="Gender" value={personalForm.gender} />
        <FieldRow
          icon={DateIcon}
          label="Date of Birth"
          value={
            personalForm.dateOfBirth
              ? format(personalForm.dateOfBirth, 'MMMM d, yyyy')
              : '-'
          }
        />
        <FieldRow
          icon={BriefcaseIcon}
          label="Job Title"
          value={personalForm.jobTitle}
        />
        <FieldRow
          icon={BuildingIcon}
          label="Department"
          value={personalForm.department}
        />
        <FieldRow
          icon={ClockIcon}
          label="Employment Type"
          value={personalForm.employmentType}
        />
        <FieldRow
          icon={MapPinIcon}
          label="Home Address"
          value={personalForm.homeAddress}
        />
        <FieldRow
          icon={DateIcon}
          label="Start Date"
          value={
            personalForm.startDate
              ? format(personalForm.startDate, 'MMMM d, yyyy.')
              : '-'
          }
        />
        <FieldRow
          icon={UserIcon}
          label="Line Manager"
          value={personalForm.lineManager}
        />
      </div>
    </div>
  );

  const renderPersonalEdit = () => (
    <div className={WHITE_CARD_CLASS}>
      <h3 className="text-base font-semibold text-gray-900">
        Personal Information
      </h3>
      <div className="mt-6 grid grid-cols-3 gap-[30px]">
        {/* Employee ID — read-only */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Employee ID
          </label>
          <Input
            value={personalForm.employeeId}
            disabled
            className={cn(EDIT_FIELD_CLASS, 'bg-gray-50')}
          />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Name</label>
          <Input
            placeholder="e.g. John Doe"
            value={personalForm.name}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, name: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="e.g. hammedadeyanju75@gmail.com"
            value={personalForm.email}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, email: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Phone</label>
          <Input
            placeholder="e.g +2349068114071"
            value={personalForm.phone}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, phone: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Gender</label>
          <Select
            value={personalForm.gender}
            onValueChange={(val) =>
              setPersonalForm((p) => ({ ...p, gender: val }))
            }
          >
            <SelectTrigger className={EDIT_FIELD_CLASS}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Date of Birth
          </label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  EDIT_FIELD_CLASS,
                  'w-full justify-start text-left font-normal',
                  !personalForm.dateOfBirth && 'text-muted-foreground'
                )}
              >
                {personalForm.dateOfBirth
                  ? format(personalForm.dateOfBirth, 'dd/MM/yyyy')
                  : 'Pick a date'}
                <DateIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalForm.dateOfBirth}
                onSelect={(date) => {
                  setPersonalForm((p) => ({ ...p, dateOfBirth: date }));
                  setDobOpen(false);
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Department
          </label>
          <Select
            value={personalForm.department}
            onValueChange={(val) =>
              setPersonalForm((p) => ({ ...p, department: val }))
            }
          >
            <SelectTrigger className={EDIT_FIELD_CLASS}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.length > 0 ? (
                departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resources">
                    Human Resources
                  </SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Employment Type
          </label>
          <Select
            value={personalForm.employmentType}
            onValueChange={(val) =>
              setPersonalForm((p) => ({ ...p, employmentType: val }))
            }
          >
            <SelectTrigger className={EDIT_FIELD_CLASS}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Job Title</label>
          <Input
            placeholder="e.g Senior Software Engineer"
            value={personalForm.jobTitle}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, jobTitle: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>

        {/* Home Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Home Address
          </label>
          <Input
            placeholder="e.g Lagos, Nigeria"
            value={personalForm.homeAddress}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, homeAddress: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Start Date
          </label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  EDIT_FIELD_CLASS,
                  'w-full justify-start text-left font-normal',
                  !personalForm.startDate && 'text-muted-foreground'
                )}
              >
                {personalForm.startDate
                  ? format(personalForm.startDate, 'dd/MM/yyyy')
                  : 'Pick a date'}
                <DateIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalForm.startDate}
                onSelect={(date) => {
                  setPersonalForm((p) => ({ ...p, startDate: date }));
                  setStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Line Manager */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">
            Line Manager
          </label>
          <Input
            placeholder="e.g. John Doe"
            value={personalForm.lineManager}
            onChange={(e) =>
              setPersonalForm((p) => ({ ...p, lineManager: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
      </div>
    </div>
  );

  // ── Payroll Tab ───────────────────────────────────────────────────────────
  const renderPayrollView = () => (
    <div className={WHITE_CARD_CLASS}>
      <h3 className="font-raleway text-base font-semibold text-gray-900">
        Bank & Payroll
      </h3>
      <div className="mt-6 grid grid-cols-3 gap-[30px]">
        <FieldRow
          icon={LandmarkIcon}
          label="Bank Name"
          value={payrollForm.bankName}
        />
        <FieldRow
          icon={UserIcon}
          label="Account Name"
          value={payrollForm.accountName}
        />
        <FieldRow
          icon={CreditCardIcon}
          label="Account Number"
          value={payrollForm.accountNumber}
        />

        {/* Monthly Salary with View Breakdown link */}
        <div className="space-y-1.5">
          <p className="font-raleway text-xs font-medium text-gray-400">
            Monthly Salary
          </p>
          <div className="font-raleway flex items-center gap-2 text-sm leading-6 text-gray-800">
            <BanknoteIcon className="size-4 shrink-0 text-gray-400" />
            <span>{payrollForm.salaryAmount || '—'}</span>
            <button
              onClick={() => setShowSalaryBreakdown(true)}
              className="flex items-center gap-0.5 text-xs font-medium text-[#6C2BD9] hover:underline"
            >
              View Breakdown
              <ArrowUpRightIcon className="size-3" />
            </button>
          </div>
        </div>

        <FieldRow
          icon={FileTextIcon}
          label="Tax ID"
          value={payrollForm.taxId}
        />
        <FieldRow icon={WalletIcon} label="BVN" value={payrollForm.bvn} />

        {/* Payroll Status */}
        <div className="space-y-1.5">
          <p className="font-raleway text-xs font-medium text-gray-400">
            Payroll Status
          </p>
          <span
            className={cn(
              'font-raleway inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              payrollForm.payrollStatus === 'Active'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {payrollForm.payrollStatus || '—'}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPayrollEdit = () => (
    <div className={WHITE_CARD_CLASS}>
      <h3 className="font-raleway text-base font-semibold text-gray-900">
        Bank & Payroll
      </h3>
      <div className="mt-6 grid grid-cols-3 gap-[30px]">
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Bank Name
          </label>
          <Input
            placeholder="e.g. First Bank Plc"
            value={payrollForm.bankName}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, bankName: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Account Name
          </label>
          <Input
            placeholder="e.g. Hammed Adeyanju"
            value={payrollForm.accountName}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, accountName: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Account Number
          </label>
          <Input
            placeholder="e.g .... .... .... 4589"
            value={payrollForm.accountNumber}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, accountNumber: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Salary Amount
          </label>
          <Input
            placeholder="e.g ₦15,000,000"
            value={payrollForm.salaryAmount}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, salaryAmount: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Tax ID
          </label>
          <Input
            placeholder="123-45-6789"
            value={payrollForm.taxId}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, taxId: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            BVN
          </label>
          <Input
            placeholder="123-45-6789"
            value={payrollForm.bvn}
            onChange={(e) =>
              setPayrollForm((p) => ({ ...p, bvn: e.target.value }))
            }
            className={EDIT_FIELD_CLASS}
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-raleway text-xs font-medium text-gray-700">
            Payroll Status
          </label>
          <Select
            value={payrollForm.payrollStatus}
            onValueChange={(val) =>
              setPayrollForm((p) => ({ ...p, payrollStatus: val }))
            }
          >
            <SelectTrigger className={EDIT_FIELD_CLASS}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // ── Documents Tab ─────────────────────────────────────────────────────────
  const renderDocuments = () => (
    <div className={WHITE_CARD_CLASS}>
      {/* Document Category — Add New + list */}
      <div className="mb-6 rounded-xl border border-[#254C00]/20 bg-white p-5">
        <button
          type="button"
          onClick={() => setShowAddCategoryForm((v) => !v)}
          className="font-raleway mb-4 flex items-center gap-2 text-sm font-semibold text-[#254C00] hover:opacity-90"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-[#254C00] text-white">
            <AddIcon className="size-3.5" />
          </span>
          + Add New
        </button>

        {showAddCategoryForm && (
          <div className="mb-4 space-y-3">
            <Input
              placeholder="Enter document category"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewCategoryInput('');
                  setShowAddCategoryForm(false);
                }}
                className="font-raleway rounded-lg border-[#254C00] px-4 py-2 text-sm font-medium text-[#254C00] hover:bg-[#254C00]/5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const name = newCategoryInput.trim();
                  if (!name) return;
                  if (documentCategories.includes(name)) {
                    toast.error('Category already exists');
                    return;
                  }
                  setDocumentCategories((prev) => [...prev, name]);
                  setDocCategory(name);
                  setNewCategoryInput('');
                  setShowAddCategoryForm(false);
                  toast.success('Category added');
                }}
                className="font-raleway rounded-lg bg-[#3300C9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5A23B8]"
              >
                Add
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="font-raleway mb-2 text-xs font-medium text-gray-500">
            Existing categories
          </p>
          {documentCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setDocCategory(cat)}
              className={cn(
                'font-raleway block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50',
                docCategory === cat && 'bg-[#3300C9]/10 text-[#3300C9]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-800">
          Upload Document
        </label>
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white py-10 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            if (!files.length) return;
            const newDocs = files.map((f) => ({
              id: `${Date.now()}-${Math.random()}`,
              name: f.name,
              category: docCategory || 'Personal',
            }));
            setUploadedDocs((prev) => [...prev, ...newDocs]);
            toast.success('Document(s) uploaded successfully');
          }}
        >
          <InboxIcon className="mb-3 size-12 text-[#254C00]" />
          <p className="text-sm font-medium text-gray-700">
            Click or drag file to this area to upload
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Support for a single or bulk upload.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Uploaded Documents */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-800">
          Uploaded Documents
        </h4>
        {uploadedDocs.length === 0 ? (
          <div className="rounded-lg border border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-400">No document yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-100">
                    <FileTextIcon className="size-4 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-400">{doc.category}</p>
                  </div>
                </div>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="size-3.5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() =>
                      setUploadedDocs((prev) =>
                        prev.filter((d) => d.id !== doc.id)
                      )
                    }
                  >
                    <DeleteIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="my-8 flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Loading employee details...</p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Tab nav — Raleway 600, 14px, 24px line-height */}
      <div className="mt-2.5 flex items-center gap-6 overflow-x-auto border-b-2 border-[#D9D9D9] pt-4">
        {TABS.map((tab) => (
          <span
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`font-raleway cursor-pointer pb-2.5 text-sm leading-6 font-semibold text-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary border-b-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="my-4 min-h-screen">
        {/* Back button — Raleway 600, 20px, 100% line-height */}
        <button
          onClick={() => navigate('/dashboard/hr/employee-directory')}
          className="font-raleway mb-4 flex items-center gap-2 text-[20px] leading-none font-semibold text-gray-900"
        >
          <ArrowLeftIcon className="size-5 shrink-0" />
          Employee Details
        </button>

        {/* Employee header card */}
        <div className="">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <Avatar className="size-[140px] shrink-0 ring-2 ring-purple-100">
              <AvatarImage
                src={employee?.avatarUrl || employee?.photo}
                alt={displayName}
              />
              <AvatarFallback className="bg-purple-100 text-lg font-semibold text-purple-700">
                {initials || 'EE'}
              </AvatarFallback>
            </Avatar>

            {/* Name & info */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#000000]">
                {displayName || '—'}
              </h2>
              <p className="mt-0.5 text-sm text-[14px] text-[#434343]">
                {displayJobTitle}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                {displayDept && (
                  <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-4 text-[#434343]" />
                    {displayDept}
                  </span>
                )}
                {displayDate && (
                  <span className="flex items-center gap-1.5">
                    <DateIcon className="size-4 shrink-0 text-[#434343]" />
                    {displayDate}
                  </span>
                )}
              </div>
            </div>

            {/* Status + Action */}
            <div className="flex flex-col items-end gap-3">
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  STATUS_STYLES[displayStatus]
                )}
              >
                {displayStatus}
              </span>
              {renderActionButton()}
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'personal' &&
          (isEditing ? renderPersonalEdit() : renderPersonalView())}
        {activeTab === 'payroll' &&
          (isEditing ? renderPayrollEdit() : renderPayrollView())}
        {activeTab === 'documents' && renderDocuments()}
      </div>

      {/* Salary Breakdown Modal (view) */}
      <SalaryBreakdownModal
        open={showSalaryBreakdown}
        onOpenChange={setShowSalaryBreakdown}
        onEditSalary={() => setShowEditSalaryBreakdown(true)}
      />

      {/* Edit Salary Breakdown Modal */}
      <Dialog
        open={showEditSalaryBreakdown}
        onOpenChange={setShowEditSalaryBreakdown}
      >
        <DialogContent
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8"
          overlayClassName="bg-[#0C0C0CE5]"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="font-raleway text-xl font-semibold">
              Edit Salary Breakdown
            </DialogTitle>
            <p className="font-raleway mt-1 text-sm text-gray-500">
              Configure earnings, deductions, and benefits that make up this
              offer.
            </p>
          </DialogHeader>
          <div className="mt-6">
            <h4 className="font-raleway text-sm font-semibold text-gray-800">
              Earnings
            </h4>
            <p className="font-raleway mt-0.5 text-xs text-gray-500">
              Compensation components listed in your payroll configuration.
            </p>
            <div className="mt-3 space-y-2 rounded-lg border border-gray-100 p-3">
              {['Basic Salary', 'Housing Allowance', 'Transport Allowance'].map(
                (label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <Input
                      placeholder="e.g N145,000"
                      className="h-9 w-32 rounded-md border text-sm"
                    />
                    <span className="font-raleway text-gray-500">{label}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditSalaryBreakdown(false)}
              className="font-raleway rounded-lg border-gray-300 px-5 text-sm"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowEditSalaryBreakdown(false);
                setShowSalaryUpdatedModal(true);
              }}
              className="font-raleway rounded-lg bg-[#3300C9] px-5 text-sm font-semibold text-white hover:bg-[#5A23B8]"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Salary Updated confirmation modal */}
      <SuccessModal
        open={showSalaryUpdatedModal}
        onOpenChange={setShowSalaryUpdatedModal}
        title="Salary Updated"
        subtitle="You've successfully Updated a Salary"
      />
    </>
  );
}
