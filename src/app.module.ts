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

import { PlaylistModule } from "./playlist/playlist.module";

// Model
import { FirebaseModule } from "./firebase/firebase.module";
import { User } from "./model/user.model";
import { Video } from "./model/video.model";
import { Record } from "./model/record.model";
import { Subscription } from "./model/subscription.model";
import { Post } from "./model/post.model";
import { Playlist } from "./model/playlist.model";
import { PlaylistContents } from "./model/playlist-contents.model";
import { Hashtag } from "./model/hashtag.model";
import { Comment } from "./model/comment.model";
import { Like } from "./model/like.model";
import { HashtagLink } from "./model/hashtagLink.model";

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
			timezone: "Asia/Seoul",
			autoLoadModels: true,
			dialectOptions: {
				charset: "utf8mb4",
				dateStrings: true,
				typeCast: true,
			},
			synchronize: true,
			// sync: { alter: true },
			// sync: { force: true },
			models: [
				User,
				Video,
				Post,
				Comment,
				Like,
				Subscription,
				Record,
				Playlist,
				PlaylistContents,
				Hashtag,
				HashtagLink,
			],
		}),
		PostModule,
		VideoModule,
		UserModule,
		AuthModule,
		SubscriptionModule,
		PlaylistModule,
		FirebaseModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
	}
}
