import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react';
// import { useUserStore } from '@/stores/user-store';
import BusinessInfoTab from '@/components/dashboard/settings/business-info-tab';
import PreferencesTab from '@/components/dashboard/settings/preferences-tab';
import SecurityTab from '@/components/dashboard/settings/security-tab';
import BillingTab from '@/components/dashboard/settings/billing-tab';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  //   const userStore = useUserStore();

  const activeTab = searchParams.get('tab') || 'business-info';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    businessType: 'Limited Liability',
    legalBusinessName: 'JJ Solutions',
    legalBusinessAddress: 'Bode Thomas Surulere Lagos Nigeria',
    tin: '234676',
    industry: 'Tech',
    country: '',
    website: 'www.jjsolutions.com',
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    mobilePushNotifications: false,
    inAppPushNotifications: true,
    activityInWorkspace: false,
    alwaysSendEmail: false,
    lowStockAlert: true,
    unpaidCredit: true,
    userActivity: true,
    productExpiry: true,
    reportViewReminder: true,
  });

  // Security State
  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // Billing State
  const [billingData] = useState({
    currentPlan: 'Free',
    billingCycle: 'Monthly',
    planCost: '#40000',
    renewalDate: '12-Jun-2026',
    paymentMethod: 'paystack',
    billingHistory: [
      {
        id: 'INV-2025-0001',
        date: '10/03/2025',
        plan: 'Standard',
        amount: '#40000',
        status: 'Active',
      },
      {
        id: 'INV-2025-0001',
        date: '10/03/2025',
        plan: 'Lite',
        amount: '#40000',
        status: 'Expired',
      },
      {
        id: 'INV-2025-0001',
        date: '10/03/2025',
        plan: 'Standard',
        amount: '#40000',
        status: 'Expired',
      },
    ],
  });

  const [selectedBillingItems, setSelectedBillingItems] = useState([]);

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceToggle = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes for', activeTab);
    // TODO: Implement save functionality
  };

  const handleCancelPassword = () => {
    setSecurity((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleBillingItemSelect = (itemId, checked) => {
    setSelectedBillingItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const tabs = [
    { id: 'business-info', label: 'Edit Business info' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'security', label: 'Data and Security' },
    { id: 'billing', label: 'Billing and subscription' },
  ];

  return (
    <div>
      <div
        className={`mt-6 ${activeTab === 'billing' ? 'mb-6' : 'mb-24'} rounded-xl bg-white p-6`}
      >
        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-[#d9d9d9]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary border-b-2'
                  : 'cursor-pointer text-[#7d7d7d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Back Button */}
        <Button onClick={() => navigate('/dashboard')} variant={'ghost'}>
          <ArrowLeftIcon className="size-4" />
          <span>Back</span>
        </Button> 

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'business-info' && (
            <BusinessInfoTab
              businessInfo={businessInfo}
              onBusinessInfoChange={handleBusinessInfoChange}
              onSave={handleSaveChanges}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab
              preferences={preferences}
              onPreferenceToggle={handlePreferenceToggle}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              security={security}
              onSecurityChange={handleSecurityChange}
              onSave={handleSaveChanges}
              onCancel={handleCancelPassword}
            />
          )}

          {activeTab === 'billing' && <BillingTab billingData={billingData} />}
        </div>
      </div>
      {activeTab === 'billing' && (
        <div className="mb-24">
          <AccountingTable
            title="Billing History"
            description="Boost your revenue with real-time insights"
            data={billingData.billingHistory}
            columns={[
              { key: 'id', label: 'Invoice ID' },
              { key: 'date', label: 'Billing Date' },
              { key: 'plan', label: 'Plan' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
            ]}
            searchFields={['id', 'date', 'plan', 'amount', 'status']}
            searchPlaceholder="Search......."
            statusStyles={{
              Active: 'bg-green-100 text-green-700 hover:bg-green-100',
              Expired: 'bg-red-100 text-red-700 hover:bg-red-100',
            }}
            paginationData={{
              page: 1,
              totalPages: 10,
              pageSize: 10,
              totalCount: billingData.billingHistory.length,
            }}
            onPageChange={(page) => console.log('Page changed to:', page)}
            selectedItems={selectedBillingItems}
            handleSelectAll={(checked) => {
              if (checked) {
                setSelectedBillingItems(
                  billingData.billingHistory.map((item) => item.id)
                );
              } else {
                setSelectedBillingItems([]);
              }
            }}
            handleSelectItem={handleBillingItemSelect}
            dropdownActions={[{ key: 'view', label: 'View' }]}
            showDataSize={false}
          />
        </div>
      )}
    </div>
  );
}
