import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Subscription } from "src/model/subscription.model";

@Injectable()
export class SubscriptionService {
	constructor(
		@InjectModel(Subscription) private subscriptionModel: typeof Subscription,
	) {}

	private readonly logger = new Logger("Subscription Service");

	async findAll() {}

	async create() {}

	async delete() {}
}
