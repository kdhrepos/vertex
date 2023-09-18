import { Inject,Injectable } from '@nestjs/common';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
    constructor(
        @Inject('POST_REPOSITORY')
        private postRepository: Post
      ) {}
}
