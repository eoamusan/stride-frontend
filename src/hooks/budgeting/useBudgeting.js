import AccountService from "@/api/accounts";
import BudgetService from "@/api/budget";
import { formatDate, formatTime, getPaginationData } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";


// const budgetTypeMap = {
//   profitAndLoss: 'Profit & Loss',
//   balanceSheet: 'Balance Sheet',
// };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function useBudgeting() {
  const [loading, setLoading] = useState(false);
  const [downloadingBudgetTemplate, setDownloadingBudgetTemplate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  const fetchBudgetTransactions = useCallback(async (payload) => {
    return await AccountService.fetchBudgetTransactions(payload)
  }, []);

  const fetchBudgets = useCallback(async () => {

    const formatResponse = (data) => {
      return data.map((item) => ({
        id: item.budgetNumber,
        name: item.budgetName,
        format: item.format,
        scope: item.scope,
        date: formatDate(item.createdAt),
        lastModifiedBy: item.accountId ? `${item.accountId?.firstName} ${item.accountId?.lastName}` : 'N/A',
        timeModified: formatTime(item.updatedAt),
        ...item
      }));
    }

    setLoading(true);
    try {
      const response = await BudgetService.fetch()
      setBudgets(formatResponse(response.data.data.budgets) || []);
      setPaginationData(getPaginationData(response.data.data));
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }, [])

  const submitBudget = (payload) => {
    setSubmitting(true);
    const createBudget = async () => {
      try {
        return await BudgetService.create({ data: payload });
      } catch (error) {
        console.error('Error creating budget:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    };
    return createBudget();
  }

  const updateBudget = (payload) => {
    setSubmitting(true);
    const updateBudget = async () => {
      try {
        return await BudgetService.update(payload);
      } catch (error) {
        console.error('Error creating budget:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    };
    return updateBudget();
  }

  const fetchAccount = useCallback(async (accountType) => {
    return await AccountService.fetch({accountType})
  }, []);
  
  const handleDownloadTemplate = async (formValues) => {
  try {
    setDownloadingBudgetTemplate(true);

    const period = formValues.period.split("_")[1];
    const startDate = new Date(`${period}-01-01`);
    const endDate = new Date(`${period}-12-31`);
    const res = await fetchBudgetTransactions({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

    // const expenseAccountsData = expenseRes.data.data.accounts || [];
    // const revenueAccountsData = revenueRes.data.data.accounts || [];

    const accountsData = res.data.data.accounts || [];

    // Group by accountType
    const grouped = accountsData.reduce((acc, item) => {
      const key = item.account.accountType;
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    }, {});

    const wsData = [];
    const sectionTotals = {}; // Track TOTAL row per section

    // Column headers
    const fiscalYear = formValues.period.split("_")[1] || new Date().getFullYear();
    const months = MONTHS.map(month => {
      return `${month} ${fiscalYear}`
    })
    wsData.push(["Item", ...months, "Total"]);

    Object.entries(grouped).forEach(([accountType, accounts]) => {
      // Section header
      wsData.push([accountType.toUpperCase()]);

      const startRow = wsData.length + 1; // Excel rows are 1-based

      accounts.forEach(item => {
        wsData.push([
          item.account.accountName,
          ...Array(12).fill(0),
          // add function to sum inputed amounts for this row,  ignore wsData.push([accountType.toUpperCase()]);
          { f: `SUM(B${wsData.length + 1}:M${wsData.length + 1})` }
        ],
        );
      });

      const endRow = wsData.length;

      // TOTAL row for section
      wsData.push([
        "TOTAL",
        { f: `SUM(B${startRow}:B${endRow})` },
        ...Array(12).fill(0).map((_, idx) => ({ f: `SUM(${String.fromCharCode(67 + idx)}${startRow}:${String.fromCharCode(67 + idx)}${endRow})` })),
        // { f: `SUM(C${wsData.length + 1}:N${wsData.length + 1})` }
      ]);

      // Store TOTAL row index
      sectionTotals[accountType] = wsData.length;

      // Spacer row
      wsData.push([]);
    });

    // Remove trailing spacer
    if (wsData[wsData.length - 1]?.length === 0) {
      wsData.pop();
    }

    const incomeTotalRow = sectionTotals.income;
    const expenseTotalRow = sectionTotals.expenses;

    // Gross Profit row
    wsData.push([]);
    wsData.push([
      "GROSS PROFIT",
      { f: `B${incomeTotalRow} - B${expenseTotalRow}` },
      ...Array(12).fill(0).map((_, idx) => ({ f: `${String.fromCharCode(67 + idx)}${incomeTotalRow} - ${String.fromCharCode(67 + idx)}${expenseTotalRow}` })),
      // funcion to sum the gross profit for the year usinng the array above take not of the space row
      // { f: `SUM(C${wsData.length + 1}:N${wsData.length + 1})` }
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Freeze header row
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Header note
    ws["A1"].c = [{ t: "Insert between rows to preserve formula." }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BudgetTemplate");

    XLSX.writeFile(wb, "BudgetTemplate.xlsx");
  } catch (error) {
    console.error("Error fetching accounts:", error);
  } finally {
    setDownloadingBudgetTemplate(false);
  }
};

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  return { 
    paginationData, 
    budgets, 
    loading, 
    submitting, 
    downloadingBudgetTemplate,
    updateBudget,
    fetchBudgetTransactions,
    fetchAccount,
    submitBudget, 
    fetchBudgets, 
    handleDownloadTemplate 
  }; 
}