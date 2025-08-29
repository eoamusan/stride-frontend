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
