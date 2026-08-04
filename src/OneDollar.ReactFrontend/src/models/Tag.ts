/** Represents a tag that can be applied to multiple transactions. */
export interface Tag {
    tagId?: number;
    name: string | undefined;
    color?: string;
}
