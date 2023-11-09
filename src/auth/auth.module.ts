import { Module, Session } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { GoogleStrategy } from "./google.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/model/user.model";
import { SessionSerializer } from "./session.serializer";
import { AuthenticatedGuard, LocalAuthGuard } from "./auth.guard";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		SequelizeModule.forFeature([User]),
		UserModule,
		PassportModule.register({ session: true }),
	],
	providers: [
		AuthService,
		UserService,
		GoogleStrategy,
		LocalStrategy,
		SessionSerializer,
		LocalAuthGuard,
		AuthenticatedGuard,
	],
	controllers: [AuthController],
})
export class AuthModule {}
