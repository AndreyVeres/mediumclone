import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { QueryFilters } from './types/queryFilters.type';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@User('id') currentUserId: number, @Query() query: QueryFilters): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async create(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponse> {
    const article = await this.articleService.create(user, createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  public async findBySlug(@Param('slug') slug: string): Promise<ArticleResponse> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  public async deleteArticle(@User('id') userId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, userId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updateArticle(@User('id') userId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: UpdateArticleDto) {
    const article = await this.articleService.updateArticle(slug, userId, updateArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  public async favorite(@User('id') userId: number, @Param('slug') slug: string) {
    const article = await this.articleService.favorite(userId, slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  public async unfavorite(@User('id') userId: number, @Param('slug') slug: string) {
    const article = await this.articleService.unfavorite(userId, slug);
    return this.articleService.buildArticleResponse(article);
  }
}
