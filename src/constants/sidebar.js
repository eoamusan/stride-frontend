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
    link: '/dashboard/accounting/overview',
  },
  {
    title: 'Bookkeeping & General Ledger',
    icon: BookOpen,
    link: '/dashboard/accounting/bookkeeping',
  },
  {
    title: 'Financial Reports',
    icon: FileText,
    link: '/dashboard/accounting/reports',
  },
  {
    title: 'Accounts Receivable (A/R)',
    icon: FileSpreadsheet,
    link: '/dashboard/accounting/accounts-receivable',
  },
  {
    title: 'Accounts Payable (A/P)',
    icon: CreditCard,
    link: '/dashboard/accounting/accounts-payable',
  },
  {
    title: 'Inventory Management',
    icon: Package,
    link: '/dashboard/accounting/inventory',
  },
  {
    title: 'Budgeting & Forecasting',
    icon: Target,
    link: '/dashboard/accounting/budgeting',
  },
  {
    title: 'Asset & Depreciation Management',
    icon: Building,
    link: '/dashboard/accounting/asset-depreciation',
  },
  {
    title: 'Sales & Income',
    icon: DollarSign,
    link: '/dashboard/accounting/sales-income',
  },
  {
    title: 'Tax Management',
    icon: FileText,
    link: '/dashboard/accounting/tax',
  },
  {
    title: 'Banking & Reconciliation',
    icon: Banknote,
    link: '/dashboard/accounting/banking-reconciliation',
  },
  {
    title: 'Remunerations',
    icon: Coins,
    link: '/dashboard/accounting/remunerations',
  },
  {
    title: 'Invoices & Receipts',
    icon: Receipt,
    link: '/dashboard/accounting/invoices-receipts',
  },
  {
    title: 'Multi-User Permissions',
    icon: UserCheck,
    link: '/dashboard/accounting/multi-user-permissions',
  },
  {
    title: 'Data Export & Audit Trail',
    icon: Download,
    link: '/dashboard/accounting/data-export-audit-trail',
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
