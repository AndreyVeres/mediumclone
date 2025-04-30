import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, getRepository, Repository } from 'typeorm';
import { ArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { QueryFilters } from './types/queryFilters.type';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async findAll(userId: number, query: QueryFilters): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.createdAt', 'DESC');

    const { limit, offset, author, tag } = query;
    const articlesCount = await queryBuilder.getCount();

    if (author) {
      queryBuilder.andWhere('author.username = :username', {
        username: author,
      });
    }

    if (tag) {
      const tags = tag.split(',').filter(Boolean);

      tags.forEach((tag) => {
        queryBuilder.andWhere('articles.tagList LIKE :tag', {
          tag: `%${tag}%`,
        });
      });
    }

    if (limit) {
      queryBuilder.limit(Number(limit));
    }

    if (offset) {
      queryBuilder.offset(Number(offset));
    }

    const articles = await queryBuilder.getMany();
    return {
      articles,
      articlesCount,
    };
  }

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

  public async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new BadRequestException('article not found');
    }

    return article;
  }

  public async deleteArticle(slug: string, userId: number) {
    const article = await this.findBySlug(slug);

    if (!article) throw new NotFoundException('Article does not exists');

    if (article.author.id !== userId) throw new ForbiddenException('This user cant delete this article');

    return await this.articleRepository.delete({ slug });
  }

  private buildSlug(title: string): string {
    const uniq = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return slugify(title, { lower: true }) + '-' + uniq;
  }

  public async updateArticle(slug: string, userId: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findBySlug(slug);

    if (!article) throw new NotFoundException('Article does not exists');
    if (article.author.id !== userId) throw new ForbiddenException('This user cant update this article');

    Object.assign(article, updateArticleDto);

    if (updateArticleDto.title && article.title !== updateArticleDto.title) {
      article.slug = this.buildSlug(updateArticleDto.title);
    }

    return await this.articleRepository.save(article);
  }
}
