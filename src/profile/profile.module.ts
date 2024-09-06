import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@profile/entities/profile.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
