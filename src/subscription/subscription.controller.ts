import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Session,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
	constructor(private subscriptionService: SubscriptionService) {}

	@ApiOperation({ description: "구독 목록 요청" })
	@Get("/list")
	async findSubscriptionList(@Query("email") email: string) {
		return await this.subscriptionService.findAll(email);
	}

	@ApiOperation({ description: "구독한 채널의 모든 컨텐츠를 최신 순으로 요청" })
	@Get("/contents")
	async findContentsList(
		@Query("userId") userId: string,
		@Query("page") page: number,
	) {
		return await this.subscriptionService.findContents(userId, page);
	}

	@ApiOperation({ description: "채널에 대한 구독 확인" })
	@Get("/check")
	async subscribeCheck(
		@Query("userId") userId: string,
		@Query("channelId") channelId: string,		
	) {
		return await this.subscriptionService.findOne(channelId, userId);
	}
	
	@ApiOperation({ description: "채널에 대한 구독 요청" })
	@Post("/subscribe")
	async subscribe(
		@Body("userId") userId: string,
		@Body("channelId") channelId: string,
	) {
		return await this.subscriptionService.create(userId, channelId);
	}

	@ApiOperation({ description: "채널에 대한 구독 취소" })
	@Post("/unsubscribe")
	async unsubscribe(
		@Body("userId") userId: string,
		@Body("channelId") channelId: string,
	) {
		return await this.subscriptionService.delete(userId, channelId);
	}
}
