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
import Customers from './dashboard/accounting/invoicing/customers/page';
import Payments from './dashboard/accounting/invoicing/payments/page';
import CreditNotes from './dashboard/accounting/invoicing/credit-notes/page';
import InvoiceSettings from './dashboard/accounting/invoicing/settings/page';
import LedgerView from './dashboard/accounting/bookkeeping/ledger-view/page';
import ChartOfAccounts from './dashboard/accounting/bookkeeping/chart-of-accounts/page';
import JournalEntries from './dashboard/accounting/bookkeeping/journals/page';
import TrialBalance from './dashboard/accounting/bookkeeping/trial-balance/page';
import AccountsReceivable from './dashboard/accounting/accounts-receivable/page';
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
                        path: 'ledger-view',
                        Component: LedgerView,
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
                    Component: () => <div>Financial Reports</div>,
                  },
                  {
                    path: 'accounts-receivable',
                    children: [
                      {
                        index: true,
                        Component: AccountsReceivable,
                      },
                      {
                        path: 'customers',
                        Component: CustomersAR,
                      },
                      {
                        path: 'payments',
                        Component: PaymentsAR,
                      },
                      {
                        path: 'customer-ledger',
                        Component: CustomerLedgerAR,
                      },
                      {
                        path: 'credit-notes',
                        Component: CreditNotesAR,
                      },
                      {
                        path: 'reports',
                        Component: () => <div>No design available yet</div>,
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
                    Component: () => <div>Budgeting & Forecasting</div>,
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
              { path: 'hr', Component: () => <div>HR Page</div> },
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
