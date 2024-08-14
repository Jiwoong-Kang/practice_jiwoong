import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({}), EmailModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, AccessTokenStrategy],
})
export class AuthModule {}
