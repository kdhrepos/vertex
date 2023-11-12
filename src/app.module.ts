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

import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as MySQLStore from "express-mysql-session";
import * as mysql2 from "mysql2/promise";
import { RedisService } from "./redis/redis.service";
import { RedisModule } from "./redis/redis.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
			isGlobal: true,
			expandVariables: true,
		}),
		SequelizeModule.forRoot({
			dialect: "mysql",
			host: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			username: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_NAME,
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
		SubscriptionModule,
		PlaylistModule,
		RedisModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
	}
}
