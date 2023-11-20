import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";
import { Subscription } from "src/model/subscription.model";
import { User } from "src/model/user.model";
import { Video } from "src/model/video.model";

@Injectable()
export class SubscriptionService {
	constructor(
		@InjectModel(Subscription) private subscriptionModel: typeof Subscription,
		@InjectModel(Video) private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Subscription Service");

	async findAll(session: any) {
		const functionName = SubscriptionService.prototype.create.name;
		try {
			const { user: email } = session.passport;

			return await this.subscriptionModel.findAll({
				where: {
					user_email: email,
				},
				attributes: [],
				order: ["createdAt", "DESC"],
				include: {
					model: User,
					as: "channel",
					attributes: ["name", "email"],
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findContents(session: any, page: number) {
		const functionName = SubscriptionService.prototype.findContents.name;
		try {
			const { user: email } = session.passport;

			const subscriptionList = await this.subscriptionModel.findAll({
				where: {
					user_email: email,
				},
				attributes: ["channel_email"],
				include: [
					{
						model: User,
						as: "channel",
						attributes: ["name", "email"],
						order: ["createdAt", "DESC"],
						include: [
							{
								model: Video,
								as: "video",
							},
						],
					},
				],
				raw: true,
			});

			return subscriptionList;
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(channelId: string, session: any) {
		const functionName = SubscriptionService.prototype.create.name;
		try {
			const { user: email } = session.passport;

			// 자기 자신 구독 불가
			if (email === channelId) {
				this.logger.error(`${functionName} : Self Subscription Error`);
				return new HttpException(
					"Self Subscription Error",
					HttpStatus.BAD_REQUEST,
				);
			}

			await this.subscriptionModel.create({
				user_email: email,
				channel_email: channelId,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(channelId: string, session: any) {
		const functionName = SubscriptionService.prototype.delete.name;
		try {
			const { user: email } = session.passport;

			await this.subscriptionModel.destroy({
				where: {
					user_email: email,
					channel_email: channelId,
				},
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
