import {
  LayoutGrid,
  FolderOpen,
  CheckSquare,
  Users,
  FileText,
  BarChart3,
  Calculator,
  PartyPopper,
  UserCog,
  Heart,
  HelpCircle,
  DollarSign,
  BookOpen,
  Building,
  Package,
  Target,
  Coins,
  Banknote,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

const accountingItems = [
  {
    title: 'Account Overview',
    icon: LayoutGrid,
    link: '/dashboard/accounting/overview',
  },
  {
    title: 'Invoicing',
    icon: BookOpen,
    link: '/dashboard/accounting/invoicing',
  },
  {
    title: 'Expense Management',
    icon: FileText,
    link: '/dashboard/accounting/expense-management',
  },
  {
    title: 'Bookkeeping & General Ledger',
    icon: FileSpreadsheet,
    link: '/dashboard/accounting/bookkeeping',
  },
  {
    title: 'Financial Reports',
    icon: CreditCard,
    link: '/dashboard/accounting/financial-reports',
  },
  {
    title: 'Accounts Receivable (A/R)',
    icon: Package,
    link: '/dashboard/accounting/accounts-receivable',
  },
  {
    title: 'Accounts Payable (A/P)',
    icon: Target,
    link: '/dashboard/accounting/accounts-payable',
  },
  {
    title: 'Inventory Management',
    icon: Building,
    link: '/dashboard/accounting/inventory-management',
  },
  {
    title: 'Budgeting & Forecasting',
    icon: DollarSign,
    link: '/dashboard/accounting/budgeting',
  },
  {
    title: 'Fixed Asset Management',
    icon: FileText,
    link: '/dashboard/accounting/fixed-asset-management',
  },
  {
    title: 'Tax Management',
    icon: Banknote,
    link: '/dashboard/accounting/tax-management',
  },
  {
    title: 'Banking & Reconciliation',
    icon: Coins,
    link: '/dashboard/accounting/banking-reconciliation',
  },
];

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    link: '/dashboard',
    children: [],
  },
  {
    title: 'Projects',
    icon: FolderOpen,
    link: '/dashboard/projects',
    children: [],
  },
  {
    title: 'Tasks',
    icon: CheckSquare,
    link: '/dashboard/tasks',
    children: [],
  },
  {
    title: 'Contacts',
    icon: Users,
    link: '/dashboard/contacts',
    children: [],
  },
  {
    title: 'Invoicing',
    icon: FileText,
    link: '/dashboard/invoicing',
    children: [],
  },
  {
    title: 'Reports',
    icon: BarChart3,
    link: '/dashboard/reports',
    children: [],
  },
  {
    title: 'Accounting',
    icon: Calculator,
    link: '/dashboard/accounting',
    children: accountingItems,
  },
  {
    title: 'Celebrations',
    icon: PartyPopper,
    link: '/dashboard/celebrations',
    children: [],
  },
  {
    title: 'Team Management',
    icon: UserCog,
    link: '/dashboard/team-management',
    children: [],
  },
  {
    title: 'HR',
    icon: Heart,
    link: '/dashboard/hr',
    children: [],
  },
  {
    title: 'Help Center',
    icon: HelpCircle,
    link: '/dashboard/help-center',
    children: [],
  },
];

export { sidebarItems };
