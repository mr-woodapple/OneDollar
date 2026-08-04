import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi, type ODataResponse } from "@/api/api";
import type { Transaction } from "@/models/Transaction";
import { TRANSACTION_API_ROUTE, transactionKeys } from "../queries/transactionQueries";
import { accountKeys } from "../queries/accountQueries";

export function useTransactions() {
  const queryClient = useQueryClient();

  // Fetch transactions
  const transactions = useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: async () => {
      const response = await fetchApi<ODataResponse<Transaction[]>>(`${TRANSACTION_API_ROUTE}?$expand=tags`);
      return response.value;
    },
    staleTime: 1000 * 60 * 5 // 5 Minutes
  });

  // create new transaction
  const addTransaction = useMutation({
    mutationFn: (newTransaction: Omit<Transaction, "id">) =>
      fetchApi<ODataResponse<Transaction>>(TRANSACTION_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newTransaction),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });

      toast.success("Created new transaction! 🎉");
    },
    onError: () => {
      toast.error("Failed to add transaction!");
    }
  });

  // Update transaction for a given id
  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Transaction }) =>
      fetchApi(`${TRANSACTION_API_ROUTE}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });

      toast.success("Updated transaction! 🎉");
    },
    onError: () => {
      toast.error("Failed to update transaction!");
    }
  });

  // Delete transaction for a given id
  const deleteTransaction = useMutation({
    mutationFn: (id: number) =>
      fetchApi(`${TRANSACTION_API_ROUTE}(${id})`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });

      toast.success("Transaction deleted.");
    },
    onError: () => {
      toast.error("Failed to delete transaction.");
    }
  });

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
