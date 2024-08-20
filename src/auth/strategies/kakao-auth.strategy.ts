import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Provider } from '../../common/enums/provider.enum';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.KAKAO,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('KAKAO_AUTH_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_AUTH_CALLBACK_URL'),
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, displayName } = profile;
    const { profile_image } = profile._json.properties;
    const { email } = profile._json.kakao_account;

    try {
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        throw new HttpException(
          `You are already subscribed to ${user.provider}`,
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
      } else if (err.status === 409) {
        throw new HttpException(
          'Your email already exists',
          HttpStatus.CONFLICT,
        );
      }
    }
  }
}
