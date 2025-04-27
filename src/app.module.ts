import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule],
})
export class AppModule {}
