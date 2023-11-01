import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Hashtag } from "src/model/hashtag.model";

@Injectable()
export class HashtagService {
	constructor(@InjectModel(Hashtag) private hashtagModel: typeof Hashtag) {}

	private readonly logger = new Logger("Hashtag Service");
}
