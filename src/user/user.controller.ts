import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import RoleGuard from '@auth/guards/role.guard';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { User } from '@user/entities/user.entity';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/file.model';

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

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'A single image file with addtional user data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },

        name: {
          type: 'string',
          description: 'Name of the user',
          example: 'Jiwoong',
        },

        email: {
          type: 'string',
          description: 'Email address of the user',
          example: 'dnd0311@naver.com',
        },

        // password: {
        //   type: 'string',
        //   description: 'Password of the user',
        //   example: 'password123@',
        // },
      },
    },
  })
  async updateUserByToken(
    @Req() req: RequestWithUser,
    @UploadedFile() profileImg?: BufferedFile,
    @Body() updateUserDto?: CreateUserDto,
  ) {
    return await this.userService.updateUserInfoByToken(
      req.user,
      profileImg,
      updateUserDto,
    );
  }
}
