import { Module } from '@nestjs/common';
import { HashtagLinkService } from './hashtag-link.service';

@Module({
  providers: [HashtagLinkService]
})
export class HashtagLinkModule {}
