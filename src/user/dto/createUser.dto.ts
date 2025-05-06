import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  public readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}
