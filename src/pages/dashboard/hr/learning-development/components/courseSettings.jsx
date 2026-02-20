import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

export default function CourseSettings() {
  const { control } = useFormContext();

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-600">Course Settings</h3>

      {/* Mandatory Training */}
      <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
        <FormField
          control={control}
          name="settings.isMandatory"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  id="mandatory"
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                  className="mt-1"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex-1 space-y-2">
          <FormLabel
            htmlFor="mandatory"
            className="cursor-pointer text-sm font-medium text-gray-900"
          >
            Mandatory Training
          </FormLabel>

          <p className="text-sm font-medium text-gray-500">
            Employees must complete this course by assigned due date
          </p>
        </div>
      </div>

      {/* Issue Certificate */}
      <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4">
        <FormField
          control={control}
          name="settings.issueCertificate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  id="certificate"
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                  className="mt-1"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex-1">
          <FormLabel
            htmlFor="certificate"
            className="cursor-pointer text-sm font-medium text-gray-900"
          >
            Issue Certificate
          </FormLabel>
          <p className="text-sm text-gray-500">
            Automatically generate certificate upon completion
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="border-0 bg-purple-100">
        {/* <Info className="h-4 w-4 text-purple-600" /> */}
        <AlertDescription className="text-[13px] text-blue-800">
          Once published, enrolled employees will be notified via email. You can
          still edit content but major changes may affect progress tracking.
        </AlertDescription>
      </Alert>
    </div>
  );
}
