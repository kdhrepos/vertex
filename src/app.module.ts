import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video/video.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { PostLikeModule } from './post-like/post-like.module';
import { VideoLikeModule } from './video/video-like/video-like.module';
import { VideoRecordModule } from './video/video-record/video-record.module';
import { PostModule } from './post-comment/post/post.module';
import { PostCommentModule } from './post/post-comment/post-comment.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PlaylistModule } from './playlist-contents/playlist/playlist.module';
import { PlaylistContentsModule } from './playlist/playlist-contents/playlist-contents.module';
import { HashtagLinkController } from './h/hashtag-link/hashtag-link.controller';
import { HashtagLinkController } from './hashtag/hashtag-link/hashtag-link.controller';
import { HashtagLinkModule } from './hashtag/hashtag-link/hashtag-link.module';


@Module({
  imports: [VideoModule, PostModule, UserModule, AuthModule, SubscriptionModule, HashtagModule, PostLikeModule, VideoLikeModule, VideoRecordModule, PostCommentModule, PlaylistModule, PlaylistContentsModule, HashtagLinkModule, ],
  controllers: [AppController, HashtagLinkController],
  providers: [AppService,],
})
export class AppModule {}
