import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Subscription } from "src/model/subscription.model";
import { User } from "src/model/user.model";
import { Video } from "src/model/video.model";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription) private subscriptionModel: typeof Subscription,
    @InjectModel(Video) private videoModel: typeof Video
  ) {}

	async findAll(userId: string) {
		try {
			const subscriptionList = await this.subscriptionModel.findAll({
				where: {
					user_email: userId,
				},
				include: {
					model: User,
					as: "channel",
					attributes: ["name", "email"],
				},
				order: [["createdAt", "DESC"]],
				raw: true,
			});
			return {
				data: subscriptionList,
				statusCode: 200,
				message: "Subscription lists are sucessfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	async findOne(channelId: string, userId: string) {
		try {
			const subscribeData = await this.subscriptionModel.findOne({
				where: {
					user_email: userId,
					channel_email: channelId
				}
			})
			if (subscribeData) {
				return true;
			}
			return false;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	async findContents(email: string, page: number) {
		try {
			const contentsList = await this.subscriptionModel.findAll({
				where: {
					user_email: email,
				},
				attributes: ["channel_email"],
				include: [
					{
						model: User,
						as: "channel",
						attributes: ["name", "email"],
						include: [
							{
								model: Video,
								as: "video", 
							},
						],
						order: [["createdAt", "DESC"]],
					},
				],
				offset:page * 12,
				limit : 12,
			});

      return {
        data: contentsList,
        statusCode: 200,
        message: "Contents are sucessfully found",
      };
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userId: string, channelId: string) {
    try {
      // 자기 자신 구독 불가
      if (userId === channelId) {
        throw new HttpException(
          `Self Subscription Error`,
          HttpStatus.BAD_REQUEST
        );
      }
      const subscription = await this.subscriptionModel.create({
        user_email: userId,
        channel_email: channelId,
      });
      return {
        data: subscription,
        statusCode: 200,
        message: "Sucessfully subscripted",
      };
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(userId: string, channelId: string) {
    const functionName = SubscriptionService.prototype.delete.name;
    try {
      console.log(userId);
      await this.subscriptionModel.destroy({
        where: {
          user_email: userId,
          channel_email: channelId,
        },
      });

      return {
        statusCode: 200,
        message: "Successfully Deleted",
      };
    } catch (error) {
      throw new HttpException(
        `${functionName} : ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
