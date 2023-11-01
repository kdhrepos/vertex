import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class KeywordService {
	private readonly logger = new Logger("Keyword Service");
}
