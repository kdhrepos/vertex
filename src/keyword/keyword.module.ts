import { Module } from "@nestjs/common";
import { KeywordService } from "./keyword.service";
import { KeywordController } from "./keyword.controller";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
	imports: [SequelizeModule.forFeature([])],
	providers: [KeywordService],
	controllers: [KeywordController],
})
export class KeywordModule {}
