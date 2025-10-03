import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserPlusIcon } from 'lucide-react';

// Zod schema for form validation
const addUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  emailAddress: z.email('Please enter a valid email address'),
  roles: z.string().min(1, 'Role is required'),
});

export default function AddUserForm({ open, onOpenChange, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      roles: '',
    },
  });

  const { handleSubmit, reset } = form;

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onFormSubmit = (data) => {
    console.log('Add user data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
    reset();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] sm:max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00]">
            <UserPlusIcon className="size-4 text-white" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>Add New user</DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="mt-2 space-y-6"
          >
            {/* Full Name and Email Address Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address */}
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Roles */}
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="inventory-manager">
                        Inventory Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[120px] rounded-xl text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-[140px] rounded-xl text-sm"
              >
                Add User
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
