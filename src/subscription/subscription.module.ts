import { Module } from "@nestjs/common";
import { SubscriptionService } from "../user/subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Subscription } from "src/model/subscription.model";

@Module({
	imports: [SequelizeModule.forFeature([Subscription])],
	controllers: [SubscriptionController],
	providers: [SubscriptionService],
})
export class SubscriptionModule {}
