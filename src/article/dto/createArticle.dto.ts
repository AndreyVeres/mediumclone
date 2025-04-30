import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  @IsString()
  @IsNotEmpty()
  public readonly body: string;

  public readonly tagList?: string[];
}
