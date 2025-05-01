import { Article } from './article.type';

export interface ArticlesResponseInterface {
  articles: Article[];
  articlesCount: number;
}
