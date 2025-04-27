import { ConnectionOptions } from 'typeorm';
import { TagEntity } from './tag/tag.entity';

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'mediumclone',
  entities: [TagEntity],
  synchronize: true,
};

export default ormConfig;
