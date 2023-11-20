import {
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
import { VideoService } from "src/video/video.service";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
	constructor(private subscriptionService: SubscriptionService) {}

	@ApiOperation({ description: "구독 목록 요청" })
	@UseGuards(AuthenticatedGuard)
	@Get("/list")
	async findSubscriptionList(@Session() session: any) {
		return await this.subscriptionService.findAll(session);
	}

	@ApiOperation({ description: "구독한 채널의 모든 컨텐츠를 최신 순으로 요청" })
	@UseGuards(AuthenticatedGuard)
	@Get("/contents")
	async findContentsList(@Query("page") page: number, @Session() session: any) {
		return await this.subscriptionService.findContents(session, page);
	}

	@ApiOperation({ description: "채널에 대한 구독 요청" })
	@UseGuards(AuthenticatedGuard)
	@Post("/subscribe")
	async subscribe(
		@Query("channelId") channelId: string,
		@Session() session: any,
	) {
		return await this.subscriptionService.create(channelId, session);
	}

	@ApiOperation({ description: "채널에 대한 구독 취소" })
	@UseGuards(AuthenticatedGuard)
	@Delete("/unsubscribe")
	async unsubscribe(
		@Query("channelId") channelId: string,
		@Session() session: any,
	) {
		return await this.subscriptionService.delete(channelId, session);
	}
}
