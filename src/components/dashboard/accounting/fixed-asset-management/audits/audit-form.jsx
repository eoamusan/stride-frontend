import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import AccountingTable from "../../table";
import { useState } from "react";
import { AppDialog } from "@/components/core/app-dialog";
import { Label } from "@/components/ui/label";


const sampleData = [
  {
    id: 1,
    name: 'Toyota Camry',
    category: 'Vehicles',
    location: 'Sales Team',
    value: 150000,
    lastUpdated: '2 hours ago',
    depreciation: 'Straight Line',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Dell XPS 15',
    category: 'Electronics',
    location: 'Marketing Team',
    value: 2500,
    lastUpdated: '1 day ago',
    depreciation: 'Declining Balance',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Office Building',
    category: 'Real Estate',
    location: 'Headquarters',
    value: 5000000,
    lastUpdated: '3 days ago',
    depreciation: 'Units of Production',
    status: 'Active',
  }
]

const tableColumns = [
  {
    key: 'name',
    label: 'Asset',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'location',
    label: 'Location',
  },
  {
    key: 'value',
    label: 'Value',
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
  },
  {
    key: 'depreciation',
    label: 'Depreciation',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

const dropdownActions = [
  { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
  { key: 'run-overview', label: 'Run Budget Overview report' },
  { key: 'archive', label: 'Archive' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'delete', label: 'Delete' },
];

const paginationData = {
  page: 1,
  totalPages: 6,
  pageSize: 12,
  totalCount: 64,
};

export default function AuditForm({ onCreate, onCancel }) {
  const [ openAssetTable, setOpenAssetTable ] = useState(false)
  const [ selectedItems, setSelectedItems ] = useState([])
  const [ assets ] = useState([...sampleData])

  const formSchema = z.object({
      scheduledDate: z.date({ required_error: 'Scheduled date is required', invalid_type_error: "Scheduled date is required", }).nullable().refine((val) => val !== null, {
        message: "Scheduled date is required",
      }),
      auditorName: z.string().min(1, "Auditor name is required"),
      assetToAudit: z.string({ message: 'Select an asset to audit'}),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledDate: null,
      auditorName: '',
      assetToAudit: '',
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const onSubmit = (values) => {
    if (!isValid) return
    onCreate(values)
  }

  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        break;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(assets.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'h-10 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Choose date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
              </FormItem>
            )}
            />

            <FormField
              control={control}
              name="auditorName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Auditor Name</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="text" placeholder="Enter Auditor Name" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label>Select Asset to Audit</Label>
            <Button variant="outline" size="sm" type="button" className="w-full mt-4 py-4 text-gray-400 flex justify-between" onClick={() => setOpenAssetTable(true)}>
              { selectedItems.length > 0 ? `${selectedItems.length} Asset(s) Selected` : 'Select Assets' }
              <ChevronDown />
            </Button>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={onCancel} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid}
            >
              Next
            </Button>
          </div>

          
        </form>
      </Form>
      <AppDialog 
        title="Select Asset"
        open={openAssetTable} 
        onOpenChange={setOpenAssetTable}
        className='sm:max-w-250 '
      >
        <AccountingTable
          title="Recent Assets"
          data={assets}
          columns={tableColumns}
          searchFields={[]}
          searchPlaceholder="Search......"
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          showDataSize
        />
      </AppDialog>
    </div>
  );
}