import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) {}

  public async create(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.buildSlug(createArticleDto.title);
    article.author = user;
    return await this.articleRepository.save(article);
  }

  public buildArticleResponse(article: ArticleEntity): ArticleResponse {
    return { article };
  }

  public async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new BadRequestException('article not found');
    }

    return article;
  }

  private buildSlug(title: string): string {
    const uniq = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return slugify(title, { lower: true }) + '-' + uniq;
  }
}
