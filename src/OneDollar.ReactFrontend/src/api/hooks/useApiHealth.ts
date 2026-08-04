import { useQuery } from "@tanstack/react-query";

import { checkApiHealth } from "@/api/api";

export function useApiHealth() {
  const health = useQuery({
    queryKey: ["api-health"],
    queryFn: checkApiHealth,
    networkMode: "always",
    retry: false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  return {
    isApiUnavailable: health.errorUpdatedAt > health.dataUpdatedAt,
  };
}
