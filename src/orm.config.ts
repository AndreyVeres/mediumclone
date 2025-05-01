import { DataSource } from 'typeorm';
import { TagEntity } from '@app/tag/tag.entity';
import { UserEntity } from './user/user.entity';
import { ArticleEntity } from './article/article.entity';
import { FollowEntity } from './profile/follow.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'mediumclone',
  entities: [TagEntity, UserEntity, ArticleEntity, FollowEntity],
  synchronize: false,
  // migrations: ['src/migrations/**/*.ts'],
  migrations: ['src/migrations'],
});
