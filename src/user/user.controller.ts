import { Body, Controller, Get, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AppValidationPipe } from '@app/shared/validation.pipe';
import { ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppSwagger } from '@app/swagger.config';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AppSwagger({
    wrapName: 'user',
    model: UserEntity,
    apiBody: CreateUserDto,
  })
  @ApiOperation({ summary: 'Regisration' })
  @Post('users')
  @UsePipes(new AppValidationPipe())
  public async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @AppSwagger({ wrapName: 'user', model: UserEntity })
  @ApiOperation({ summary: 'Login' })
  @Post('users/login')
  @UsePipes(new AppValidationPipe())
  public async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ summary: 'Get user by token' })
  @Get('user')
  @UseGuards(AuthGuard)
  public async currentUser(@User() user: UserEntity): Promise<UserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @ApiOperation({ summary: 'Update user info' })
  @Put('user')
  @UseGuards(AuthGuard)
  public async updateCurrentUser(@Body('user') updateUserDto: UpdateUserDto, @User('id') currentUserId: number): Promise<UserResponse> {
    const updatedUser = await this.userService.updateUser(currentUserId, updateUserDto);
    return this.userService.buildUserResponse(updatedUser);
  }
}
