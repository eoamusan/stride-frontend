import * as XLSX from "xlsx";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRef, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { CircleDashed } from 'lucide-react';
import useBudgeting from "@/hooks/budgeting/useBudgeting";
import { excelBudgetRowSchema, formSchema } from "@/schemas/budget.schema";
import { useUserStore } from "@/stores/user-store";
import { Spinner } from "@/components/ui/spinner";
import AttachBudgetUpload from "../shared/attach-budget-upload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function BudgetForm({ onCancel }) {

  const navigate = useNavigate()

  const userStore = useUserStore()
  const { 
    downloadingBudgetTemplate, 
    handleDownloadTemplate,
  } = useBudgeting()

  const [budgetFile, setBudgetFile] = useState(null)
  const [excelErrors, setExcelErrors] = useState([])
  const [excelImportData, setExcelImportData] = useState([])

  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetType: "profitAndLoss",
      period: `FY_${new Date().getFullYear()}`,
      budgetFormat: "consolidated",
    },
    mode: "onChange"
  })
  const { handleSubmit, reset, control } = form;

  const onSubmit = async (values) => {
    // get select period (fiscal year) start and end dates
    // split FY_2023 to get 2023
    const fiscalYear = values?.period.split("_")[1];
    const periodStartDate = new Date(`January 1, ${fiscalYear}`);
    const periodEndDate = new Date(`December 31, ${fiscalYear}`);
    const budgetPayload = {
      type: values?.budgetType,
      periodStartDate: periodStartDate,
      periodEndDate: periodEndDate,
      format: values?.budgetFormat,
      businessId: userStore.activeBusiness?._id,
      excelData: excelImportData,
      budgetName: `Budget_${values?.period}_${values?.budgetType}`,
    };

    try {
      navigate(`/dashboard/accounting/budgeting/${budgetPayload.budgetName}`, { state: { budgetPayload } })
    } catch (error) {
      console.error('Error creating budget:', error);
    }
    
  }

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const normalizeRow = (row) => ({
    budgets: row.budgets,
    category: String(row.category).trim(),
    item: String(row.item).trim(),
  });

  
  // validate excel data
  const validateExcelData = (data) => {
    const excelErrors = [];
    data.forEach((row, index) => {
      const normalizedRow = normalizeRow(row);
      const result = excelBudgetRowSchema.safeParse(normalizedRow);
      if (!result.success) {
        const fieldErrors = {};
        const errors = JSON.parse(result.error)
        errors.forEach((err) => {
          const fieldName = err.path[0];
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = [];
          }
          fieldErrors[fieldName].push(err.message);
        });
        excelErrors.push({
          row: index + 2, // +2 to account for header row and 0-based index
          issues: fieldErrors,
        });
      }
    });

    const valid = excelErrors.length === 0;
    return { valid, errors: excelErrors };
  };

  // const formatExcelData = (data) => {
  //   console.log(JSON.stringify(data, null, 2), 'formatting excel data')
  //   const result = [];
  //   let currentCategory = null;
  //   for (const row of data) {
  //     const label = row.Item?.toUpperCase();

  //     // Detect section headers
  //     if (label === "EXPENSES") {
  //       currentCategory = "expenses";
  //       continue;
  //     }

  //     if (label === "INCOME") {
  //       currentCategory = "income";
  //       continue;
  //     }

  //     // Skip totals
  //     if (label === "TOTAL" || label === "GROSS PROFIT") {
  //       continue;
  //     }

  //     // console.log(row, 'processing row')
  //     // const rr = {...row}
  //     // delete rr.Category;
  //     // delete rr.Item;
  //     // delete rr.Budget;
  //     // const dd = Object.values(rr);
  //     // dd.pop()
  //     result.push({
  //       item: row.Item,
  //       category: currentCategory,
  //       // Budget should the the January to December items from the excel
  //       budgets: [],
  //     });
  //   }

  //   console.log(result, 'formatted excel data')
  //   return result;
  // }

  const formatExcelData = (data) => {
    let currentCategory = "";
    const result = [];

    data.forEach((row) => {
      const itemName = row.Item?.trim();

      // 1. Detect if the row is a Category Header
      if (itemName === "INCOME" || itemName === "EXPENSES") {
        currentCategory = itemName;
        return; // Skip to next row
      }

      // 2. Skip "TOTAL" or "GROSS PROFIT" rows
      if (itemName === "TOTAL" || itemName === "GROSS PROFIT") {
        return;
      }

      // 3. Extract the 12 month values into the budgets array
      // We filter out 'Item' and 'Total' keys to get just the months
      const budgets = Object.keys(row)
        .filter(key => key !== "Item" && key !== "Total")
        .map(key => row[key] === "" ? 0 : row[key]);

      // 4. Push the formatted object
      result.push({
        item: itemName,
        category: currentCategory,
        budgets: budgets
      });
    });

    console.log(result, 'formatted excel data')

    return result;
  };

  const getFiscalYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = currentYear - 2; i <= currentYear + 4; i++) {
      options.push({
        label: `FY ${i} (Jan ${i} - Dec ${i})`,
        value: `FY_${i}`,
      });
    }
    return options;
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBudgetFile(file)

      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        const formattedExcelData = formatExcelData(jsonData);
        if (formattedExcelData.length === 0) {
          // toast.error('The uploaded file is missing required headers. Please use the provided template.');
          setExcelErrors([{
            row: 'N/A',
            issues: { Item: ['The uploaded file is missing required headers. Please use the provided template.'] }
          }])
          return;
        }
        setExcelErrors(validateExcelData(formattedExcelData).errors)

        const errors = validateExcelData(formattedExcelData).errors
        if (errors.length) {
          setExcelErrors(errors)
          Object.entries(errors[0]?.issues ?? {}).forEach(([key, messages]) => {
            const content = (
              <ul className="list-disc pl-4">
                {messages.map((msg, idx) => (
                  <li key={idx}>
                    <span className="font-bold">{key} (Row: {errors[0]?.row}):</span> {msg}
                  </li>
                ))}
              </ul>
            );

            toast.error(content);
          });
          return;
        }

        console.log(formattedExcelData, 'final formattedExcelData')
        setExcelImportData(formattedExcelData)
       
        // const missingHeaders = validateHeaders(formattedExcelData);
        // if (missingHeaders.length) {
        //   throw new Error(`Missing columns: ${missingHeaders.join(", ")}`);
        // }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const removeAttachment = () => {
    setBudgetFile(null)
    setExcelErrors([])
    setExcelImportData([])
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  
  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#434343]">
          <p className="text-sm mt-4">Select your preferred options</p>
          <FormField
            control={control}
            name="budgetType"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel className="min-w-25">Budget Type</FormLabel>
                <FormControl className="flex gap-8">
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="profitAndLoss" id="profitAndLoss" />
                      <Label htmlFor="profitAndLoss">Profit and loss</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="balanceSheet" id="balanceSheet" />
                      <Label htmlFor="balanceSheet">Balance Sheet</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel className="min-w-25">Period</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      getFiscalYearsOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="budgetFormat"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel>Budget Format</FormLabel>
                <FormControl className="flex gap-8">
                  <RadioGroup  value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="consolidated" id="consolidated" />
                      <Label htmlFor="consolidated">Consolidated</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="subdivided" id="subdivided" />
                      <Label htmlFor="subdivided">Subdivided</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Available setup option</span>
            <button type="button" className="flex flex-col items-center text-center text-[8pt] max-w-42 p-2 rounded-md border border-primary cursor-pointer">
              <CircleDashed className="my-2" />
              <span className="font-bold">Custom Budgets</span>
              <span>Create a budget from scratch</span>
            </button>
            <div className="flex gap-4">
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv,.xlsx"
                />
                {budgetFile && <AttachBudgetUpload budgetFile={budgetFile} removeAttachment={removeAttachment} />}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="text-xs underline text-primary font-medium bg-transparent p-0 cursor-pointer"
                  >
                    { budgetFile ? "Re-import Budget" : "Import Budget" }
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadTemplate(form.getValues())}
                      className="text-xs underline text-primary font-medium bg-transparent p-0 cursor-pointer"
                    >
                      Download Template
                    </button>
                    { downloadingBudgetTemplate && <Spinner /> }
                  </div>
                </div>
              </div>
              
            </div>
            { excelErrors[0] && <div className="text-destructive bg-destructive/10 p-2 rounded text-sm">
              Errors found in uploaded file:
              <span className="font-bold block">Row: { excelErrors[0]?.row}</span>
              <ul>
                { excelErrors[0] && Object.entries(excelErrors[0]?.issues).map(([key, value]) => { 
                  return value?.map((msg, idx) => <li key={idx}><span className="font-bold">{key}:</span> {msg}</li>)
                })}
              </ul>
            </div>}
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4 pt-10 pb-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 px-10 text-sm rounded-3xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={budgetFile && excelErrors.length > 0}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
      {/* <AppDialog 
        title="Custom Budgets"
        description="Create a budget from scratch"
        open={openCustomBudgetForm} 
        onOpenChange={setOpenCustomBudgetForm}
        className='sm:max-w-150'
      >
        <CustomBudgetForm formData={formState.values} onBack={() => setOpenCustomBudgetForm(false)} onSubmit={handleOnSubmit} />
      </AppDialog> */}
    </div>
  )
}