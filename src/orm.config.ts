import { DataSource } from 'typeorm';
import { TagEntity } from '@app/tag/tag.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'mediumclone',
  entities: [TagEntity],
  synchronize: false,
  migrations: ['src/migrations/**/*{.ts,.js}'],
});
