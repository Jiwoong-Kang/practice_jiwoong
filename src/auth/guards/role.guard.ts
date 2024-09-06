import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user = req.user;
      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
