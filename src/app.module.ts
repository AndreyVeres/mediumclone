import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { DataSourceModule } from './dataSource.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DataSourceModule, TagModule, UserModule],
})
export class AppModule {}  
