import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { fetchApi } from "@/lib/api";
import type { Category } from "@/models/Category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Used for adding, updating or deleting (NOT fetching!) 
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    setFetching(true);
    setError(null);

    try {
      // Assuming the endpoint is /category based on convention
      const data = await fetchApi<Category[]>("/category");
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (category: Omit<Category, "id">) => {
    setLoading(true);
    setError(null);

    try {
      const newCategory = await fetchApi<Category>("/category", {
        method: "POST",
        body: JSON.stringify(category),
      });
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Created new category! 🎉");
      return newCategory;
    } catch (err) {
      toast.error("Failed to add category");
      setError(err instanceof Error ? err.message : "Failed to add category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, category: Partial<Category>) => {
    setLoading(true);
    setError(null);

    try {
      await fetchApi(`/category/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
      });
      setCategories((prev) =>
        prev.map((c) => (c.categoryId === id ? { ...c, ...category } : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetchApi(`/category/${id}`, {
        method: "DELETE",
      });
      setCategories((prev) => prev.filter((c) => c.categoryId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
      throw err;
    }
  };

  return {
    categories,
    fetching,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
