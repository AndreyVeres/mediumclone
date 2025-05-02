import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/follow.entity';
import { ProfileService } from '@app/profile/profile.service';
import { CommentEntity } from './comment.entity';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ProfileService],
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity, CommentEntity])],
})
export class ArticleModule {}
