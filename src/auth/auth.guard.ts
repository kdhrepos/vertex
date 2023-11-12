import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RedisService } from "src/redis/redis.service";

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

// @Injectable()
// export class LocalAuthGuard extends AuthGuard("local") {
// 	constructor(private readonly redisService: RedisService) {
// 		super();
// 	}

// 	async canActivate(context: any): Promise<boolean> {
// 		// LocalStrategy 실행
// 		const result = (await super.canActivate(context)) as boolean;
// 		const request = context.switchToHttp().getRequest();

// 		const { user, sessionID } = request;

// 		//Serializer 실행
// 		if (!this.redisService.serializeUser(user, sessionID)) {
// 			return null;
// 		}
// 		return result;
// 	}
// }

// @Injectable()
// export class AuthenticatedGuard extends AuthGuard("session") {
// 	constructor(private readonly redisService: RedisService) {
// 		super();
// 	}

// 	async canActivate(context: ExecutionContext): Promise<boolean> {
// 		const request = context.switchToHttp().getRequest();

// 		const { sessionID } = request;

// 		return this.redisService.deserializeUser(sessionID);
// 	}
// }
@Injectable()
export class AuthenticatedGuard extends AuthGuard("session") {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		return request.isAuthenticated();
	}
}

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
// 	canActivate(context: ExecutionContext): boolean {
// 		const request = context.switchToHttp().getRequest();
// 		return request.isAuthenticated();
// 	}
// }
