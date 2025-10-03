import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard is responsible for invoking the Passport 'local' strategy.
 * It will trigger the `validateUser` method in our `LocalStrategy`.
 * If the user is validated successfully, the route handler will proceed.
 * If not, it will throw a 401 Unauthorized exception automatically.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }

