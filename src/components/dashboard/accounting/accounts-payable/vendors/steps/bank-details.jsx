import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function BankDetailsStep({ control }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6">
        {/* Account Name */}
        <FormField
          control={control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  className={'h-10'}
                  placeholder="Enter account name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* Account Number */}
        <FormField
          control={control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input
                  className={'h-10'}
                  placeholder="Enter account no"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* Bank Name */}
        <FormField
          control={control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input
                  className={'h-10'}
                  placeholder="Enter Bank Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* Branch/Sort Code */}
        <FormField
          control={control}
          name="branchSortCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Branch/Sort Code (optional for Domiciliary account)
              </FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* FNB Universal Code */}
        <FormField
          control={control}
          name="fnbUniversalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FNB Universal Code</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Swift Code */}
        <FormField
          control={control}
          name="swiftCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swift Code</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
