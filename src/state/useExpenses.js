import { useEffect, useState } from "react";
import { createExpense, deleteExpense, fetchExpenses } from "../api/expensesApi";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  async function refresh() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchExpenses();
      setExpenses(
        (data ?? []).map((row) => ({
          ...row,
          amountCents: Number(row.amountCents) || 0,
          amountEuros: (Number(row.amountCents) || 0) / 100,
        }))
      );
    } catch (error) {
      setLoadError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addExpense({ description, amountEuros }) {
    await createExpense({ description, amountEuros: Number(amountEuros) || 0 });
    await refresh();
  }

  async function removeExpense(expenseId) {
    await deleteExpense(expenseId);
    await refresh();
  }

  return { expenses, isLoading, loadError, refresh, addExpense, removeExpense };
}
