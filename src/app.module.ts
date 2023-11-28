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
// import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

@Module({
	imports: [
		ConfigModule.forRoot({
			// envFilePath: `.${process.env.NODE_ENV}.env`,
			// isGlobal: true,
			// expandVariables: true,
		}),
		SequelizeModule.forRoot({
			dialect: "mysql",
			host: "165.229.86.160",
			port: 8194,
			username: "kim",
			password: "qwe123",
			database: "vertex",
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
		// ServeStaticModule.forRoot({
		// 	rootPath: path.join(__dirname, "..", "/build"),
		// }),
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
