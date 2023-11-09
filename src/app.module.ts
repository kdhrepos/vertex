// Nest
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";

// Video
import { VideoModule } from "./video/video.module";

// Post
import { PostModule } from "./post/post.module";

// User
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { SubscriptionModule } from "./subscription/subscription.module";

// Logger
import { HTTPLoggerMiddleware } from "./middleware/http-logger.middleware";

// import { HashtagModule } from "./hashtag/hashtag.module";
import { PlaylistModule } from "./playlist/playlist.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			isGlobal: true,
			expandVariables: true,
		}),
		SequelizeModule.forRoot({
			dialect: "mysql",
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			autoLoadModels: true,
			timezone: "Asia/Seoul",
			synchronize: true,
			// sync: { alter: true },
			// sync: { force: true },
		}),
		VideoModule,
		PostModule,
		UserModule,
		AuthModule,
		// HashtagModule,
		SubscriptionModule,
		PlaylistModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
	}
}
