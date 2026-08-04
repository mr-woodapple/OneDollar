/**
 * Holding the tagKeys to make cache invalidation easier, 
 * mainly avoid making typos.
 */
const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
};

// The api route for tags
const TAG_API_ROUTE = "/odata/tag";

export { tagKeys, TAG_API_ROUTE }
