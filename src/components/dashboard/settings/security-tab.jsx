import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import PasswordValidation from '@/components/ui/password-validation';
import OTPModal from './otp-modal';

export default function SecurityTab({
  security,
  onSecurityChange,
  onSave,
  onCancel,
}) {
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleSaveClick = () => {
    setShowOTPModal(true);
  };

  const handleOTPSubmit = (otpValue) => {
    console.log('OTP submitted:', otpValue);
    // Call the actual save function
    onSave?.();
    setShowOTPModal(false);
  };
  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">
          Two-factor Authentication
        </h2>
        <div className="flex items-center gap-3">
          <Switch
            checked={security.twoFactorAuth}
            onCheckedChange={() =>
              onSecurityChange('twoFactorAuth', !security.twoFactorAuth)
            }
          />
          <span className="text-base text-gray-600">
            Enable two factor authentication
          </span>
        </div>
      </div>

      <div>
        <h2 className="mb-1 text-xl font-semibold">Change Password</h2>
        <p className="mb-6 text-base text-gray-600">
          Update password for enhanced account security
        </p>

        <div className="max-w-md space-y-4">
          <div>
            <Label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={security.showCurrentPassword ? 'text' : 'password'}
                value={security.currentPassword}
                onChange={(e) =>
                  onSecurityChange('currentPassword', e.target.value)
                }
                className={'h-10'}
              />
              <button
                type="button"
                onClick={() =>
                  onSecurityChange(
                    'showCurrentPassword',
                    !security.showCurrentPassword
                  )
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {security.showCurrentPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium"
            >
              New Password
            </Label>
            <div className="relative pb-1">
              <Input
                id="newPassword"
                type={security.showNewPassword ? 'text' : 'password'}
                value={security.newPassword}
                onChange={(e) =>
                  onSecurityChange('newPassword', e.target.value)
                }
                className={'h-10'}
              />
              <button
                type="button"
                onClick={() =>
                  onSecurityChange('showNewPassword', !security.showNewPassword)
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {security.showNewPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {security.newPassword && (
              <PasswordValidation password={security.newPassword} />
            )}
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={security.showConfirmPassword ? 'text' : 'password'}
                value={security.confirmPassword}
                onChange={(e) =>
                  onSecurityChange('confirmPassword', e.target.value)
                }
                className={'h-10'}
              />
              <button
                type="button"
                onClick={() =>
                  onSecurityChange(
                    'showConfirmPassword',
                    !security.showConfirmPassword
                  )
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {security.showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flex w-full justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className={'h-10 rounded-xl'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            className="h-10 w-full max-w-74.5 rounded-xl"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onSubmit={handleOTPSubmit}
      />
    </div>
  );
}
