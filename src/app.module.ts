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

// Database
import { sequelizeOptions } from "./database/sequelize.options";
// import { HashtagModule } from "./hashtag/hashtag.module";
import { PlaylistModule } from "./playlist/playlist.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			isGlobal: true,
			expandVariables: true,
		}),
		SequelizeModule.forRoot(sequelizeOptions),
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
