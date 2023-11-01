import { Module } from "@nestjs/common";

import { HashtagService } from "./hashtag.service";
import { HashtagLinkService } from "./hashtag-link.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Hashtag } from "src/model/hashtag.model";
import { HashtagLink } from "src/model/hashtagLink.model";

@Module({
	// imports: [SequelizeModule.forFeature([Hashtag, HashtagLink])],
	// providers: [HashtagService, HashtagLinkService],
	// exports: [HashtagService, HashtagLinkService],
})
export class HashtagModule {}
