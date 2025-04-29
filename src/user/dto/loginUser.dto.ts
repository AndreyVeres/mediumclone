import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}
