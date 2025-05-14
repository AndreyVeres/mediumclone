export type SortType = 'ASC' | 'DESC'

type FilterKey = 'limit' | 'offset' | 'author' | 'tag' | 'favorited' | 'search' | 'sortOrder';
export type QueryFilters = Record<Partial<FilterKey>, string>;
