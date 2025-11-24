import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import type { Account } from "@/models/Account";
import { toast } from "sonner";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Used for adding, updating or deleting (NOT fetching!) 
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAccounts = useCallback(async () => {
    setFetching(true);
    setError(null);

    try {
      // Assuming the endpoint is /account based on convention
      const data = await fetchApi<Account[]>("/account");
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (account: Omit<Account, "id">) => {
    setLoading(true);
    setError(null);

    try {
      const newAccount = await fetchApi<Account>("/account", {
        method: "POST",
        body: JSON.stringify(account),
      });
      setAccounts((prev) => [...prev, newAccount]);
      toast.success("Created new account! 🎉");
      return newAccount;
    } catch (err) {
      toast.error("Failed to add account!");
      setError(err instanceof Error ? err.message : "Failed to add account");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (id: number, account: Partial<Account>) => {
    setLoading(true);
    setError(null);

    try {
      await fetchApi(`/account/${id}`, {
        method: "PUT",
        body: JSON.stringify(account),
      });
      setAccounts((prev) =>
        prev.map((a) => (a.accountId === id ? { ...a, ...account } : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id: number) => {
    try {
      await fetchApi(`/account/${id}`, {
        method: "DELETE",
      });
      setAccounts((prev) => prev.filter((a) => a.accountId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      throw err;
    }
  };

  return {
    accounts,
    fetching,
    loading,
    error,
    refresh: fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
