import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';
import { CreateProfileDto } from '@profile/dto/create-profile.dto';

@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(req.user, createProfileDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.updateProfileByUser(
      req.user,
      createProfileDto,
    );
  }
}
