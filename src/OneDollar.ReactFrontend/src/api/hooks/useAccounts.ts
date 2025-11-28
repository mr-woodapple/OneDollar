import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import { accountKeys, ACCOUNT_API_ROUTE } from "../queries/accountQueries";
import type { Account } from "@/models/Account";

export function useAccounts() {
  const queryClient = useQueryClient();

  // Fetch accounts
  const accounts = useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => fetchApi<Account[]>(ACCOUNT_API_ROUTE),
    staleTime: 1000 * 60 * 5 // 5 Minutes
  });

  // Create account
  const addAccount = useMutation({
    mutationFn: (newAccount: Omit<Account, "id">) =>
      fetchApi<Account>(ACCOUNT_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newAccount),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Created new account! 🎉");
    },
    onError: () => {
      toast.error("Failed to add account!");
    }
  });

  // Update account for given id
  const updateAccount = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Account }) =>
      fetchApi(`${ACCOUNT_API_ROUTE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Updated account! 🎉");
    },
    onError: () => {
      toast.error("Failed to update account!");
    }
  });

  // Delete account for given id
  const deleteAccount = useMutation({
    mutationFn: (id: number) =>
      fetchApi(`${ACCOUNT_API_ROUTE}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Account deleted.");
    },
    onError: () => {
      toast.error("Failed to delete account.");
    }
  });

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount
  };
}
