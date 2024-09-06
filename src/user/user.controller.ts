import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import RoleGuard from '@auth/guards/role.guard';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { User } from '@user/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(RoleGuard(Role.ADMIN))
  @Get('/all')
  async getAllUser(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getAllUsers(pageOptionsDto);
  }
}
