import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(req);

      const res = await this.client
        .send(
          { role: 'auth', cmd: 'check' },
          { jwt: token, app: 'trade2023' },
          //{ jwt: req.headers['authorization']?.split(' ')[1] },
        )
        .pipe(timeout(5000))
        .toPromise();

      //console.dir(res);

      if (res.username) return true;
      else throw new Error('Invalid Authorization');
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}
