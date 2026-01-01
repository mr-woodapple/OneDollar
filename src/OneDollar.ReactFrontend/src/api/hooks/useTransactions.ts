import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi, type ODataResponse } from "@/api/api";
import type { Account } from "@/models/Account";
import type { Transaction } from "@/models/Transaction";
import { TRANSACTION_API_ROUTE, transactionKeys } from "../queries/transactionQueries";
import { accountKeys } from "../queries/accountQueries";

export function useTransactions() {
  const queryClient = useQueryClient();

  // Fetch transactions
  const transactions = useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: async () => {
      const response = await fetchApi<ODataResponse<Transaction[]>>(TRANSACTION_API_ROUTE);
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });

      // Update the account balance locally
      queryClient.setQueryData(accountKeys.lists(), (oldAccounts: Account[] | undefined) => {
        if (!oldAccounts) { return oldAccounts; }

        return oldAccounts.map((account) => {
          if (account.accountId === variables.accountId) {
            return {
              ...account,
              balance: Number(account.balance) + variables.amount
            };
          }

          return account;
        });
      });

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });

      // Update account balance locally
      const transactions = queryClient.getQueryData<Transaction[]>(transactionKeys.lists());
      const oldTransaction = transactions?.find((t) => t.transactionId === variables.id);

      if (oldTransaction) {
        queryClient.setQueryData(accountKeys.lists(), (oldAccounts: Account[] | undefined) => {
          if (!oldAccounts) { return oldAccounts; }

          return oldAccounts.map((account) => {
            // Case 1: Account didn't change
            if (oldTransaction.accountId === variables.data.accountId) {
              if (account.accountId === oldTransaction.accountId) {
                return {
                  ...account,
                  balance: Number(account.balance) - oldTransaction.amount + variables.data.amount
                };
              }
            } else {
              // Case 2: Account changed
              if (account.accountId === oldTransaction.accountId) {
                // Remove from old account
                return {
                  ...account,
                  balance: Number(account.balance) - oldTransaction.amount
                };
              }
              if (account.accountId === variables.data.accountId) {
                // Add to new account
                return {
                  ...account,
                  balance: Number(account.balance) + variables.data.amount
                };
              }
            }
            return account;
          });
        });
      }

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });

      // Update account balance locally
      const transactions = queryClient.getQueryData<Transaction[]>(transactionKeys.lists());
      const deletedTransaction = transactions?.find((t) => t.transactionId === variables);

      if (deletedTransaction) {
        queryClient.setQueryData(accountKeys.lists(), (oldAccounts: Account[] | undefined) => {
          if (!oldAccounts) { return oldAccounts; }

          return oldAccounts.map((account) => {
            if (account.accountId === deletedTransaction.accountId) {
              return {
                ...account,
                balance: Number(account.balance) - deletedTransaction.amount
              };
            }
            return account;
          });
        });
      }

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
