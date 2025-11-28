import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import type { Category } from "@/models/Category";
import { CATEGORY_API_ROUTE, categoryKeys } from "../queries/categoriesQueries";

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch categories
  const categories = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => fetchApi<Category[]>(CATEGORY_API_ROUTE),
    staleTime: 1000 * 60 * 5 // 5 Minutes
  })

  // Add category
  const addCategory = useMutation({
    mutationFn: (newCategory: Omit<Category, "id">) =>
      fetchApi<Category>(CATEGORY_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newCategory),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Created new category! 🎉");
    },
    onError: () => {
      toast.error("Failed to add category!");
    }
  })

  // Update category for given id
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Category }) =>
      fetchApi(`${CATEGORY_API_ROUTE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Updated category! 🎉");
    },
    onError: () => {
      toast.error("Failed to update category!");
    }
  });

  // Delete category for given id
  const deleteCategory = useMutation({
    mutationFn: (id: number) =>
      fetchApi(`${CATEGORY_API_ROUTE}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category deleted.");
    },
    onError: () => {
      toast.error("Failed to delete category.");
    }
  });

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
