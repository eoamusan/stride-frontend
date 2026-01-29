import AccountService from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useBudgeting from "@/hooks/budgeting/useBudgeting";
import { cn } from "@/lib/utils";
import { CalendarCog, Check, Pencil, PlusCircleIcon } from "lucide-react";
import { useRef } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import SuccessModal from "../../success-modal";
import AddAccountForm from "../../bookkeeping/add-account";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const QUARTERS = ["Q1","Q2","Q3","Q4"];
const YEARS = ["Year"];
const COL_WIDTH = "150px";

export default function CustomBudgetForm({ formValues, onCreateBudget, onUpdateBudget }) {
  const { submitting,fetchBudgetTransactions, updateBudget,submitBudget } = useBudgeting();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [accountData, setAccountData] = useState();
  const [budgetName, setBudgetName] = useState("");
  const [fiscalYear, setFiscalYear] = useState();
  const [editingName, setEditingName] = useState(false);
  const [budgetScope, setBudgetScope] = useState("monthly");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedInputIdx, setSelectedInputIdx] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [showAccountSuccess, setShowAccountSuccess] = useState(false);
  const [accountsByType, setAccountsByType] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [budgetAccounts, setBudgetAccounts] = useState([]);

  const budgetInputRefs = useRef({});

  const range = useMemo(() => {
    if (budgetScope === "monthly") return MONTHS;
    if (budgetScope === "quarterly") return QUARTERS;
    return YEARS;
  }, [budgetScope]);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  const gridTemplate = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${range.length + 3}, minmax(${COL_WIDTH}, 1fr))`,
    }),
    [range.length]
  );

  const updateValue = useCallback((accountId, idx, value) => {
    setValues(prev => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [idx]: value,
      },
    }));
  }, []);

  useEffect(() => {
    const name = searchParams.get("budget");
    const year =
      formValues?.periodStartDate
        ? new Date(formValues.periodStartDate).getFullYear()
        : undefined;

    setBudgetName(name || "");
    setFiscalYear(year);
  }, [searchParams, formValues]);

  useEffect(() => {
    console.log(accountData, 'accountsData')
    if (!accountData) return;
    const newData = {
      accountingAccountId: accountData,
      totalAmount: 0,
      transactions: [],
      type: 'product',
    }
    setBudgetAccounts([...budgetAccounts, newData]);
    setAccountData(null);
  }, [accountData, budgetAccounts]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!formValues) return;

      setLoading(true);
      try {
        // start and end date should be a year before fiscalYear (fiscalYear - 1)
        // const startDate = new Date(fiscalYear - 1, 0, 1);
        // const endDate = new Date(fiscalYear - 1, 11, 31);
        const startDate = new Date(formValues.periodStartDate);
        const endDate = new Date(formValues.periodEndDate);

        const res = await fetchBudgetTransactions({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        setBudgetAccounts(res.data.data || []);

        
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [fetchBudgetTransactions, formValues, range, fiscalYear]);

  useEffect(() => {
    console.log(budgetAccounts, 'budgetAccounts')
    const grouped = budgetAccounts?.reduce((acc, account) => {
        acc[account.accountingAccountId.accountType] ??= [];
        acc[account.accountingAccountId.accountType].push(account);
        return acc;
      }, {});

      let initialValues = {}
      if (!formValues.id) {
        initialValues = budgetAccounts?.reduce((acc, account) => {
          acc[account.accountingAccountId._id] = range.reduce((mAcc, _, idx) => {
            mAcc[idx] = "";
            return mAcc;
          }, {});
          return acc;
        }, {});
      } else {
        initialValues = budgetAccounts?.reduce((acc, account) => {
          const foundAcct = formValues.accounts.find(acct => acct.accountId._id === account.accountingAccountId._id);
          acc[account.accountingAccountId._id] = range.reduce((mAcc, _, idx) => {
            mAcc[idx] = foundAcct ? foundAcct.budgets[idx] : "";
            return mAcc;
          }, {});
          return acc;
        }, {});
      }

      console.log(initialValues, 'initialValues')

      setAccountsByType(grouped);
      setValues(initialValues);
  }, [budgetAccounts, formValues, range, budgetScope]);

  const handleCancel = () => {
    navigate("/dashboard/accounting/budgeting");
  };

  const handleSetSelectedAccountId = (accountId, idx) => {
    setSelectedAccountId(accountId);
    setSelectedInputIdx(idx);
  }

  useEffect(() => {
    const inputRef = budgetInputRefs.current[selectedInputIdx];
    if (inputRef) {
      inputRef.focus();
    }
  }, [selectedInputIdx, selectedAccountId])

  const computeTotalForAccountType = (accounts) => {
    return accounts.reduce((acc, account) => {
      acc += account.totalAmount ? Number(account.totalAmount) : 0;
      return acc;
    }, 0);
  }

  const computeGrossProfit = () => {
    const totalRevenue = computeTotalForAccountType(accountsByType['income'] || []);
    const totalExpenses = computeTotalForAccountType(accountsByType['expenses'] || []);
    return totalRevenue - totalExpenses;
  }

  const getTotalForAccountTypeAtIndex = (accounts, idx) => {
    return accounts.reduce((acc, account) => {
      const accountValues = values[account.accountingAccountId._id];
      if (accountValues && accountValues[idx]) {
        acc += Number(accountValues[idx]);
      }
      return acc;
    }, 0);
  }

  const computeGrossProfitAtIndex = (idx) => {
    const totalRevenue = getTotalForAccountTypeAtIndex(accountsByType['income'] || [], idx);
    const totalExpenses = getTotalForAccountTypeAtIndex(accountsByType['expenses'] || [], idx);
    return totalRevenue - totalExpenses;
  }

  const computeTotalForAccountRow = (account) => {
    const accountValues = values[account.accountingAccountId._id];
    if (!accountValues) return 0;

    return Object.values(accountValues).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }

  const computeGrossProfitRow = () => {
    const totalIndices = range.length;
    let total = 0;
    for (let i = 0; i < totalIndices; i++) {
      total += computeGrossProfitAtIndex(i);
    }
    return total;
  }

  const getTotalForAccountTypeAtIndexRow = (accounts) => {
    return accounts.reduce((acc, account) => {
      acc += computeTotalForAccountRow(account);
      return acc;
    }, 0);
  }

  const handleSubmitBudget = async() => {
    const payload = {
      budgetName,
      ...formValues,
      scope: budgetScope,
      accounts: Object.entries(values).map(([accountId, budgets]) => ({
        accountId,
        budgets: Object.values(budgets),
      })),
    };

    try {
      if (formValues?._id) {
        await updateBudget({ data: payload, id: payload._id });
        onUpdateBudget()
      } else {
        await submitBudget(payload);
        onCreateBudget()
      }
      
      navigate("/dashboard/accounting/budgeting");
    } catch (error) {
      console.error("Error submitting budget:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between">
        <div className="gap-2 min-w-80">
          <div className="flex items-center gap-2">
            {editingName ? (
              <Input
                value={budgetName}
                onChange={e => setBudgetName(e.target.value)}
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-semibold">{budgetName}</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingName(v => !v)}
            >
              { editingName ? <Check size={26} /> : <Pencil size={16} /> }
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Allocate budgets to your accounts.
          </p>
        </div>


        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <CalendarCog />
          </Button>
          <ToggleGroup
            type="single"
            value={budgetScope}
            onValueChange={setBudgetScope}
            variant="outline"
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Grid table */}
      <div className="bg-white mt-4">
        <div className="overflow-x-auto border rounded">

          {/* Header row */}
          <div className="grid text-sm" style={gridTemplate}>
            <div className="p-2 border-r border-b border-r-gray-200" />
            <div className="p-2 border-r border-b text-right">
              Actual <span className="font-semibold">({fiscalYear - 1})</span>
            </div>
            {range.map(label => (
              <div key={label} className="p-2 border-r border-b text-right font-medium">
                {label} <span className="font-semibold">{fiscalYear}</span>
              </div>
            ))}
            <div className="p-2 border-r border-b font-semibold text-right">
              Total
            </div>
          </div>

          {loading ? (
            <div className="grid" style={gridTemplate}>
              {Array.from({ length: range.length + 3 }).map((_, i) => (
                <div key={i} className="p-2 border-r">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
            {
            Object.entries(accountsByType).map(([type, accounts]) => (
              <>
              <div key={type}>
                <div className="grid text-sm" style={gridTemplate}>
                  <div
                    className="p-2 font-medium capitalize bg-gray-100 border-b"
                    style={{ gridColumn: `span ${range.length + 3}` }}
                  >
                    {type}
                  </div>
                </div>

                {accounts.map(account => (
                  <>
                  <div
                    key={account.id}
                    className="grid text-sm [&>*:nth-child(even)]:bg-gray-100"
                    style={gridTemplate}
                  >
                    <div className="p-2 border-r border-b">
                      {account.accountingAccountId.accountName}
                    </div>
                  
                    <div className="p-2 border-r border-b text-right font-medium">
                      {currency.format(Number(account.totalAmount) || 0)}
                    </div>

                    {range.map((_, idx) => (
                      // set input to auto focus when clicked
                      <div key={idx} className="p-2 border-r border-b flex justify-end" onClick={() => handleSetSelectedAccountId(account.accountingAccountId._id, idx)}>
                        { selectedAccountId === account.accountingAccountId._id ? (
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={values[account.accountingAccountId._id]?.[idx] ?? ""}
                            onChange={(e) => updateValue(account.accountingAccountId._id, idx, e.target.value)}
                            className="w-full text-right bg-white"
                            formatNumber
                            ref={(el) => (budgetInputRefs.current[idx] = el)}
                          />) :
                        <span>{currency.format(Number(values[account.accountingAccountId._id]?.[idx]) || 0)}</span>
                      }
                      </div>
                    ))}

                    <div className="p-2 border-r border-b text-right font-medium">
                      {currency.format(computeTotalForAccountRow(account))}
                    </div>
                    
                  </div>
                  </>
                ))}
              </div>
              <div
                className="grid text-sm [&>*:nth-child(even)]:bg-gray-100"
                style={gridTemplate}
              >
                <div className="p-2 border-r border-b font-semibold">
                  Total
                </div>
              
                <div className="p-2 border-r border-b text-right font-semibold">
                  { currency.format(computeTotalForAccountType(accounts)) }
                </div>

                {range.map((_, idx) => (
                  // set input to auto focus when clicked
                  <div key={idx} className={cn("p-2 border-r border-b flex justify-end font-bold", getTotalForAccountTypeAtIndex(accounts, idx) < 0 && "text-destructive")}>
                    <span>{currency.format(getTotalForAccountTypeAtIndex(accounts, idx))}</span>
                  </div>
                ))}

                <div className="p-2 border-r border-b text-right font-semibold">
                  { currency.format(getTotalForAccountTypeAtIndexRow(accounts)) }
                </div>
              </div>
              </>
            ))
          }
          <div
            className="grid text-sm [&>*:nth-child(even)]:bg-gray-100"
            style={gridTemplate}
          >
            <div className="p-2 border-r border-b font-semibold">
              Gross Profit
            </div>
          
            <div className={cn("p-2 border-r border-b text-right font-semibold", computeGrossProfit() < 0 && "text-destructive")}>
              { currency.format(computeGrossProfit()) }
            </div>

            {range.map((_, idx) => (
              // set input to auto focus when clicked
              <div key={idx} className={cn("p-2 border-r border-b flex justify-end font-bold", computeGrossProfitAtIndex(idx) < 0 && "text-destructive")}>
                <span>{currency.format(computeGrossProfitAtIndex(idx))}</span>
              </div>
            ))}

            <div className={cn("p-2 border-r border-b text-right font-semibold", computeGrossProfitRow() < 0 && "text-destructive")}>
              { currency.format(computeGrossProfitRow()) }
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-2 mt-4">
        <div>
          <Button variant="outline" onClick={() => setOpenAddForm(true)}>
            <PlusCircleIcon className="size-4" />
            Add Account
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={!budgetName || submitting} onClick={handleSubmitBudget} isLoading={submitting}>
            {formValues?.id ? 'Update Budget' : 'Create Budget'}
          </Button>
        </div>
      </div>

      <SuccessModal
        title={'Account Added'}
        description={`You've successfully added an account.`}
        open={showAccountSuccess}
        onOpenChange={setShowAccountSuccess}
        backText={'Back'}
        handleBack={() => setShowAccountSuccess(false)}
      />

      <AddAccountForm
        isOpen={openAddForm}
        onClose={setOpenAddForm}
        showSuccessModal={async (response) => {
          setShowAccountSuccess(true);
          try {
            const responseData = response.data?.data;
            const account = responseData;
            setAccountData(account);
          } catch (error) {
            console.error('Error refreshing accounts:', error);
          }
        }}
      />
    </>
  );
}
