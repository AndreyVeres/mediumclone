import { DataSource } from 'typeorm';
import { ArticleEntity } from './article/article.entity';
import { TagEntity } from './tag/tag.entity';
import { UserEntity } from './user/user.entity';
import { FollowEntity } from './profile/follow.entity';
import { CommentEntity } from './article/comment.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'mediumclone',
  entities: [TagEntity, UserEntity, ArticleEntity, FollowEntity, CommentEntity],
  synchronize: false,
  migrations: ['src/seed/**/*.ts'],
  //   migrations: ['src/seed'],
});
