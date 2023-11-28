import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Hashtag } from "src/model/hashtag.model";
import { HashtagLink } from "src/model/hashtagLink.model";

@Injectable()
export class HashtagService {
	constructor(
		@InjectModel(Hashtag) private hashtagModel: typeof Hashtag,
		@InjectModel(HashtagLink) private hashtagLinkModel: typeof HashtagLink,
	) {}

	async create() {}

	async createLink() {}

	async deleteLink() {}
}
