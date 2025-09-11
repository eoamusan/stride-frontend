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
                        Component: Customers,
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
                    Component: () => <div>Expense Management</div>,
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
                        Component: () => <div>Vendor Invoices</div>,
                      },
                      {
                        path: 'payment-scheduling',
                        Component: () => <div>Payment Scheduling</div>,
                      },
                      {
                        path: 'approval-workflow',
                        Component: () => <div>Approval Workflow</div>,
                      },
                      {
                        path: 'reports',
                        Component: () => <div>Reports Page</div>,
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
