import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponse } from './types/articlesResponse.interface';
import { QueryFilters } from './types/queryFilters.type';
import { FollowEntity } from '@app/profile/follow.entity';
import { CommentEntity } from './comment.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,

    private readonly dataSource: DataSource,
  ) {}

  public async unfavorite(userId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    const articleIndex = user.favorites.findIndex((favorite) => favorite.id === article.id);

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  public async favorite(userId: number, slug: string) {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    const isAlreadyInFavorites = user.favorites.find((favorite) => favorite.id === article.id);

    if (!isAlreadyInFavorites) {
      user.favorites.push(article);
      article.favoritesCount++;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  public async getFeed(userId: number, query: QueryFilters): Promise<ArticlesResponse> {
    const follows = await this.followRepository.find({ where: { followerId: userId } });

    if (!follows.length) {
      return { articles: [], articlesCount: 0 };
    }

    const followsUsersIds = follows.map((f) => f.followingId);

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followsUsersIds });

    const articlesCount = await queryBuilder.getCount();

    const { offset, limit } = query;

    if (offset) {
      queryBuilder.offset(Number(offset));
    }

    if (limit) {
      queryBuilder.limit(Number(limit));
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  public async findAll(userId: number, query: QueryFilters): Promise<ArticlesResponse> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.createdAt', 'DESC');

    const { limit, offset, author, tag, favorited } = query;
    const articlesCount = await queryBuilder.getCount();

    if (author) {
      queryBuilder.andWhere('author.username = :username', {
        username: author,
      });
    }

    if (favorited) {
      const user = await this.userRepository.findOne({ where: { username: favorited }, relations: ['favorites'] });

      const ids = user.favorites.map((f) => f.id);

      if (ids.length) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
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

    let favoridedIds: number[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

      favoridedIds = user.favorites.map((f) => f.id);
    }

    const articles = await queryBuilder.getMany();

    const articleWithFavorites = articles.map((article) => {
      const favorited = favoridedIds.includes(article.id);

      return {
        ...article,
        favorited,
      };
    });

    return {
      articles: articleWithFavorites,
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

  public async getArticleComments(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) throw new NotFoundException('Article not found');

    return await this.commentsRepository.find({
      where: {
        articleId: article.id,
      },
    });
  }
}
