import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Provider } from '../../common/enums/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.NAVER,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('NAVER_AUTH_CLIENT_ID'),
      clientSecret: configService.get('NAVER_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_AUTH_CALLBACK_URL'),
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, displayName } = profile;
    const { profile_image, email } = profile._json;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        throw new HttpException(
          `This email belongs to ${provider}`,
          HttpStatus.CONFLICT,
        );
      }
      done(null, user);
    } catch (err) {
      if (err.status === 404) {
        const newUser = await this.userService.createUser({
          name: displayName,
          email,
          provider,
          profileImg: profile_image,
        });
        done(null, newUser);
      }
    }
  }
}
