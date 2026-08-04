import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi, type ODataResponse } from "@/api/api";
import type { Tag } from "@/models/Tag";
import { TAG_API_ROUTE, tagKeys } from "../queries/tagsQueries";

export function useTags() {
  const queryClient = useQueryClient();

  // Fetch tags
  const tags = useQuery({
    queryKey: tagKeys.lists(),
    queryFn: async () => {
      const response = await fetchApi<ODataResponse<Tag[]>>(TAG_API_ROUTE);
      return response.value;
    },
    staleTime: 1000 * 60 * 5, // 5 Minutes
    select: (data) => data.sort((a, b) => (a.name || "").localeCompare(b.name || "")) // Sort alphabetically by name
  })

  // Add tag
  const addTag = useMutation({
    mutationFn: (newTag: Omit<Tag, "id">) =>
      fetchApi<Tag>(TAG_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(newTag),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Created new tag! 🎉");
    },
    onError: () => {
      toast.error("Failed to add tag!");
    }
  })

  // Update tag for given id
  const updateTag = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Tag }) =>
      fetchApi(`${TAG_API_ROUTE}(${id})`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Updated tag! 🎉");
    },
    onError: () => {
      toast.error("Failed to update tag!");
    }
  });

  // Delete tag for given id
  const deleteTag = useMutation({
    mutationFn: (id: number) =>
      fetchApi(`${TAG_API_ROUTE}(${id})`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag deleted.");
    },
    onError: () => {
      toast.error("Failed to delete tag.");
    }
  });

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
  };
}
