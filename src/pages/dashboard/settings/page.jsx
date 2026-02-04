import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react';
// import { useUserStore } from '@/stores/user-store';
import BusinessInfoTab from '@/components/dashboard/settings/business-info-tab';
import PreferencesTab from '@/components/dashboard/settings/preferences-tab';
import SecurityTab from '@/components/dashboard/settings/security-tab';
import BillingTab from '@/components/dashboard/settings/billing-tab';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user-store';
import PreferenceService from '@/api/preference';
import SecurityService from '@/api/security';
import BusinessService from '@/api/business';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { activeBusiness, profile, getUserProfile, getBusinessData } =
    useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'business-info';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Business Info State - populated from activeBusiness
  const [businessInfo, setBusinessInfo] = useState({
    businessType: '',
    legalBusinessName: '',
    legalBusinessAddress: '',
    tin: '',
    industry: '',
    country: '',
    website: '',
    companyStamp: '',
  });

  const [preferences, setPreferences] = useState({
    mobilePushNotification: false,
    inAppPushNotification: false,
    actionMail: false,
    alwaysSendMail: false,
    activityEmail: false,
    unpaidSalesEmail: false,
    userActivityEmail: false,
    productExpiryEmail: false,
    viewReportReminderEmail: false,
  });

  // Security State
  const [security, setSecurity] = useState({
    twoFactorAuth: profile?.accountId?.mfaEnabled || false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);
  const [isSavingBusinessInfo, setIsSavingBusinessInfo] = useState(false);

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

  useEffect(() => {
    if (!activeBusiness || !profile) return;

    setPreferences({
      mobilePushNotification:
        activeBusiness?.preference?.mobilePushNotification || false,
      inAppPushNotification:
        activeBusiness?.preference?.inAppPushNotification || false,
      actionMail: activeBusiness?.preference?.actionMail || false,
      alwaysSendMail: activeBusiness?.preference?.alwaysSendMail || false,
      activityEmail: activeBusiness?.preference?.activityEmail || false,
      unpaidSalesEmail: activeBusiness?.preference?.unpaidSalesEmail || false,
      userActivityEmail: activeBusiness?.preference?.userActivityEmail || false,
      productExpiryEmail:
        activeBusiness?.preference?.productExpiryEmail || false,
      viewReportReminderEmail:
        activeBusiness?.preference?.viewReportReminderEmail || false,
    });

    setBusinessInfo({
      businessType: activeBusiness?.businessInfo?.type || '',
      legalBusinessName: activeBusiness?.businessName || '',
      legalBusinessAddress: activeBusiness?.businessLocation || '',
      tin: activeBusiness?.businessInvoiceSettings?.tin || '',
      industry: activeBusiness?.industry || '',
      country: activeBusiness?.businessInfo?.country || '',
      website: activeBusiness?.businessInfo?.website || '',
      companyStamp: activeBusiness?.businessInfo?.companyStamp || '',
    });

    setSecurity((prev) => ({
      ...prev,
      twoFactorAuth: profile?.accountId?.mfaEnabled || false,
    }));
  }, [activeBusiness, profile]);
  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBusinessInfo = async () => {
    setIsSavingBusinessInfo(true);
    try {
      await BusinessService.update({
        id: activeBusiness._id,
        data: {
          type: businessInfo.businessType,
          businessName: businessInfo.legalBusinessName,
          address: businessInfo.legalBusinessAddress,
          tin: businessInfo.tin,
          industry: businessInfo.industry,
          country: businessInfo.country,
          website: businessInfo.website,
          companyStamp: businessInfo.companyStamp,
        },
      });
      toast.success('Business information updated successfully');
      // Optionally refresh the user profile to get updated data
      await getUserProfile?.();
      await getBusinessData();
    } catch (error) {
      toast.error('Failed to update business information');
      console.error('Business info update error:', error);
    } finally {
      setIsSavingBusinessInfo(false);
    }
  };

  const changePreference = async (field, value) => {
    await PreferenceService.update({
      id: activeBusiness.preference._id,
      data: {
        [field]: value,
      },
    });
    toast.success('Preference updated successfully');
  };

  const handlePreferenceToggle = async (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
    await changePreference(field, !preferences[field]).catch(() => {
      setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
    });
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleMFAToggle = async () => {
    const newMFAStatus = !security.twoFactorAuth;
    setSecurity((prev) => ({ ...prev, twoFactorAuth: newMFAStatus }));

    try {
      await SecurityService.mfa({ mfaEnabled: newMFAStatus });
      toast.success(
        `Two-factor authentication ${newMFAStatus ? 'enabled' : 'disabled'} successfully`
      );

      await getUserProfile();
    } catch (error) {
      // Revert on error
      setSecurity((prev) => ({ ...prev, twoFactorAuth: !newMFAStatus }));
      toast.error('Failed to update two-factor authentication');
      console.error('MFA toggle error:', error);
    }
  };

  const handleStartPasswordChange = async () => {
    // Validate passwords
    if (
      !security.currentPassword ||
      !security.newPassword ||
      !security.confirmPassword
    ) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSubmittingSecurity(true);
    try {
      await SecurityService.startSecurity();
      toast.success('OTP sent to your email');
      setShowOTPModal(true);
    } catch (error) {
      toast.error('Failed to send OTP');
      console.error('Start security error:', error);
    } finally {
      setIsSubmittingSecurity(false);
    }
  };

  const handleOTPSubmit = async (otpValue) => {
    setIsSubmittingSecurity(true);
    try {
      await SecurityService.completeSecurity({
        data: {
          mfaEnabled: security.twoFactorAuth,
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
          confirmNewPassword: security.confirmPassword,
          accountId: profile?.accountId?._id,
          otp: otpValue,
        },
      });
      toast.success('Password changed successfully');
      setShowOTPModal(false);
      handleCancelPassword();
    } catch (error) {
      toast.error(
        'Failed to change password. Please check your OTP and try again.'
      );
      console.error('Complete security error:', error);
    } finally {
      setIsSubmittingSecurity(false);
    }
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
              onSave={handleSaveBusinessInfo}
              isSaving={isSavingBusinessInfo}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab
              preferences={preferences}
              onPreferenceToggle={handlePreferenceToggle}
              onChangePreference={changePreference}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              security={security}
              onSecurityChange={handleSecurityChange}
              onSave={handleStartPasswordChange}
              onCancel={handleCancelPassword}
              onMFAToggle={handleMFAToggle}
              showOTPModal={showOTPModal}
              setShowOTPModal={setShowOTPModal}
              onOTPSubmit={handleOTPSubmit}
              isSubmitting={isSubmittingSecurity}
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
