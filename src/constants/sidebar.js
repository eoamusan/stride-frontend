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
  TrendingUp,
  Building,
  Package,
  Target,
  Coins,
  Receipt,
  Banknote,
  CreditCard,
  FileSpreadsheet,
  UserCheck,
  Download,
} from 'lucide-react';

const accountingItems = [
  {
    title: 'Account Overview',
    icon: LayoutGrid,
    link: '/account/dashboard',
  },
  {
    title: 'Bookkeeping & General Ledger',
    icon: BookOpen,
    link: '/account/bookkeeping',
  },
  {
    title: 'Financial Reports',
    icon: FileText,
    link: '/account/reports',
  },
  {
    title: 'Accounts Receivable (A/R)',
    icon: FileSpreadsheet,
    link: '/account/accounts-receivable',
  },
  {
    title: 'Accounts Payable (A/P)',
    icon: CreditCard,
    link: '/account/accounts-payable',
  },
  {
    title: 'Inventory Management',
    icon: Package,
    link: '/account/inventory',
  },
  {
    title: 'Budgeting & Forecasting',
    icon: Target,
    link: '/account/budgeting',
  },
  {
    title: 'Asset & Depreciation Management',
    icon: Building,
    link: '/account/asset-depreciation',
  },
  {
    title: 'Sales & Income',
    icon: DollarSign,
    link: '/account/sales-income',
  },
  {
    title: 'Tax Management',
    icon: FileText,
    link: '/account/tax',
  },
  {
    title: 'Banking & Reconciliation',
    icon: Banknote,
    link: '/account/banking-reconciliation',
  },
  {
    title: 'Remunerations',
    icon: Coins,
    link: '/account/remunerations',
  },
  {
    title: 'Invoices & Receipts',
    icon: Receipt,
    link: '/account/invoices-receipts',
  },
  {
    title: 'Multi-User Permissions',
    icon: UserCheck,
    link: '/account/multi-user-permissions',
  },
  {
    title: 'Data Export & Audit Trail',
    icon: Download,
    link: '/account/data-export-audit-trail',
  },
];

const sidebarItems = [
  {
    title: 'Overview',
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
