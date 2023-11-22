import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
	async canActivate(context: any): Promise<boolean> {
		// Execute GoogleStrategy
		const result = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();

		// Execute Serializer
		await super.logIn(request);
		return result;
	}
}

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
	async canActivate(context: any): Promise<boolean> {
		// LocalStrategy 실행
		const result = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();

		// Serializer 실행
		await super.logIn(request);
		return result;
	}
}

@Injectable()
export class AuthenticatedGuard extends AuthGuard("session") {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		return request.isAuthenticated();
	}
}
