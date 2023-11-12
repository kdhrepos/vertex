import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import * as bcrypt from "bcrypt";

import { User } from "src/model/user.model";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {}

	private logger: Logger = new Logger("User Service");

	async findByEmailOrSave(
		email: any,
		username: any,
		providerId: any,
	): Promise<any> {
		const foundUser = await this.userModel.findOne({
			where: {
				email: email,
			},
			raw: true,
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
		const result = await this.userModel.findOne({
			where: {
				email: email,
			},
			raw: true,
		});

		if (!result) {
			return null;
		}

		return result;
	}

	async createUser(
		createUserDto: CreateUserDto,
		profileImage: Express.Multer.File,
	) {
		const functionName = UserService.prototype.createUser.name;
		try {
			const { email, name, password, description } = createUserDto;

			const duplicatedUser = await this.userModel.findOne({
				where: { email: email },
				raw: true,
			});

			if (duplicatedUser) {
				this.logger.error(`${functionName} : Duplicated Email`);
				throw new HttpException("Duplicated Email", HttpStatus.BAD_REQUEST);
			}

			const profileImagePath =
				profileImage === null
					? null
					: `profile-${email}-${profileImage.originalname}`;

			const createdUser = await this.userModel.create({
				email: email,
				name: name,
				password: bcrypt.hashSync(password, 12),
				description: description == null ? null : description,
				profile_image_path: profileImagePath,
			});
			delete createdUser.dataValues.password;

			return createdUser;
		} catch (error) {
			this.logger.error(`${functionName} :  ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
