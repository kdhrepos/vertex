import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Module({})
export class RedisModule {
	providers: [RedisService];
}
