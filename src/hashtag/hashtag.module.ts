import { Module } from "@nestjs/common";

import { HashtagService } from "./hashtag.service";
import { HashtagLinkService } from "./hashtag-link.service";

@Module({
	providers: [HashtagService, HashtagLinkService],
	exports: [HashtagService, HashtagLinkService],
})
export class HashtagModule {}
