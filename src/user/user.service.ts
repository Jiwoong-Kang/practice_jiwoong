import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';
import { BufferedFile } from '@root/minio-client/file.model';
import { MinioClientService } from '@root/minio-client/minio-client.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly minioClientService: MinioClientService,
  ) {}

  // id 기반으로 유저를 찾는 로직
  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  // email 기반으로 유저를 찾는 로직
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) return user;
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  // 유저를 등록하는 로직
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async changePasswordWithToken(changePasswordDto: ChangePasswordDto) {
    const { email } = await this.jwtService.verify(changePasswordDto.token, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECRET'),
    });
    const user = await this.getUserByEmail(email);
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return 'Updated password';
  }

  //전제 유저를 가져오는 로직
  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    // return await this.userRepository.find();
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async updateUserInfoByToken(
    user: User,
    image?: BufferedFile,
    updateUserDto?: CreateUserDto,
  ) {
    const profileImg = await this.minioClientService.uploadProfileImg(
      user,
      image,
      'Profile',
    );

    return await this.userRepository.update(user.id, {
      ...updateUserDto,
      profileImg,
    });
  }
}
