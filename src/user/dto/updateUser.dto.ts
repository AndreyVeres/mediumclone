import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public readonly email: string;

  @IsString()
  @IsOptional()
  public readonly username: string;

  @IsString()
  @IsOptional()
  public readonly password: string;

  @IsString()
  @IsOptional()
  public readonly image: string;

  @IsString()
  @IsOptional()
  public readonly bio: string;
}
