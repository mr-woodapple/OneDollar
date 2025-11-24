import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

import type { Transaction } from "@/models/Transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Used for adding, updating or deleting (NOT fetching!) 
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
    setFetching(true);
    setError(null);
    
    try {
      const data = await fetchApi<Transaction[]>("/transaction");
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    setLoading(true);
    setError(null);

    try {
      const newTransaction = await fetchApi<Transaction>("/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
      });
      setTransactions((prev) => [...prev, newTransaction]);
      toast.success("Created new transaction! 🎉");
      return newTransaction;
    } catch (err) {
      toast.error("Failed to add transaction!");
      setError(err instanceof Error ? err.message : "Failed to add transaction");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: number, transaction: Transaction) => {
    setLoading(true);
    setError(null);

    try {
      await fetchApi(`/transaction/${id}`, {
        method: "PUT",
        body: JSON.stringify(transaction),
      });
      setTransactions((prev) =>
        prev.map((t) => (t.transactionId === id ? { ...t, ...transaction } : t))
      );
      toast.success("Updated transaction! 🎉");
    } catch (err) {
      toast.error("Failed to update transaction!");
      setError(err instanceof Error ? err.message : "Failed to update transaction");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    setError(null);
    
    try {
      await fetchApi(`/transaction/${id}`, {
        method: "DELETE",
      });
      setTransactions((prev) => prev.filter((t) => t.transactionId !== id));
      toast.success("Deleted transaction!");
    } catch (err) {
      toast.error("Failed to delete transaction!");
      setError(err instanceof Error ? err.message : "Failed to delete transaction");
      throw err;
    }
  };

  return {
    transactions,
    fetching,
    error,
    loading,
    refresh: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
