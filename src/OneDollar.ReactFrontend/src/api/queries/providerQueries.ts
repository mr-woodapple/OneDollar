const providerKeys = {
  all: ['providers'] as const,
  lunchFlow: () => [...providerKeys.all, 'lunchFlow'] as const,
};

const LUNCHFLOW_API_ROUTE = "/provider/LunchFlow";

export { providerKeys, LUNCHFLOW_API_ROUTE }
