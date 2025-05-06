import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ProfileResponse } from './types/profileResponse.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':profileName')
  async getProfile(@Param('profileName') profileName: string, @User('id') userId: number): Promise<ProfileResponse> {
    const profile = await this.profileService.getProfile(profileName, userId);
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':profileName/follow')
  @UseGuards(AuthGuard)
  async follow(@User('id') userId: number, @Param('profileName') profileName: string): Promise<ProfileResponse> {
    const profile = await this.profileService.follow(profileName, userId);
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':profileName/follow')
  @UseGuards(AuthGuard)
  async unfollow(@User('id') userId: number, @Param('profileName') profileName: string): Promise<ProfileResponse> {
    const profile = await this.profileService.unfollow(profileName, userId);
    return this.profileService.buildProfileResponse(profile);
  }
}
