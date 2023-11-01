import { IsString, IsNumber, IsOptional } from "class-validator";

export class SubscriptionDto {
	@IsString()
	userId: string;

	@IsString()
	creatorId: string;
}
