import AccountService from "@/api/accounts";
import BudgetService from "@/api/budget";
import { formatDate, formatTime, getPaginationData } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";


// const budgetTypeMap = {
//   profitAndLoss: 'Profit & Loss',
//   balanceSheet: 'Balance Sheet',
// };

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
  
  const handleDownloadTemplate = async () => {
  try {
    setDownloadingBudgetTemplate(true);

    const [expenseRes, revenueRes] = await Promise.all([
      fetchAccount('expenses'),
      fetchAccount('income')
    ]);

    const expenseAccountsData = expenseRes.data.data.accounts || [];
    const revenueAccountsData = revenueRes.data.data.accounts || [];

    const accountsData = [...expenseAccountsData, ...revenueAccountsData];

    // Group by accountType
    const grouped = accountsData.reduce((acc, item) => {
      const key = item.accountType;
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    }, {});

    const wsData = [];
    const sectionTotals = {}; // Track TOTAL row per section

    // Column headers
    wsData.push(["Item", "Actual", "Budget"]);

    Object.entries(grouped).forEach(([accountType, accounts]) => {
      // Section header
      wsData.push([accountType.toUpperCase()]);

      const startRow = wsData.length + 1; // Excel rows are 1-based

      accounts.forEach(item => {
        wsData.push([item.accountName, 0, 0]);
      });

      const endRow = wsData.length;

      // TOTAL row for section
      wsData.push([
        "TOTAL",
        { f: `SUM(B${startRow}:B${endRow})` },
        { f: `SUM(C${startRow}:C${endRow})` }
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
      { f: `C${incomeTotalRow} - C${expenseTotalRow}` }
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Freeze header row
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Header note
    ws["A1"].c = [{ t: "Do not insert rows. Edit actual and budget values only." }];

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