import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Subscription } from "src/model/subscription.model";
import { Video } from "src/model/video.model";

@Module({
	imports: [SequelizeModule.forFeature([Subscription, Video])],
	controllers: [SubscriptionController],
	providers: [SubscriptionService],
})
export class SubscriptionModule {}
