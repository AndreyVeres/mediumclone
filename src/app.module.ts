import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { DataSourceModule } from './dataSource.module';
import { UserModule } from './user/user.module';
import { AuthMiddleWare } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [DataSourceModule, TagModule, UserModule, ArticleModule, ProfileModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
