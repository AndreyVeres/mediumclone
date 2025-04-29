import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  public readonly email: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}
