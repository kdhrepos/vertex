import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "../user/subscription.service";
import { SubscriptionDto } from "./dto/subscription.dto";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
	constructor(private subscriptionService: SubscriptionService) {}

	@ApiOperation({ description: "구독 목록 요청" })
	@Get(":user_id")
	findSubscriptionList(@Param() userId: string) {}

	@ApiOperation({ description: "구독한 컨텐츠 요청" })
	@Get(":user_id/contents")
	findContentsList(@Param() userId: string) {}

	@ApiOperation({ description: "구독 요청" })
	@Post("/subscribe")
	subscribeChannel(@Query() subscriptionDto: SubscriptionDto) {}

	@ApiOperation({ description: "구독 취소" })
	@Delete("/unsubscribe")
	unsubscribeChannel(@Query() subscriptionDto: SubscriptionDto) {}
}
