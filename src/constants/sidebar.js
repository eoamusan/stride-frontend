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
  UserPen,
  Handshake,
  ChartLine,
  Settings,
  TriangleAlert,
  BriefcaseBusiness,
  Lightbulb,
  CalendarDays,
  SquareActivity,
  Landmark,
  Workflow,
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
    link: '/dashboard/accounting/inventory',
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

const accountsReceivableItems = [
  {
    title: 'Accounts Receivable (A/R)',
    link: '/dashboard/accounting/accounts-receivable',
  },
  {
    title: 'Customers',
    link: '/dashboard/accounting/accounts-receivable/customers',
  },
  {
    title: 'Payments',
    link: '/dashboard/accounting/accounts-receivable/payments',
  },
  {
    title: 'Customer Ledger',
    link: '/dashboard/accounting/accounts-receivable/customer-ledger',
  },
  {
    title: 'Credit notes and returns',
    link: '/dashboard/accounting/accounts-receivable/credit-notes',
  },
  {
    title: 'Reports',
    link: '/dashboard/accounting/accounts-receivable/reports',
  },
];

const accountsPayableItems = [
  {
    title: 'Vendor Management',
    link: '/dashboard/accounting/accounts-payable',
  },
  {
    title: 'Vendor Invoices',
    link: '/dashboard/accounting/accounts-payable/vendor-invoices',
  },
  {
    title: 'Vendors',
    link: '/dashboard/accounting/accounts-payable/vendors',
  },
  {
    title: 'Bids',
    link: '/dashboard/accounting/accounts-payable/bids',
  },
  {
    title: 'Payment Scheduling',
    link: '/dashboard/accounting/accounts-payable/payment-scheduling',
  },
  {
    title: 'Approval Workflow',
    link: '/dashboard/accounting/accounts-payable/approval-workflow',
  },
  {
    title: 'Reports',
    link: '/dashboard/accounting/accounts-payable/reports',
  },
];

const inventoryManagementItems = [
  {
    title: 'Product Catalog',
    link: '/dashboard/accounting/inventory',
  },
  {
    title: 'Stock Adjustment',
    link: '/dashboard/accounting/inventory/stock-adjustment',
  },
  {
    title: 'Inventory Movement',
    link: '/dashboard/accounting/inventory/movement',
  },
  {
    title: 'Sales',
    link: '/dashboard/accounting/inventory/sales',
  },
  {
    title: 'Suppliers',
    link: '/dashboard/accounting/inventory/suppliers',
  },
  {
    title: 'Reports',
    link: '/dashboard/accounting/inventory/reports',
  },
  {
    title: 'User Roles & Alerts',
    link: '/dashboard/accounting/inventory/user-roles',
  },
];

const expenseManagementItems = [
  {
    title: 'Overview',
    link: '/dashboard/accounting/expense-management',
  },
  {
    title: 'Expenses Transactions',
    link: '/dashboard/accounting/expense-management/transactions',
  },
  {
    title: 'Vendors',
    link: '/dashboard/accounting/expense-management/vendors',
  },
  {
    title: 'Bills',
    link: '/dashboard/accounting/expense-management/bills',
  },
];

const budgetingAndForcastingItems = [
  {
    title: 'Budget Overview',
    link: '/dashboard/accounting/budgeting',
  },
  {
    title: 'Analytics & Reports',
    link: '/dashboard/accounting/budgeting/reports',
  },
  {
    title: 'Forecasting',
    link: '/dashboard/accounting/budgeting/forecasting',
  },
];

const hrItems = [
  {
    title: 'HR Overview',
    icon: LayoutGrid,
    link: '/dashboard/hr/overview',
  },
  {
    title: 'Recruitment',
    icon: UserPen,
    link: '/dashboard/hr/recruitment',
  },
  {
    title: 'Onboarding',
    icon: Handshake,
    link: '/dashboard/hr/onboarding',
  },
  {
    title: 'Employee Directory',
    icon: Workflow,
    link: '/dashboard/hr/employee-directory',
  },
  {
    title: 'Attendance & Leave',
    icon: CalendarDays,
    link: '/dashboard/hr/attendance-leave',
  },
  {
    title: 'Performance',
    icon: SquareActivity,
    link: '/dashboard/hr/performance',
  },
  {
    title: 'Payroll',
    icon: Landmark,
    link: '/dashboard/hr/payroll',
  },
  {
    title: 'Learning & Development',
    icon: Lightbulb,
    link: '/dashboard/hr/learning-and-development',
  },
  {
    title: 'Engagement',
    icon: BriefcaseBusiness,
    link: '/dashboard/hr/engagement',
  },
  {
    title: 'Analytics',
    icon: ChartLine,
    link: '/dashboard/hr/analytics',
  },
  {
    title: 'Disciplinary & Exit',
    icon: TriangleAlert,
    link: '/dashboard/hr/disciplinary-and-exit',
  },
  {
    title: 'Setup',
    icon: Settings,
    link: '/dashboard/hr/setup',
  },
];

const fixedAssetManagementItems = [
  {
    title: 'Overview',
    link: '/dashboard/accounting/fixed-asset-management',
  },
  {
    title: 'Assets',
    link: '/dashboard/accounting/fixed-asset-management/assets',
  },
  {
    title: 'Categories',
    link: '/dashboard/accounting/fixed-asset-management/categories',
  },
  {
    title: 'Maintenance',
    link: '/dashboard/accounting/fixed-asset-management/maintenance',
  },
  {
    title: 'Audits',
    link: '/dashboard/accounting/fixed-asset-management/audits',
  },
  {
    title: 'Assets Assignment',
    link: '/dashboard/accounting/fixed-asset-management/assets-assignment',
  },
  {
    title: 'Assets Retrieval',
    link: '/dashboard/accounting/fixed-asset-management/assets-retrievals',
  },
  {
    title: 'Reports',
    link: '/dashboard/accounting/fixed-asset-management/reports',
  },
];

const taxManagementItems = [
  {
    title: 'Overview',
    link: '/dashboard/accounting/tax-management',
  },
  {
    title: 'Sales Tax',
    link: '/dashboard/accounting/tax-management/sales-tax',
  },
  {
    title: 'Business Tax',
    link: '/dashboard/accounting/tax-management/business-tax',
  },
];

const bankingAndReconciliationItems = [
  {
    title: 'Overview',
    link: '/dashboard/accounting/banking-reconciliation',
  },
  {
    title: 'Transaction Matching',
    link: '/dashboard/accounting/banking-reconciliation/transaction-matching',
  },
  {
    title: 'Reconciliation',
    link: '/dashboard/accounting/banking-reconciliation/reconciliation',
  },
  {
    title: 'Audit Trail',
    link: '/dashboard/accounting/banking-reconciliation/audit-trail',
  },
];
const recruitmentItems = [
  {
    title: 'Job Requisitions',
    link: '/dashboard/hr/recruitment',
  },
  {
    title: 'Job Posting',
    link: '/dashboard/hr/recruitment/job-postings',
  },
  {
    title: 'Applicant Screening',
    link: '/dashboard/hr/recruitment/applicant-screening',
  },
  {
    title: 'Interview & Schedules',
    link: '/dashboard/hr/recruitment/interview-schedules',
  },
  {
    title: 'Offer Stage',
    link: '/dashboard/hr/recruitment/offer-stage',
  },
];

const onboardingItems = [
  {
    title: 'Onboarding Overview',
    link: '/dashboard/hr/onboarding',
  },
  {
    title: 'Hr Validation',
    link: '/dashboard/hr/onboarding/hr-validation',
  },
  {
    title: 'Asset Management',
    link: '/dashboard/hr/onboarding/asset-management',
  },
];

const employeeDirectoryItems = [
  {
    title: 'Employee Directory',
    link: '/dashboard/hr/employee-directory',
  },
  {
    title: 'HR Service Desk',
    link: '/dashboard/hr/employee-directory/hr-service-desk',
  },
];

const attendanceLeaveItems = [
  {
    title: 'Attendance',
    link: '/dashboard/hr/attendance-leave',
  },
  {
    title: 'Leave',
    link: '/dashboard/hr/attendance-leave/leave',
  },
];
const performanceItems = [
  {
    title: 'Performance',
    link: '/dashboard/hr/performance',
  },
  {
    title: 'KPI & OKR Setup',
    link: '/dashboard/hr/performance/kpi-okr-setup',
  },
  {
    title: 'Review Release',
    link: '/dashboard/hr/performance/review-release',
  },
  {
    title: 'Review Templates',
    link: '/dashboard/hr/performance/review-templates',
  },
  {
    title: 'Score Cards',
    link: '/dashboard/hr/performance/score-cards',
  },
];

const payrollItems = [
  {
    title: 'Payroll',
    link: '/dashboard/hr/payroll',
  },
  {
    title: 'Run Payroll',
    link: '/dashboard/hr/payroll/run-payroll',
  },
  {
    title: 'Review',
    link: '/dashboard/hr/payroll/review',
  },
  {
    title: 'Payslips',
    link: '/dashboard/hr/payroll/payslips',
  },
  {
    title: 'Compliance',
    link: '/dashboard/hr/payroll/compliance',
  },
];

const learningAndDevelopmentItems = [
  {
    title: 'Course Catalogs',
    link: '/dashboard/hr/learning-and-development',
  },
  {
    title: 'Training Assignments',
    link: '/dashboard/hr/learning-and-development/training-assignments',
  },
  {
    title: 'Training Approvals',
    link: '/dashboard/hr/learning-and-development/training-approvals',
  },
  {
    title: 'Completion Tracking',
    link: '/dashboard/hr/learning-and-development/completion-tracking',
  },
  {
    title: 'Certificates',
    link: '/dashboard/hr/learning-and-development/certificates',
  },
];

const engagementItems = [
  {
    title: 'Celebration Hub',
    link: '/dashboard/hr/engagement',
  },
  {
    title: 'Suggestions Box',
    link: '/dashboard/hr/engagement/suggestions-box',
  },
  {
    title: 'Recognition Wall',
    link: '/dashboard/hr/engagement/recognition-wall',
  },
];

const analyticsItems = [
  {
    title: 'Analytics',
    link: '/dashboard/hr/analytics',
  },
  {
    title: 'Head Count',
    link: '/dashboard/hr/analytics/headcount',
  },
  { title: 'Attrition', link: '/dashboard/hr/analytics/attrition' },
  { title: 'Diversity', link: '/dashboard/hr/analytics/diversity' },
];

const disciplinaryAndExitItems = [
  {
    title: 'Disciplinary',
    link: '/dashboard/hr/disciplinary-and-exit',
  },
  { title: 'Exit Request', link: '/dashboard/hr/disciplinary-and-exit/exit' },
];

const setupItems = [
  { title: 'Company Profile', link: '/dashboard/hr/setup' },
  {
    title: 'Organizational Structure',
    link: '/dashboard/hr/setup/organization-structure',
  },
  { title: 'RBAC', link: '/dashboard/hr/setup/RBAC' },
  {
    title: 'Salary Framework',
    link: '/dashboard/hr/setup/salary-framework',
  },
  {
    title: 'Global Setting',
    link: '/dashboard/hr/setup/global-settings',
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
    children: hrItems,
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
  expenseManagement: expenseManagementItems,
  budgeting: budgetingAndForcastingItems,
  bookkeeping: bookkeepingItems,
  financialReports: [],
  accountsReceivable: accountsReceivableItems,
  accountsPayable: accountsPayableItems,
  inventoryManagement: inventoryManagementItems,
  fixedAssetManagement: fixedAssetManagementItems,
  taxManagement: taxManagementItems,
  bankingReconciliation: bankingAndReconciliationItems,
};

const hrTopItems = {
  overview: hrItems,
  recruitment: recruitmentItems,
  onboarding: onboardingItems,
  employeeDirectory: employeeDirectoryItems,
  attendanceLeave: attendanceLeaveItems,
  performance: performanceItems,
  payroll: payrollItems,
  learningAndDevelopement: learningAndDevelopmentItems,
  engagement: engagementItems,
  analytics: analyticsItems,
  disciplinaryAndExit: disciplinaryAndExitItems,
  setup: setupItems,
};

export { sidebarItems, accountingTopItems, hrTopItems };
