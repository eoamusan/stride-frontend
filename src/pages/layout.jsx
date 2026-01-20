import { createBrowserRouter } from 'react-router';
import Landing from './landing/page';
import Login from './auth/login/page';
import Register from './auth/register/page';
import Onboarding from './dashboard/onboarding/page';
import ForgotPassword from './auth/forget-password/page';
import DashboardLayout from './dashboard/layout';
import Home from './dashboard/home/page';
import AccountingLayout from './dashboard/accounting/layout';
import AccountingOverview from './dashboard/accounting/overview/page';
import Invoicing from './dashboard/accounting/invoicing/page';
import CreateInvoicePage from './dashboard/accounting/invoicing/create/page';
import ViewInvoice from './dashboard/accounting/invoicing/[id]/page';
import EditInvoice from './dashboard/accounting/invoicing/[id]/edit/page';
import Customers from './dashboard/accounting/invoicing/customers/page';
import Payments from './dashboard/accounting/invoicing/payments/page';
import CreditNotes from './dashboard/accounting/invoicing/credit-notes/page';
import InvoiceSettings from './dashboard/accounting/invoicing/settings/page';
import LedgerView from './dashboard/accounting/bookkeeping/ledger-view/page';
import ChartOfAccounts from './dashboard/accounting/bookkeeping/chart-of-accounts/page';
import JournalEntries from './dashboard/accounting/bookkeeping/journals/page';
import TrialBalance from './dashboard/accounting/bookkeeping/trial-balance/page';
import AccountsReceivable from './dashboard/accounting/accounts-receivable/page';
import AccountsReceivableReport from './dashboard/accounting/accounts-receivable/report';
import CustomersAR from './dashboard/accounting/accounts-receivable/customers/page';
import PaymentsAR from './dashboard/accounting/accounts-receivable/payments/page';
import CustomerLedgerAR from './dashboard/accounting/accounts-receivable/customer-ledger/page';
import CreditNotesAR from './dashboard/accounting/accounts-receivable/credit-notes/page';
import VendorManagement from './dashboard/accounting/accounts-payable/page';
import InventoryManagement from './dashboard/accounting/inventory-management/page';
import StockAdjustment from './dashboard/accounting/inventory-management/stock-adjustment.jsx/page';
import InventoryMovement from './dashboard/accounting/inventory-management/movement/page';
import VendorDetails from './dashboard/accounting/accounts-payable/[vendor_id]/page';
import VendorInvoices from './dashboard/accounting/accounts-payable/vendor-invoices/page';
import PaymentScheduling from './dashboard/accounting/accounts-payable/payment-scheduling/page';
import Vendors from './dashboard/accounting/accounts-payable/vendors/page';
import Bids from './dashboard/accounting/accounts-payable/bids/page';
import ApprovalWorkflow from './dashboard/accounting/accounts-payable/approval-workflow/page';
import ReportsAP from './dashboard/accounting/accounts-payable/reports/page';
import Sales from './dashboard/accounting/inventory-management/sales/page';
import Suppliers from './dashboard/accounting/inventory-management/suppliers/page';
import ReportsInv from './dashboard/accounting/inventory-management/reports/page';
import UserRoles from './dashboard/accounting/inventory-management/user-roles/page';
import ExpenseManagement from './dashboard/accounting/expense-management/page';
import ExpenseTransactions from './dashboard/accounting/expense-management/transactions/page';
import VendorsExpenses from './dashboard/accounting/expense-management/vendors/page';
import Bills from './dashboard/accounting/expense-management/bills/page';
import { authMiddleware } from '@/middleware/auth-middleware';
import VendorExpenseDetails from './dashboard/accounting/expense-management/vendors/[id]/page';
import ViewCustomer from './dashboard/accounting/invoicing/customers/[id]/page';
import ViewCustomerAR from './dashboard/accounting/accounts-receivable/customers/[id]/page';
import ViewCustomerLedger from './dashboard/accounting/accounts-receivable/customer-ledger/[id]/page';
import ReportsAR from './dashboard/accounting/accounts-receivable/reports/page';
import LedgerReportPage from './dashboard/accounting/bookkeeping/ledger-view/report/page';
import AccountReportPage from './dashboard/accounting/bookkeeping/chart-of-accounts/report/page';
import FinancialReports from './dashboard/accounting/financial-reports/page';
import Budgeting from './dashboard/accounting/budgeting/page';
import BudgetingAnalytics from './dashboard/accounting/budgeting/reports/page';
import FixedAssetMgtOverview from './dashboard/accounting/fixed-asset-management/overview/page';
import FixedAssetMgtAssets from './dashboard/accounting/fixed-asset-management/assets/page';
import FixedAssetMgtCategories from './dashboard/accounting/fixed-asset-management/categories/page';
import FixedAssetMgtMaintenance from './dashboard/accounting/fixed-asset-management/maintenance/page';
import FixedAssetMgtAudits from './dashboard/accounting/fixed-asset-management/audits/page';
import FixedAssetMgtAssetAssignment from './dashboard/accounting/fixed-asset-management/assets-assignment/page';
import FixedAssetMgtAssetRetrieval from './dashboard/accounting/fixed-asset-management/assets-retrievals/page';
import FixedAssetMgtReport from './dashboard/accounting/fixed-asset-management/reports/page';

import HumanResourcesLayout from './dashboard/hr/layout';
import Overview from './dashboard/hr/overview/page';
import Recruitment from './dashboard/hr/recruitment/page';
import HROnboarding from './dashboard/hr/onboarding/page';
import EmployeeDirectory from './dashboard/hr/employee-directory/page';
import AttendanceAndLeave from './dashboard/hr/attendance-and-leave/page';
import Performance from './dashboard/hr/perfomance/page';
import Payroll from './dashboard/hr/payroll/page';
import LearningAndDevelopment from './dashboard/hr/learning-and-development/page';
import Engagement from './dashboard/hr/engagement/page';
import Analytics from './dashboard/hr/analytics/page';
import DisciplinaryAndExit from './dashboard/hr/disciplinary-and-exit/page';
import Setup from './dashboard/hr/setup/page';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        Component: Landing,
      },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'forgot-password', Component: ForgotPassword },
      {
        path: 'dashboard',
        middleware: [authMiddleware],
        children: [
          { path: 'onboarding', Component: Onboarding },
          {
            Component: DashboardLayout,
            children: [
              {
                index: true,
                Component: Home,
              },
              // Main dashboard routes
              { path: 'projects', Component: () => <div>Projects Page</div> },
              { path: 'tasks', Component: () => <div>Tasks Page</div> },
              { path: 'contacts', Component: () => <div>Contacts Page</div> },
              { path: 'reports', Component: () => <div>Reports Page</div> },
              {
                path: 'accounting',
                Component: AccountingLayout,
                children: [
                  {
                    path: 'overview',
                    Component: AccountingOverview,
                  },
                  {
                    path: 'invoicing',
                    children: [
                      {
                        index: true,
                        Component: Invoicing,
                      },
                      {
                        path: 'create',
                        Component: CreateInvoicePage,
                      },
                      {
                        path: ':id',
                        children: [
                          {
                            index: true,
                            Component: ViewInvoice,
                          },
                          {
                            path: 'edit',
                            Component: EditInvoice,
                          },
                        ],
                      },
                      {
                        path: 'customers',
                        children: [
                          {
                            index: true,
                            Component: Customers,
                          },
                          {
                            path: ':id',
                            Component: ViewCustomer,
                          },
                        ],
                      },
                      {
                        path: 'payments',
                        Component: Payments,
                      },
                      {
                        path: 'credit-notes',
                        Component: CreditNotes,
                      },
                      {
                        path: 'settings',
                        Component: InvoiceSettings,
                      },
                    ],
                  },
                  {
                    path: 'expense-management',
                    children: [
                      {
                        index: true,
                        Component: ExpenseManagement,
                      },
                      {
                        path: 'transactions',
                        Component: ExpenseTransactions,
                      },
                      {
                        path: 'vendors',
                        children: [
                          {
                            index: true,
                            Component: VendorsExpenses,
                          },
                          {
                            path: ':id',
                            Component: VendorExpenseDetails,
                          },
                        ],
                      },
                      {
                        path: 'bills',
                        Component: Bills,
                      },
                    ],
                  },
                  {
                    path: 'bookkeeping',
                    children: [
                      {
                        index: true,
                        Component: ChartOfAccounts,
                      },
                      {
                        path: 'report',
                        Component: AccountReportPage,
                      },
                      {
                        path: 'ledger-view',
                        children: [
                          {
                            index: true,
                            Component: LedgerView,
                          },
                          {
                            path: 'report',
                            Component: LedgerReportPage,
                          },
                        ],
                      },
                      {
                        path: 'journals',
                        Component: JournalEntries,
                      },
                      {
                        path: 'trial-balance',
                        Component: TrialBalance,
                      },
                    ],
                  },
                  {
                    path: 'financial-reports',
                    Component: FinancialReports,
                  },
                  {
                    path: 'accounts-receivable',
                    children: [
                      {
                        index: true,
                        Component: AccountsReceivable,
                      },
                      {
                        path: 'report',
                        Component: AccountsReceivableReport,
                      },
                      {
                        path: 'customers',
                        children: [
                          {
                            index: true,
                            Component: CustomersAR,
                          },
                          {
                            path: ':id',
                            Component: ViewCustomerAR,
                          },
                        ],
                      },
                      {
                        path: 'payments',
                        Component: PaymentsAR,
                      },
                      {
                        path: 'customer-ledger',
                        children: [
                          {
                            index: true,
                            Component: CustomerLedgerAR,
                          },
                          {
                            path: ':id',
                            Component: ViewCustomerLedger,
                          },
                        ],
                      },
                      {
                        path: 'credit-notes',
                        Component: CreditNotesAR,
                      },
                      {
                        path: 'reports',
                        Component: ReportsAR,
                      },
                    ],
                  },
                  {
                    path: 'accounts-payable',
                    children: [
                      {
                        index: true,
                        Component: VendorManagement,
                      },
                      {
                        path: 'vendor-invoices',
                        Component: VendorInvoices,
                      },
                      {
                        path: 'vendors',
                        children: [
                          {
                            index: true,
                            Component: Vendors,
                          },
                          {
                            path: ':id',
                            Component: VendorDetails,
                          },
                        ],
                      },
                      {
                        path: 'bids',
                        Component: Bids,
                      },
                      {
                        path: 'payment-scheduling',
                        Component: PaymentScheduling,
                      },
                      {
                        path: 'approval-workflow',
                        Component: ApprovalWorkflow,
                      },
                      {
                        path: 'reports',
                        Component: ReportsAP,
                      },
                    ],
                  },
                  {
                    path: 'inventory',
                    children: [
                      {
                        index: true,
                        Component: InventoryManagement,
                      },
                      {
                        path: 'stock-adjustment',
                        Component: StockAdjustment,
                      },
                      {
                        path: 'movement',
                        Component: InventoryMovement,
                      },
                      {
                        path: 'sales',
                        Component: Sales,
                      },
                      {
                        path: 'suppliers',
                        Component: Suppliers,
                      },
                      {
                        path: 'reports',
                        Component: ReportsInv,
                      },
                      {
                        path: 'user-roles',
                        Component: UserRoles,
                      },
                    ],
                  },
                  {
                    path: 'budgeting',
                    children: [
                      {
                        index: true,
                        Component: Budgeting,
                      },
                      {
                        path: 'reports',
                        Component: BudgetingAnalytics,
                      },
                      {
                        path: 'forecasting',
                        Component: ExpenseTransactions,
                      },
                    ],
                  },
                  {
                    path: 'fixed-asset-management',
                    children: [
                      {
                        index: true,
                        Component: FixedAssetMgtOverview,
                      },
                      {
                        path: 'assets',
                        Component: FixedAssetMgtAssets,
                      },
                      {
                        path: 'categories',
                        Component: FixedAssetMgtCategories,
                      },
                      {
                        path: 'maintenance',
                        Component: FixedAssetMgtMaintenance,
                      },
                      {
                        path: 'audits',
                        Component: FixedAssetMgtAudits,
                      },
                      {
                        path: 'assets-assignment',
                        Component: FixedAssetMgtAssetAssignment,
                      },
                      {
                        path: 'assets-retrievals',
                        Component: FixedAssetMgtAssetRetrieval,
                      },
                      {
                        path: 'reports',
                        Component: FixedAssetMgtReport,
                      }
                    ],
                  },
                  {
                    path: 'asset-depreciation',
                    Component: () => <div>Asset & Depreciation Management</div>,
                  },
                  {
                    path: 'sales-income',
                    Component: () => <div>Sales & Income</div>,
                  },
                  { path: 'tax', Component: () => <div>Tax Management</div> },
                  {
                    path: 'banking-reconciliation',
                    Component: () => <div>Banking & Reconciliation</div>,
                  },
                  {
                    path: 'remunerations',
                    Component: () => <div>Remunerations</div>,
                  },
                  {
                    path: 'invoices-receipts',
                    Component: () => <div>Invoices & Receipts</div>,
                  },
                  {
                    path: 'multi-user-permissions',
                    Component: () => <div>Multi-User Permissions</div>,
                  },
                  {
                    path: 'data-export-audit-trail',
                    Component: () => <div>Data Export & Audit Trail</div>,
                  },
                ],
              },
              {
                path: 'celebrations',
                Component: () => <div>Celebrations Page</div>,
              },
              {
                path: 'team-management',
                Component: () => <div>Team Management Page</div>,
              },
              {
                path: 'hr',
                Component: HumanResourcesLayout,
                children: [
                  {
                    path: 'overview',
                    Component: Overview,
                  },
                  {
                    path: 'recruitment',
                    Component: Recruitment,
                  },
                  {
                    path: 'onboarding',
                    Component: HROnboarding,
                  },
                  {
                    path: 'employee-directory',
                    Component: EmployeeDirectory,
                  },
                  {
                    path: 'attendance-leave',
                    Component: AttendanceAndLeave,
                  },
                  {
                    path: 'performance',
                    Component: Performance,
                  },
                  {
                    path: 'payroll',
                    Component: Payroll,
                  },
                  {
                    path: 'learning-and-development',
                    Component: LearningAndDevelopment,
                  },
                  {
                    path: 'engagement',
                    Component: Engagement,
                  },
                  {
                    path: 'analytics',
                    Component: Analytics,
                  },
                  {
                    path: 'disciplinary-and-exit',
                    Component: DisciplinaryAndExit,
                  },
                  {
                    path: 'setup',
                    Component: Setup,
                  },
                ],
              },
              {
                path: 'help-center',
                Component: () => <div>Help Center Page</div>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export { router };
