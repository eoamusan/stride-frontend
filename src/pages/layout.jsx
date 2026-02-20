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
import TaxOverview from './dashboard/accounting/tax-management/overview/page';
import BusinessTax from './dashboard/accounting/tax-management/business-tax/page';
import SalesTax from './dashboard/accounting/tax-management/sales-tax/page';
import BankingOverview from './dashboard/accounting/banking/overview/page';
import TransactionMatching from './dashboard/accounting/banking/transaction-matching/page';
import BankingReconciliation from './dashboard/accounting/banking/reconciliation/page';
import AuditTrail from './dashboard/accounting/banking/audit-trail/page';

// Hr imports start here
import HumanResourcesLayout from './dashboard/hr/layout';
import Overview from './dashboard/hr/overview/page';
import HrValidation from './dashboard/hr/onboarding/hr-validation/page';
import EmployeeDirectory from './dashboard/hr/employee-directory/page';
import Payroll from './dashboard/hr/payroll/page';
import LearningAndDevelopment from './dashboard/hr/learning-development/page';
import Engagement from './dashboard/hr/engagement/page';
import Analytics from './dashboard/hr/analytics/page';
import Setup from './dashboard/hr/setup/page';
import ProfilePage from './dashboard/profile/page';
import SettingsPage from './dashboard/settings/page';

import Recruitment from './dashboard/hr/recruitment/page';
import JobPosting from './dashboard/hr/recruitment/job-posting/page';
import ApplicantScreening from './dashboard/hr/recruitment/applicant-screening/page';
import InterviewAndSchedules from './dashboard/hr/recruitment/interview-schedules/page';
import OfferStage from './dashboard/hr/recruitment/offer-stage/page';

import HROnboarding from './dashboard/hr/onboarding/page';
import AssetManagement from './dashboard/hr/onboarding/asset-management/page';
import HRServiceDesk from './dashboard/hr/employee-directory/hr-service-desk/page';
import EmployeeDetail from './dashboard/hr/employee-directory/employees/page';
import Attendance from './dashboard/hr/attendance-leave/page';
import AttendanceDetails from './dashboard/hr/attendance-leave/[id]/page';
import Leave from './dashboard/hr/attendance-leave/Leave/page';

import CycleSetup from './dashboard/hr/perfomance/page';
import KPI_OKR_Setup from './dashboard/hr/perfomance/KPI-OKR-setup/page';
import ReviewTemplates from './dashboard/hr/perfomance/review-templates/page';
import ReviewRelease from './dashboard/hr/perfomance/review-release/page';
import ScoreCards from './dashboard/hr/perfomance/score-cards/page';

import RunPayroll from './dashboard/hr/payroll/run-payroll/page';
import Review from './dashboard/hr/payroll/review/page';
import Payslips from './dashboard/hr/payroll/payslips/page';
import Compliance from './dashboard/hr/payroll/compliance/page';

import TrainingAssignments from './dashboard/hr/learning-development/training-assignments/page';
import TrainingApproval from './dashboard/hr/learning-development/training-approvals/page';
import Certificates from './dashboard/hr/learning-development/certificates/page';
import CompletionTracking from './dashboard/hr/learning-development/completion-tracking/page';

import SuggestionsBox from './dashboard/hr/engagement/suggestions-box/page';
import RecognitionWall from './dashboard/hr/engagement/recognition-wall/page';

import HeadCount from './dashboard/hr/analytics/headcount/page';
import Attribution from './dashboard/hr/analytics/attrition/page';
import Diversity from './dashboard/hr/analytics/diversity/page';

import Disciplinary from './dashboard/hr/disciplinary/page';
import ExitRequest from './dashboard/hr/disciplinary/exit/page';

import OrganizationStructure from './dashboard/hr/setup/organization-structure/page';
import RBAC from './dashboard/hr/setup/RBAC/page';
import SalaryFramework from './dashboard/hr/setup/salary-framework/page';
import GlobalSetting from './dashboard/hr/setup/global-setting/page';
import RecruitmentDetails from './dashboard/hr/recruitment/[id]/page';
import CreateBudget from './dashboard/accounting/budgeting/[id]/page';
import JobDetails from './dashboard/hr/recruitment/job-posting/[id]/page';
import ApplicantDetails from './dashboard/hr/recruitment/applicant-screening/[applicantID]/page';
import InterviewScheduleDetails from './dashboard/hr/recruitment/interview-schedules/[id]/page';
import HrValidationDetails from './dashboard/hr/onboarding/hr-validation/[id]/page';
// Hr imports ends here

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
              { path: 'profile', Component: ProfilePage },
              { path: 'settings', Component: SettingsPage },
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
                        path: ':id',
                        Component: CreateBudget
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
                      },
                    ],
                  },
                  {
                    path: 'tax-management',
                    children: [
                      {
                        index: true,
                        Component: TaxOverview,
                      },
                      {
                        path: 'sales-tax',
                        Component: SalesTax,
                      },
                      {
                        path: 'business-tax',
                        Component: BusinessTax,
                      },
                    ],
                  },
                  {
                    path: 'banking-reconciliation',
                    children: [
                      {
                        index: true,
                        Component: BankingOverview,
                      },
                      {
                        path: 'transaction-matching',
                        Component: TransactionMatching,
                      },
                      {
                        path: 'reconciliation',
                        Component: BankingReconciliation,
                      },
                      {
                        path: 'audit-trail',
                        Component: AuditTrail,
                      },
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
                    children: [
                      { index: true, Component: Recruitment },
                      {
                        path: 'detail/:id',
                        Component: RecruitmentDetails,
                      },
                      {
                        path: 'job-postings',
                        children: [
                          {
                            index: true,
                            Component: JobPosting,
                          },
                          {
                            path: 'detail/:id',
                            Component: JobDetails,
                          },
                        ],
                      },
                      {
                        path: 'applicant-screening',
                        children: [
                          {
                            index: true,
                            Component: ApplicantScreening,
                          },
                          {
                            path: 'applicant/:applicantID',
                            Component: ApplicantDetails,
                          },
                        ],
                      },
                      {
                        path: 'interview-schedules',
                        children: [
                          {
                            index: true,
                            Component: InterviewAndSchedules,
                          },
                          {
                            path: 'detail/:id',
                            Component: InterviewScheduleDetails,
                          },
                        ],
                      },
                      {
                        path: 'offer-stage',
                        Component: OfferStage,
                      },
                    ],
                  },
                  {
                    path: 'onboarding',
                    children: [
                      { index: true, Component: HROnboarding },
                      {
                        path: 'hr-validation',
                        children: [
                          { index: true, Component: HrValidation },
                          {
                            path: 'detail/:id',
                            Component: HrValidationDetails,
                          },
                        ],
                      },
                      {
                        path: 'asset-management',
                        Component: AssetManagement,
                      },
                    ],
                  },
                  {
                    path: 'employee-directory',
                    children: [
                      { index: true, Component: EmployeeDirectory },
                      {
                        path: 'hr-service-desk',
                        Component: HRServiceDesk,
                      },
                      {
                        path: 'employees/:id',
                        Component: EmployeeDetail,
                      },
                    ],
                  },
                  {
                    path: 'attendance-leave',
                    children: [
                      { index: true, Component: Attendance },
                      { path: ':id', Component: AttendanceDetails },
                      { path: 'leave', Component: Leave },
                    ],
                  },
                  {
                    path: 'performance',
                    children: [
                      {
                        index: true,
                        Component: CycleSetup,
                      },
                      {
                        path: 'kpi-okr-setup',
                        Component: KPI_OKR_Setup,
                      },
                      {
                        path: 'review-templates',
                        Component: ReviewTemplates,
                      },
                      {
                        path: 'review-release',
                        Component: ReviewRelease,
                      },
                      {
                        path: 'score-cards',
                        Component: ScoreCards,
                      },
                    ],
                  },
                  {
                    path: 'payroll',
                    children: [
                      {
                        index: true,
                        Component: Payroll,
                      },
                      {
                        path: 'run-payroll',
                        Component: RunPayroll,
                      },
                      {
                        path: 'review',
                        Component: Review,
                      },
                      {
                        path: 'payslips',
                        Component: Payslips,
                      },
                      {
                        path: 'compliance',
                        Component: Compliance,
                      },
                    ],
                  },
                  {
                    path: 'learning-and-development',
                    children: [
                      {
                        index: true,
                        Component: LearningAndDevelopment,
                      },
                      {
                        path: 'training-assignments',
                        Component: TrainingAssignments,
                      },
                      {
                        path: 'training-approvals',
                        Component: TrainingApproval,
                      },
                      {
                        path: 'completion-tracking',
                        Component: CompletionTracking,
                      },
                      {
                        path: 'certificates',
                        Component: Certificates,
                      },
                    ],
                  },
                  {
                    path: 'engagement',
                    children: [
                      { index: true, Component: Engagement },
                      {
                        path: 'suggestions-box',
                        Component: SuggestionsBox,
                      },
                      {
                        path: 'recognition-wall',
                        Component: RecognitionWall,
                      },
                    ],
                  },
                  {
                    path: 'analytics',
                    children: [
                      { index: true, Component: Analytics },
                      {
                        path: 'headcount',
                        Component: HeadCount,
                      },
                      {
                        path: 'attrition',
                        Component: Attribution,
                      },
                      {
                        path: 'diversity',
                        Component: Diversity,
                      },
                    ],
                  },
                  {
                    path: 'disciplinary-and-exit',
                    children: [
                      {
                        index: true,
                        Component: Disciplinary,
                      },
                      {
                        path: 'exit',
                        Component: ExitRequest,
                      },
                    ],
                  },
                  {
                    path: 'setup',
                    children: [
                      {
                        index: true,
                        Component: Setup,
                      },
                      {
                        path: 'organization-structure',
                        Component: OrganizationStructure,
                      },
                      {
                        path: 'RBAC',
                        Component: RBAC,
                      },
                      {
                        path: 'salary-framework',
                        Component: SalaryFramework,
                      },
                      {
                        path: 'global-settings',
                        Component: GlobalSetting,
                      },
                    ],
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
