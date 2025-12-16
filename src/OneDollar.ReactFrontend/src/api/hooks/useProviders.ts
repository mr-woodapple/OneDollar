import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi } from "@/api/api";
import { providerKeys, LUNCHFLOW_API_ROUTE } from "../queries/providerQueries";
import type { LunchFlowIntegration } from "@/models/LunchFlowIntegration";

export function useProviders() {
  const queryClient = useQueryClient();

  const lunchFlowConfig = useQuery({
    queryKey: providerKeys.lunchFlow(),
    queryFn: () => fetchApi<LunchFlowIntegration>(LUNCHFLOW_API_ROUTE),
    staleTime: 1000 * 60 * 5 // 5 Minutes
  })

  const saveLunchFlowConfig = useMutation({
    mutationFn: (config: LunchFlowIntegration) =>
      fetchApi(LUNCHFLOW_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(config),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.lunchFlow() });
      toast.success("LunchFlow configuration saved!");
    },
    onError: () => {
      toast.error("Failed to save LunchFlow configuration.");
    },
  });

  return {
    lunchFlowConfig,
    saveLunchFlowConfig,
  };
}
