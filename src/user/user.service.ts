import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/model/user.model";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {}

	async findByEmailOrSave(
		email: any,
		username: any,
		providerId: any,
	): Promise<any> {
		const foundUser = await this.userModel.findOne({
			where: {
				email: email,
			},
		});

		if (foundUser) {
			return foundUser;
		}

		const newUser = await this.userModel.create({
			provider_id: providerId,
			email: email,
			name: username,
		});

		return newUser;
	}

	async getUser(email: string) {
		console.log(email);

		const result = await this.userModel.findOne({
			where: {
				email: email,
			},
		});

		return result;
	}
}
