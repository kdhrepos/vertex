import { Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
	constructor(private subscriptionService: SubscriptionService) {}

	@ApiOperation({ description: "구독 목록 요청" })
	@Get(":user_id")
	findSubscriptionList() {}

	@ApiOperation({ description: "구독한 컨텐츠 요청" })
	@Get(":user_id/contents")
	findContentsList() {}

	@ApiOperation({ description: "구독 요청" })
	@Post(":creator_id")
	subscribeChannel() {}

	@ApiOperation({ description: "구독 취소" })
	@Delete(":creator_id")
	unsubscribeChannel() {}
}
