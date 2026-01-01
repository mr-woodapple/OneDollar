/**
 * Holding the transactionKeys to make cache invalidation easier, 
 * mainly avoid making typos.
 */
const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
};

// The api route for categories
const TRANSACTION_API_ROUTE = "/odata/transaction";

export { transactionKeys, TRANSACTION_API_ROUTE }
