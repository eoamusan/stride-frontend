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
  ChartNoAxesColumn,
} from 'lucide-react';

const accountingItems = [
  {
    title: 'Account Overview',
    icon: LayoutGrid,
    link: '/dashboard/accounting/overview',
  },
  {
    title: 'Invoicing',
    icon: ChartNoAxesColumn,
    link: '/dashboard/accounting/invoicing',
  },
  {
    title: 'Expense Management',
    icon: FileText,
    link: '/dashboard/accounting/expense-management',
  },
  {
    title: 'Bookkeeping & General Ledger',
    icon: Package,
    link: '/dashboard/accounting/bookkeeping',
  },
  {
    title: 'Financial Reports',
    icon: CreditCard,
    link: '/dashboard/accounting/financial-reports',
  },
  {
    title: 'Accounts Receivable (A/R)',
    icon: FileSpreadsheet,
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

const invoicingItems = [
  {
    title: 'Invoice Management',
    link: '/dashboard/accounting/invoicing',
  },
  {
    title: 'Customers',
    link: '/dashboard/accounting/invoicing/customers',
  },
  {
    title: 'Payments',
    link: '/dashboard/accounting/invoicing/payments',
  },
  {
    title: 'Credit notes and returns',
    link: '/dashboard/accounting/invoicing/credit-notes',
  },
  {
    title: 'Settings',
    link: '/dashboard/accounting/invoicing/settings',
  },
];

const bookkeepingItems = [
  {
    title: 'Chart of Accounts',
    link: '/dashboard/accounting/bookkeeping',
  },
  {
    title: 'Ledger View',
    link: '/dashboard/accounting/bookkeeping/ledger-view',
  },
  {
    title: 'Journal Entries',
    link: '/dashboard/accounting/bookkeeping/journals',
  },
  {
    title: 'Trial Balance',
    link: '/dashboard/accounting/bookkeeping/trial-balance',
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

const accountingTopItems = {
  overview: accountingItems,
  invoicing: invoicingItems,
  expenseManagement: [],
  bookkeeping: bookkeepingItems,
  financialReports: [],
  accountsReceivable: [],
  accountsPayable: [],
  inventoryManagement: [],
  budgeting: [],
  fixedAssetManagement: [],
  taxManagement: [],
  bankingReconciliation: [],
};
export { sidebarItems, accountingTopItems };
