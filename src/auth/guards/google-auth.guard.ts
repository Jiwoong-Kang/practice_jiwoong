import { AuthGuard } from '@nestjs/passport';
import { Provider } from '../../common/enums/provider.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(Provider.GOOGLE) {}
