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
                    ],
                  },
                  {
                    path: 'reports',
                    Component: () => <div>Financial Reports</div>,
                  },
                  {
                    path: 'accounts-receivable',
                    Component: () => <div>Accounts Receivable (A/R)</div>,
                  },
                  {
                    path: 'accounts-payable',
                    Component: () => <div>Accounts Payable (A/P)</div>,
                  },
                  {
                    path: 'inventory',
                    Component: () => <div>Inventory Management</div>,
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
