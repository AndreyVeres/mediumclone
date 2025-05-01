import { ArticleEntity } from '../article.entity';

export type Article = Omit<ArticleEntity, 'updateTimeStamp'>;
