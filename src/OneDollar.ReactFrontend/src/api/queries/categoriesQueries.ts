/**
 * Holding the categoryKeys to make cache invalidation easier, 
 * mainly avoid making typos.
 */
const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

// The api route for categories
const CATEGORY_API_ROUTE = "/category";

export { categoryKeys, CATEGORY_API_ROUTE }
