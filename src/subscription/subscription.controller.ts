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
	@UseGuards(AuthenticatedGuard)
	@Get("/list")
	async findSubscriptionList(@Query("userId") userId: string) {
		return await this.subscriptionService.findAll(userId);
	}

	@ApiOperation({ description: "구독한 채널의 모든 컨텐츠를 최신 순으로 요청" })
	@UseGuards(AuthenticatedGuard)
	@Get("/contents")
	async findContentsList(
		@Query("userId") userId: string,
		@Query("page") page: number,
	) {
		return await this.subscriptionService.findContents(userId, page);
	}

	@ApiOperation({ description: "채널에 대한 구독 요청" })
	@UseGuards(AuthenticatedGuard)
	@Post("/subscribe")
	async subscribe(
		@Body("userId") userId: string,
		@Body("channelId") channelId: string,
	) {
		return await this.subscriptionService.create(channelId, userId);
	}

	@ApiOperation({ description: "채널에 대한 구독 취소" })
	@UseGuards(AuthenticatedGuard)
	@Post("/unsubscribe")
	async unsubscribe(
		@Body("userId") userId: string,
		@Body("channelId") channelId: string,
	) {
		return await this.subscriptionService.delete(channelId, userId);
	}
}
