import { Module } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consent } from '@consent/entities/consent.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consent]), UserModule],
  controllers: [ConsentController],
  providers: [ConsentService],
})
export class ConsentModule {}
