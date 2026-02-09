import receiptIcon from '@/assets/icons/receipt-text.svg';
import dollarIcon from '@/assets/icons/dollar-square.svg';
import profileIcon from '@/assets/icons/profile-2user.svg';
import moneyIcon from '@/assets/icons/money-send.svg';
import chartIcon from '@/assets/icons/chart-square.svg';
import addIcon from '@/assets/icons/add.svg';

export const quickActions = [
  {
    title: 'New Invoice',
    description: 'Create customers invoice',
    icon: receiptIcon,
    href: '#',
  },
  {
    title: 'Record Expense',
    description: 'Add business expense',
    icon: dollarIcon,
    href: '#',
  },
  {
    title: 'Add Customer',
    description: 'Add new customer',
    icon: profileIcon,
    href: '#',
  },
  {
    title: 'Bank Transfer',
    description: 'Transfer between accounts',
    icon: moneyIcon,
    href: '#',
  },

  {
    title: 'Journal Entry',
    description: 'Manual accounting entry',
    icon: chartIcon,
    href: '#',
  },
  {
    title: 'New Product',
    description: 'Add inventory item',
    icon: addIcon,
    href: '#',
  },
];

export const HRQuickActions = [
  {
    title: 'Add Employee',
    description: 'Onboard new employee',
    icon: profileIcon,
    href: '/dashboard/hr/onboarding',
  },
  {
    title: 'Create MRF',
    description: 'Create new MRF form',
    icon: addIcon,
    href: '#',
  },
  {
    title: 'Post new Job',
    description: 'Post a new job opening',
    icon: addIcon,
    href: '/dashboard/hr/recruitment/job-postings',
  },
  {
    title: 'Approve Requests',
    description: 'Review leave requests',
    icon: receiptIcon,
    href: '/dashboard/hr/attendance-leave',
  },
  {
    title: 'Run Payroll',
    description: 'Edit and review payroll',
    icon: dollarIcon,
    href: '/dashboard/hr/payroll',
  },
];
