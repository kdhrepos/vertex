import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { HashtagLink } from "src/model/hashtagLink.model";

@Injectable()
export class HashtagLinkService {
	constructor(
		@InjectModel(HashtagLink) private hashtagLinkModel: typeof HashtagLink,
	) {}

	private readonly logger = new Logger("HashtagLink Service");
}
