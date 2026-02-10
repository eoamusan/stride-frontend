import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useBudgeting from "@/hooks/budgeting/useBudgeting";
import { cn } from "@/lib/utils";
import { CalendarCog, Check, DownloadIcon, Pencil, PlusCircleIcon } from "lucide-react";
import { useRef } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import SuccessModal from "../../success-modal";
import AddAccountForm from "../../bookkeeping/add-account";
import { Checkbox } from "@/components/ui/checkbox";
import { AppDialog } from "@/components/core/app-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const QUARTERS = ["Q1","Q2","Q3","Q4"];
const YEARS = ["Year"];
const COL_WIDTH = "160px";

export default function CustomBudgetForm({ formValues, onCreateBudget, onUpdateBudget }) {
  const { submitting,fetchBudgetTransactions, updateBudget,submitBudget } = useBudgeting();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState();
  const [budgetName, setBudgetName] = useState("");
  const [fiscalYear, setFiscalYear] = useState();
  const [editingName, setEditingName] = useState(false);
  const [budgetScope, setBudgetScope] = useState(formValues?.scope || "monthly");
  const [selectedStartMonth, setSelectedStartMonth] = useState(MONTHS[0]);
  const [selectedEndMonth, setSelectedEndMonth] = useState(MONTHS[MONTHS.length - 1]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedInputIdx, setSelectedInputIdx] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [showAccountSuccess, setShowAccountSuccess] = useState(false);
  const [accountsByType, setAccountsByType] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [budgetAccounts, setBudgetAccounts] = useState([]);
  const [openCustomRangeForm, setOpenCustomRangeForm] = useState(false);

  const budgetInputRefs = useRef({});

  const range = useMemo(() => {
    if (budgetScope === "monthly") { return MONTHS; }
    if (budgetScope === "quarterly") { return QUARTERS; }
    if (budgetScope === "yearly") { return YEARS; }
    if (budgetScope.includes('-')) {
      const [startMonth, endMonth] = budgetScope.split('-');
      return MONTHS.slice(MONTHS.indexOf(startMonth), MONTHS.indexOf(endMonth) + 1);
    }
    return MONTHS.slice(MONTHS.indexOf(selectedStartMonth), MONTHS.indexOf(selectedEndMonth) + 1);
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
      gridTemplateColumns: `repeat(${range.length + 2}, minmax(${COL_WIDTH}, 1fr))`,
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
    const name = formValues?.budgetName || "New Budget";
    const year =
      formValues?.periodStartDate
        ? new Date(formValues.periodStartDate).getFullYear()
        : undefined;

    setBudgetName(name || "");
    setFiscalYear(year);
  }, [formValues]);

  // New account added from AddAccountForm
  useEffect(() => {
    if (!accountData) return;
    const newData = {
      account: accountData,
      groups: [
        {
          totalAmount: 0,
          transactions: [],
          type: 'product',
        }
      ],
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

        const {accounts} = res.data.data || [];


        const undefinedAccounts = []
        if (formValues?.excelData && formValues.excelData.length > 0) {
          formValues.excelData.forEach(x => {
            const account = accounts.find(acct => acct.account.accountName === x.item);
            if (!account) {
              const newData = {
                account: {
                  accountCode: null,
                  accountName: x.item,
                  accountType: x.category.toLowerCase(),
                  businessId: formValues.businessId,
                  createdAt: null,
                  description: null,
                },
                groups: [
                  {
                    totalAmount: 0,
                    transactions: [],
                    type: 'product',
                  }
                ],
              }
              undefinedAccounts.push(newData);
            }
          });
        }

        const rr = [...accounts, ...undefinedAccounts]

        setBudgetAccounts(rr);

        
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [fetchBudgetTransactions, formValues, range, fiscalYear]);


  const groupedAccountsByType = useMemo(() => {
    return budgetAccounts.reduce((acc, account) => {
      const type = account.account.accountType;
      acc[type] ??= [];
      acc[type].push(account);
      return acc;
    }, {});
  }, [budgetAccounts]);

  useEffect(() => {
    if (budgetAccounts.length === 0 || !formValues) return;
      let initialValues = {}
      // New budget form
      if (!formValues.id) {
        if (formValues.excelData && formValues.excelData.length > 0) {
          formValues.excelData.forEach(x => {
            const account = budgetAccounts.find(acct => acct.accountName === x.item);
            if (account) {
              initialValues[account._id] = x.budgets
            }
          })
        } else {
          initialValues = budgetAccounts?.reduce((acc, account) => {
            acc[account.account._id] = range.reduce((mAcc, _, idx) => {
              mAcc[idx] = "";
              return mAcc;
            }, {});
            return acc;
          }, {});
        }
      } else {
        initialValues = budgetAccounts?.reduce((acc, account) => {
          const foundAcct = formValues.accounts.find(acct => acct.accountId._id === account.account._id);
          acc[account.account._id] = range.reduce((mAcc, _, idx) => {
            mAcc[idx] = foundAcct ? foundAcct.budgets[idx] : "";
            return mAcc;
          }, {});
          return acc;
        }, {});
      }
      const checkedAccounts = {}
      Object.entries(initialValues).forEach(([accountId]) => {
        // only check the accounts that exist in the formValues.accounts
        if (formValues.accounts?.find(acct => acct.accountId._id === accountId)) {
          checkedAccounts[accountId] = true;
        }
      })
      setCheckedAccounts(checkedAccounts);

      setAccountsByType(groupedAccountsByType);
      setValues(initialValues);
  }, [budgetAccounts, formValues, range, groupedAccountsByType, budgetScope]);

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
      const accountValues = values[account.account._id];
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
    const accountValues = values[account.account._id];
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
      type: formValues?.type,
      format: formValues?.format,
      periodStartDate: formValues?.periodStartDate,
      periodEndDate: formValues?.periodEndDate,
      businessId: formValues?.businessId,
      scope: budgetScope,
      accounts: Object.entries(values)
        .filter(([accountId]) => checkedAccounts[accountId])
        .map(([accountId, budgets]) => ({
          accountId,
          budgets: Object.values(budgets),
        })),
    };

    try {
      if (formValues?._id) {
        await updateBudget({ data: payload, id: formValues._id });
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

  const [checkedAccounts, setCheckedAccounts] = useState({});
  const handleCheckboxChange = (accountId) => {
    setCheckedAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  }

  const [accountDefaultValues, setAccountDefaultValues] = useState({});
  const addMissingAccount = (account) => {
    setAccountDefaultValues({ accountType: account.account.accountType, accountName: account.account.accountName })
    setOpenAddForm(true);
  }

  const handleStartMonthChange = (month) => {
    setSelectedStartMonth(month);
  }
  const handleEndMonthChange = (month) => {
    setSelectedEndMonth(month);
  }

  const handleApplyCustomRange = () => {
    setBudgetScope(`${selectedStartMonth}-${selectedEndMonth}`);
    setOpenCustomRangeForm(false);
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between">
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
          <Button size={'icon'} variant="outline" disabled={formValues?._id ? true : false} onClick={() => setOpenCustomRangeForm(true)}>
            <CalendarCog />
          </Button>
          <Button variant={'outline'}>
            <DownloadIcon />
          </Button>
          <ToggleGroup
            type="single"
            value={budgetScope}
            onValueChange={setBudgetScope}
            variant="outline"
            disabled={formValues?._id ? true : false}
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {
        budgetAccounts.length > 0 && budgetAccounts.some(acct => !acct.account.accountCode) && (
          <div className="p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 my-4">
            <strong>Warning:</strong> Some accounts from the imported Excel data were not found in your accounting accounts.
            <br/>
            Kindly add them before creating budgets.
          </div>
        )
      }
      {/* Grid table */}
      <div className="grid grid-cols-[200px_1fr] bg-white mt-4 overflow-x-scroll">
        <div className="border ">

          {/* Header row */}
          <div className="grid text-sm">
            <div className="p-2 border-b left-0 bg-white">
              Category
            </div>
          </div>

          {loading ? (
            <div className="grid">
              {Array.from({ length: range.length + 3 }).map((_, i) => (
                <div key={i} className="p-2">
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
                <div className="grid text-sm">
                  <div
                    className="p-2 font-medium capitalize border-b bg-gray-100"
                    style={{ gridColumn: `span 1` }}
                  >
                    <div className="flex gap-2 items-center ">
                      <div className="flex gap-2 items-center whitespace-nowrap left-0">
                        {/* implement check all by type */}
                        <Checkbox
                          checked={accounts.every(account => checkedAccounts[account.account._id])}
                          onCheckedChange={(checked) => {
                            const updated = { ...checkedAccounts };
                            accounts.forEach(account => {
                              updated[account.account._id] = checked;
                            });
                            setCheckedAccounts(updated);
                          }}
                        />
                        {type}
                      </div>
                    </div>
                    
                  </div>
                </div>

                {accounts.map(account => (
                  <>
                  <div
                    key={account.id}
                    className={cn("grid text-sm [&>*:nth-child(even)]:bg-gray-100", !account.account.accountCode && "bg-red-400/10 text-red-400 rounded")}
                  >
                    <div className="p-2 border-b left-0 bg-white">
                      <div className="flex gap-2 items-center whitespace-nowrap">
                        <Checkbox checked={checkedAccounts[account.account._id]} onCheckedChange={() => handleCheckboxChange(account.account._id)} />
                        <span className="truncate max-w-50">

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{account.account.accountName}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{account.account.accountName}</p>
                            </TooltipContent>
                          </Tooltip>

                        </span>
                        { !account.account.accountCode && <Button variant="ghost" size="icon" className="size-6 p-0" onClick={() => addMissingAccount(account)}>
                          <PlusCircleIcon className="size-4" />
                        </Button>}
                      </div>
                    </div>
                  </div>
                  </>
                ))}
              </div>
              <div
                className="grid text-sm [&>*:nth-child(even)]:bg-gray-100 bg-white"
              >
                <div className="p-2 border-b font-semibold sticky left-0 bg-white">
                  Total
                </div>
              </div>
              </>
            ))
          }
          <div
            className="grid text-sm [&>*:nth-child(even)]:bg-gray-100"
          >
            <div className="p-2 font-semibold sticky left-0 bg-white">
              Gross Profit
            </div>
          </div>
          </>
          )}
        </div>
        <div className="overflow-x-auto border border-l-0">
            {/* Header row */}
            <div className="grid text-sm" style={gridTemplate}>
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
              <div className="flex items-center justify-center h-full">
                {/* {Array.from({ length: range.length + 3 }).map((_, i) => (
                  <div key={i} className="p-2 border-r">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))} */}
                <Spinner className="size-8" />
              </div>
            ) : (
              <>
              {
              Object.entries(accountsByType).map(([type, accounts]) => (
                <>
                <div key={type}>
                  <div className="grid text-sm" style={gridTemplate}>
                    <div
                      className="p-2 font-medium capitalize border-b bg-gray-100"
                      style={{ gridColumn: `span ${range.length + 3}` }}
                    >
                      <div className="flex gap-2 items-center ">
                        &nbsp;
                      </div>
                      
                    </div>
                  </div>

                  {accounts.map(account => (
                    <>
                    <div
                      key={account.id}
                      className={cn("grid text-sm [&>*:nth-child(even)]:bg-gray-100", !account.account.accountCode && "bg-red-400/10 text-red-400 rounded")}
                      style={gridTemplate}
                    >
                    
                      <div className="p-2 border-r border-b text-right font-medium">
                        {currency.format(Number(account.groups.reduce((acc, group) => acc + group.totalAmount, 0)) || 0)}
                      </div>

                      {range.map((_, idx) => (
                        // set input to auto focus when clicked
                        <div key={idx} className="p-2 border-r border-b flex justify-end" onClick={() => handleSetSelectedAccountId(account.account._id, idx)}>
                          { selectedAccountId === account.account._id ? (
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={values[account.account._id]?.[idx] ?? ""}
                              onChange={(e) => updateValue(account.account._id, idx, e.target.value)}
                              className="w-full text-right bg-white"
                              formatNumber
                              ref={(el) => (budgetInputRefs.current[idx] = el)}
                            />) :
                          <span>{currency.format(Number(values[account.account._id]?.[idx]) || 0)}</span>
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
                  className="grid text-sm [&>*:nth-child(even)]:bg-gray-100 bg-white"
                  style={gridTemplate}
                >
                
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
          <Button variant="outline" onClick={() => {
            setAccountDefaultValues({})
            setOpenAddForm(true)
          }}>
            <PlusCircleIcon className="size-4" />
            Add Account
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={!budgetName || submitting} onClick={handleSubmitBudget} isLoading={submitting}>
            {formValues?._id ? 'Update Budget' : 'Create Budget'}
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
        type={accountDefaultValues.accountType}
        accountName={accountDefaultValues.accountName}
        isOpen={openAddForm}
        onClose={setOpenAddForm}
        showSuccessModal={async (response) => {
          setShowAccountSuccess(true);
          try {
            const responseData = response.data?.data;
            const account = responseData;
            // find if account exists in budgetAccounts by account.accountName
            let exists = budgetAccounts.find(acct => acct.account.accountName === account.accountName);
            // if exists, append
            if (exists) {
              exists.account = {...exists.account, ...responseData};
              setBudgetAccounts(prev => prev.map(acct => acct.account.accountName === exists.account.accountName ? exists : acct));
              return;
            }

            setAccountData(account);
          } catch (error) {
            console.error('Error refreshing accounts:', error);
          }
        }}
      />

      <AppDialog 
        title="Custom Period Budget"
        headerIcon={<CalendarCog />} 
        open={openCustomRangeForm} 
        onOpenChange={setOpenCustomRangeForm}
        className='sm:max-w-130'
      >
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-full">
            <Label>Start Month</Label>
            <Select onValueChange={handleStartMonthChange} value={selectedStartMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Month</SelectLabel>
                  { MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  )) }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>End Month</Label>
            <Select onValueChange={handleEndMonthChange} value={selectedEndMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Select Month</SelectLabel>
                  { MONTHS.slice(MONTHS.indexOf(selectedStartMonth)).map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  )) }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>&nbsp;</Label>
            <Button onClick={handleApplyCustomRange}>Apply</Button>
          </div>
        </div>
      </AppDialog>
    </>
  );
}
