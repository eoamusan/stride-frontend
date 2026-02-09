import { Switch } from '@/components/ui/switch';

export default function PreferencesTab({ preferences, onPreferenceToggle }) {
  return (
    <div>
      <h2 className="mb-4 text-base font-bold">Notifications Alert</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">Mobile push notifications</h3>
            <p className="text-sm text-gray-700">
              Receive push notifications on mentions and comments via your
              mobile app
            </p>
          </div>
          <Switch
            checked={preferences.mobilePushNotification}
            onCheckedChange={() =>
              onPreferenceToggle('mobilePushNotification')
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">In-app push notifications</h3>
            <p className="text-sm text-gray-700">
              Receive push notifications on mentions and comments via your
              desktop
            </p>
          </div>
          <Switch
            checked={preferences.inAppPushNotification}
            onCheckedChange={() => onPreferenceToggle('inAppPushNotification')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">Email Notifications</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Activity in your workspace
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails when you get comments, mentions, page invites,
              reminders, access requests, and property changes
            </p>
          </div>
          <Switch
            checked={preferences.actionMail}
            onCheckedChange={() => onPreferenceToggle('actionMail')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails about activity in your workspace, even when you are
              active on the app
            </p>
          </div>
          <Switch
            checked={preferences.alwaysSendMail}
            onCheckedChange={() => onPreferenceToggle('alwaysSendMail')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">Low Stock Alert</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails about activity in your workspace, even when you are
              active on the app
            </p>
          </div>
          <Switch
            checked={preferences.activityEmail}
            onCheckedChange={() => onPreferenceToggle('activityEmail')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">Unpaid Credit</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails about unpaid sales activity
            </p>
          </div>
          <Switch
            checked={preferences.unpaidSalesEmail}
            onCheckedChange={() => onPreferenceToggle('unpaidSalesEmail')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">User Activity</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails about activity in your workspace, even when you are
              active on the app
            </p>
          </div>
          <Switch
            checked={preferences.userActivityEmail}
            onCheckedChange={() => onPreferenceToggle('userActivityEmail')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">Product Expiry</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails about product close to expiry still in inventory
            </p>
          </div>
          <Switch
            checked={preferences.productExpiryEmail}
            onCheckedChange={() => onPreferenceToggle('productExpiryEmail')}
          />
        </div>

        <h2 className="mb-4 text-base font-bold">Report View Reminder</h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold">
              Always send email notifications
            </h3>
            <p className="text-sm text-gray-700">
              Receive emails to view report
            </p>
          </div>
          <Switch
            checked={preferences.viewReportReminderEmail}
            onCheckedChange={() => onPreferenceToggle('viewReportReminderEmail')}
          />
        </div>
      </div>
    </div>
  );
}
