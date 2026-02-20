import { Button } from "@/components/ui/button";
// import checker from '@/assets/images/checker.png';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import AccountService from "@/api/accounts";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/user-store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useBudgeting from "@/hooks/budgeting/useBudgeting";

export default function CustomBudgetFormTemplate({ formData, onBack, onCreateBudget }) {
  const userStore = useUserStore()
  const { submitBudget, fetchAccount } = useBudgeting()
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [accountData, setAccountData] = useState();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const [values, setValues] = useState({});


  useEffect(() => {
    console.log('Form Data in CustomBudgetForm:', formData);
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const [expenseRes, revenueRes] = await Promise.all([fetchAccount('expenses'), fetchAccount('income')]);
        const expenseAccountsData = expenseRes.data.data.accounts || [];
        const revenueAccountsData = revenueRes.data.data.accounts || [];
        const accountsData = [ ...expenseAccountsData, ...revenueAccountsData ];

        const grouped = accountsData.reduce((acc, item) => {
          const key = item.accountType;

          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push(item);
          return acc;
        }, {});

        setAccountData(grouped);
        setExpenseAccounts(accountsData);

        const inputValues = accountsData.reduce((acc, account) => {
          acc[account.id] = { budget: '', actual: '' };
          return acc;
        }, {});
        setValues(inputValues);
        console.log('Input Values:', inputValues);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, [fetchAccount, formData])

  const handleOnChange = (accountId, field, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [accountId]: {
        ...prevValues[accountId],
        [field]: value,
      },
    }));
  }

  const handleCreateBudget = async () => {
    const budgetPayload = {
      type: formData?.budgetType,
      periodStartDate: formData?.period.from,
      periodEndDate: formData?.period.to,
      format: formData?.budgetFormat,
      businessId: userStore.activeBusiness?._id,
      setupOption: {
        customBudget: Object.entries(values).map(([accountId, vals]) => ({
          monthlyExpenses: expenseAccounts.find(acc => acc.id === accountId)?.accountName || '',
          category: expenseAccounts.find(acc => acc.id === accountId)?.accountType || '',
          budget: String(parseFloat(vals.budget) || 0),
          actual: String(parseFloat(vals.actual) || 0),
        })),
      }
    };

    try {
      // const response = await submitBudget(budgetPayload);
      // console.log('Budget created successfully:', response.data);
      onCreateBudget();
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-white bg-primary px-4 py-1">Budget Template</h2>

      {/* <div className="relative mb-3">
        <img src={checker} className="w-30" alt="Logo" />
      </div> */}

      <h3 className="font-medium">Directions:</h3>
      <ol className="text-sm list-decimal list-inside">
        <li>Add your Expenses and the cost estimates for each item.</li>
        <li>Add the actual expenses for each item for the month.</li>
      </ol>

      <div className="w-full border border-gray-200 rounded-lg overflow-hidden mt-4">

        
        { loading && <div className="grid grid-cols-4 text-sm">
          <div className="p-2 border-r"><Skeleton className="h-4 w-full" /></div>
          <div className="p-2 border-r"><Skeleton className="h-4 w-full" /></div>
          <div className="p-2 border-r"><Skeleton className="h-4 w-full" /></div>
          <div className="p-2"><Skeleton className="h-4 w-full" /></div>
        </div> }
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-0"
          >
            { accountData && Object.keys(accountData).map((accountType, idx) => (
              <AccordionItem value={`item-${idx}`} key={idx} className="px-2 py-1">
                <AccordionTrigger>
                  <h3 className="font-semibold text-base capitalize">
                    { accountType }
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col">
                  <div className="grid grid-cols-3 text-sm font-medium border border-b-0">
                    <div className="p-2 border-r whitespace-nowrap">Item</div>
                    <div className="p-2 border-r">Budget</div>
                    <div className="p-2">Actual</div>
                  </div>
                  { accountData[accountType]?.map((account) => (
                    <div key={account.id} className="grid grid-cols-3 text-sm border">
                      <div className="p-2 border-r flex items-center whitespace-wrap">{account.accountName}</div>
                      <div className="p-2 border-r">
                        <Input type="number" className="w-full" placeholder="0.00" value={values[account.id]?.budget} onChange={(e) => handleOnChange(account.id, 'budget', e.target.value)} />
                      </div>
                      <div className="p-2">
                        <Input type="number" className="w-full" placeholder="0.00" value={values[account.id]?.actual} onChange={(e) => handleOnChange(account.id, 'actual', e.target.value)} />
                      </div>
                    </div>
                  ))
                  }
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>


      </div>

      <div className="flex justify-start space-x-4 pt-10 pb-5">
        <Button
          type="button"
          variant="outline"
          className="h-10 min-w-32.5 text-sm"
          onClick={() => onBack()}
        >
          Back
        </Button>

        <Button
          type="submit"
          className="h-10 min-w-32.5 text-sm"
          onClick={() => handleCreateBudget()}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Create
        </Button>
      </div>
    </div>
  )
}