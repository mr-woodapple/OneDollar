/**
 * Holding the accountKeys to make cache invalidation easier, 
 * mainly avoid making typos.
 */
const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
};

// The api route for accounts
const ACCOUNT_API_ROUTE = "/account";


export { accountKeys, ACCOUNT_API_ROUTE }

