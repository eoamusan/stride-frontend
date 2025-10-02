import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DialogDescription } from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

// Zod schema for form validation
const inventoryCategorySchema = z.object({
  defaultCategory: z.enum(['perishable', 'non-perishable', 'both'], {
    required_error: 'Please select a default category',
  }),
  category: z.string().min(1, 'Please select a category'),
  productNames: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
  enableExpiryHandling: z.boolean().default(false),
  department: z.string().optional(),
  officialName: z.string().min(1, 'Official name is required'),
  dateCreated: z.string().min(1, 'Date created is required'),
  storageAreas: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
      })
    )
    .default([]),
});

export default function InventoryCategoryForm({ open, onOpenChange }) {
  // Local state for storage area form
  const [newStorageAreaName, setNewStorageAreaName] = useState('');
  const [newStorageAreaDescription, setNewStorageAreaDescription] =
    useState('');
  const [showStorageAreaForm, setShowStorageAreaForm] = useState(false);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(inventoryCategorySchema),
    defaultValues: {
      defaultCategory: '',
      category: '',
      productNames: [],
      description: '',
      enableExpiryHandling: false,
      department: '',
      officialName: '',
      dateCreated: '',
      storageAreas: [],
    },
  });

  const { handleSubmit, control, watch, setValue, getValues, reset } = form;

  const handleAddProductName = () => {
    // Logic to add product name
    console.log('Add product name');
    const currentNames = getValues('productNames');
    setValue('productNames', [...currentNames, 'New Product']);
  };

  const handleAddStorageArea = () => {
    if (newStorageAreaName.trim()) {
      const newArea = {
        id: Date.now(),
        name: newStorageAreaName,
        description: newStorageAreaDescription,
      };
      const currentAreas = getValues('storageAreas');
      setValue('storageAreas', [...currentAreas, newArea]);
      setNewStorageAreaName('');
      setNewStorageAreaDescription('');
      setShowStorageAreaForm(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    // Logic to save category
    onOpenChange?.(false);
  };

  const storageAreas = watch('storageAreas');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto p-8 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configure Inventory Category
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-600">
            Set up categories to organize your inventory items effectively
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Default Category */}
            <FormField
              control={control}
              name="defaultCategory"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Default Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perishable" id="perishable" />
                        <Label htmlFor="perishable" className="text-sm">
                          Perishable
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="non-perishable"
                          id="non-perishable"
                        />
                        <Label htmlFor="non-perishable" className="text-sm">
                          Non-Perishable
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="text-sm">
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={'w-full'}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Names */}
            <FormField
              control={control}
              name="productNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Product Names
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        className={'h-10'}
                        placeholder="Add Product Name"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value && !field.value.includes(value)) {
                              field.onChange([...field.value, value]);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((name, index) => (
                            <div
                              key={index}
                              className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm"
                            >
                              <span>{name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newNames = field.value.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(newNames);
                                }}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <XIcon className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short explanation of the category"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enable Default Expiry Handling */}
            <FormField
              control={control}
              name="enableExpiryHandling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      className={'mt-0.5'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Enable Default Expiry Handling
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Automatically handle expiry tracking for perishable items
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department &#40;Optional&#41;</FormLabel>
                  <FormControl>
                    <Input
                      className={'h-10'}
                      placeholder="which department oversees this category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name of Official and Date Created */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="officialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Official</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10'}
                        placeholder="Enter name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="dateCreated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Created</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10'}
                        placeholder="Enter no"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Create Storage Areas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Create Storage Areas
              </Label>
              <div
                onClick={() => setShowStorageAreaForm(!showStorageAreaForm)}
                className="hover:bg-muted-foreground/5 cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-gray-500 hover:text-gray-700"
              >
                Add storage area
              </div>
            </div>

            {/* Storage Area Form */}
            {showStorageAreaForm && (
              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                <div className="space-y-2">
                  <Label htmlFor="storage-name" className="text-sm font-medium">
                    Create Storage Areas
                  </Label>
                  <Input
                    id="storage-name"
                    className={'h-10'}
                    placeholder="Storage area name (e.g, Shelf A1 Back A2)"
                    value={newStorageAreaName}
                    onChange={(e) => setNewStorageAreaName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Describe the location (e.g, Shelf A is at the far right close to the door."
                    value={newStorageAreaDescription}
                    onChange={(e) =>
                      setNewStorageAreaDescription(e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleAddStorageArea}
                    size="sm"
                    className={'h-10'}
                  >
                    Add Storage Area
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStorageAreaForm(false)}
                    size="sm"
                    className={'h-10'}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Display added storage areas */}
            {storageAreas && storageAreas.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Storage Areas</Label>
                <div className="space-y-2">
                  {storageAreas.map((area) => (
                    <div key={area.id} className="rounded-lg bg-gray-50 p-3">
                      <h4 className="text-sm font-medium">{area.name}</h4>
                      <p className="text-xs text-gray-600">
                        {area.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                className={'h-10 min-w-[114px]'}
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button className={'h-10 min-w-[114px]'} type="submit">
                Save Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
