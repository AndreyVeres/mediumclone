type FilterKey = 'limit' | 'offset' | 'author' | 'tag' | 'favorited';
export type QueryFilters = Record<Partial<FilterKey>, string>;
