import * as XLSX from "xlsx";
import { zodResolver } from "@hookform/resolvers/zod"
import { get, useForm } from "react-hook-form"
import { useEffect, useRef, useState } from 'react'
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
import PeriodSelector from "@/components/core/period-selector";
import { CircleDashed } from 'lucide-react';
import useBudgeting from "@/hooks/budgeting/useBudgeting";
import { excelBudgetRowSchema, formSchema } from "@/schemas/budget.schema";
import { useUserStore } from "@/stores/user-store";
import { Spinner } from "@/components/ui/spinner";
import AttachBudgetUpload from "../shared/attach-budget-upload";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";


const REQUIRED_HEADERS = ["Actual", "Budget", "Category", "Item"];

export default function BudgetForm({ onCancel, prepareCustomBudgetForm }) {

  const userStore = useUserStore()
  const { 
    downloadingBudgetTemplate, 
    handleDownloadTemplate,
  } = useBudgeting()

  const [, setSearchParams] = useSearchParams()

  const [openCustomBudgetForm, setOpenCustomBudgetForm] = useState(false)
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
  const { handleSubmit, reset, control, formState } = form;
  const { isValid, errors } = formState

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
    };

    try {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        const budgetName = `Budget_${values?.period}_${values?.budgetType}`;
        params.set("budget", budgetName);
        return params;
      });
      prepareCustomBudgetForm(budgetPayload)
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
    Actual: Number(row.Actual),
    Budget: Number(row.Budget),
    Category: String(row.Category).trim(),
    Item: String(row.Item).trim(),
  });

  
  // const validateHeaders = (rows) => {
  //   const headers = Object.keys(rows[0] ?? {});
  //   return REQUIRED_HEADERS.filter(h => !headers.includes(h));
  // };

  const validateExcelData = (rows) => {
    const valid = [];
    const errors = [];

    rows?.forEach((row, index) => {
      const normalized = normalizeRow(row);
      const result = excelBudgetRowSchema.safeParse(normalized);

      if (result.success) {
        valid.push(result.data);
      } else {
        errors.push({
          row: index + 2, // Excel row number
          issues: result.error.flatten().fieldErrors,
        });
      }
    });

    return { valid, errors };
  };

  const formatExcelData = (data) => {
    const result = [];
    let currentCategory = null;
    for (const row of data) {
      const label = row.Item?.toUpperCase();

      // Detect section headers
      if (label === "EXPENSES") {
        currentCategory = "expenses";
        continue;
      }

      if (label === "INCOME") {
        currentCategory = "income";
        continue;
      }

      // Skip totals
      if (label === "TOTAL" || label === "GRAND TOTAL") {
        continue;
      }

      // Skip invalid rows
      if (!currentCategory || typeof row.Actual !== "number") {
        continue;
      }

      result.push({
        Item: row.Item,
        Category: currentCategory,
        Actual: row.Actual,
        Budget: row.Budget
      });
    }
    return result;
  }

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
        console.log('File content:', evt);
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
          toast.error('The uploaded file is missing required headers. Please use the provided template.');
          setExcelErrors([{
            row: 'N/A',
            issues: { Item: ['The uploaded file is missing required headers. Please use the provided template.'] }
          }])
          return;
        }
        setExcelErrors(validateExcelData(formattedExcelData).errors)

        const errors = validateExcelData(formattedExcelData).errors
        if (errors) {
          setExcelErrors(errors)

          console.log('Excel validation errors:', errors);
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

        setExcelImportData(formattedExcelData)
       
        // const missingHeaders = validateHeaders(formattedExcelData);
        // if (missingHeaders.length) {
        //   throw new Error(`Missing columns: ${missingHeaders.join(", ")}`);
        // }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const handleCreateBudgetFromScratch = () => {
    

    setOpenCustomBudgetForm(true)
    
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
            <button type="button" className="flex flex-col items-center text-center text-[8pt] max-w-42 p-2 rounded-md border border-primary cursor-pointer" onClick={(e) => handleCreateBudgetFromScratch(e)}>
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
                      onClick={handleDownloadTemplate}
                      className="text-xs underline text-primary font-medium bg-transparent p-0 cursor-pointer"
                    >
                      Download Template
                    </button>
                    { downloadingBudgetTemplate && <Spinner /> }
                  </div>
                </div>
              </div>
              
            </div>
            {/* { excelErrors[0] && <div className="text-destructive bg-destructive/10 p-2 rounded text-sm">
              Errors found in uploaded file:
              <span className="font-bold block">Row: { excelErrors[0]?.row}</span>
              <ul>
                { excelErrors[0] && Object.entries(excelErrors[0]?.issues).map(([key, value]) => { 
                  return value?.map((msg, idx) => <li key={idx}><span className="font-bold">{key}:</span> {msg}</li>)
                })}
              </ul>
            </div>} */}
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