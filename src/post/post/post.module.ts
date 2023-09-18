import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { postProviders } from './post.providers';

@Module({
  controllers: [PostController],
  providers: [PostService, ...postProviders]
})
export class PostModule {}
