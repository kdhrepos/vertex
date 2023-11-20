import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import * as bcrypt from "bcrypt";

import { User } from "src/model/user.model";
import { DeleteUserDto } from "src/auth/dto/delete-user.dto";

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
				where: {
					email: email,
				},
				raw: true,
			});

			if (duplicatedUser) {
				this.logger.error(`${functionName} : Duplicated Email`);
				return new HttpException("Duplicated Email", HttpStatus.BAD_REQUEST);
			}

			const profileImagePath =
				profileImage === null || profileImage === undefined
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
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteUser(deleteUserDto: DeleteUserDto) {
		const functionName = UserService.prototype.deleteUser.name;
		try {
			const { email, password } = deleteUserDto;

			const existedUser = await this.userModel.findOne({
				where: { email: email },
				raw: true,
			});

			if (!existedUser) {
				this.logger.error(`${functionName} : Wrong Email`);
				return new HttpException("Wrong Email", HttpStatus.BAD_REQUEST);
			}

			// 소셜 로그인은 여기서 삭제
			if (existedUser.provider_id) {
				/*
				유저가 생성했던 비디오, post 모두 deleted 상태로 돌려야 함
				*/
				await this.userModel.destroy({
					where: {
						email: existedUser.email,
					},
				});
				return true;
			}

			if (!bcrypt.compareSync(password, existedUser.password)) {
				this.logger.error(`${functionName} : Wrong Password`);
				return new HttpException("Wrong Password", HttpStatus.BAD_REQUEST);
			}

			// 일반 로그인은 여기서 삭제
			/*
				유저가 생성했던 비디오, post 모두 deleted 상태로 돌려야 함
			*/
			await this.userModel.destroy({
				where: {
					email: existedUser.email,
				},
			});

			return true;
		} catch (error) {
			this.logger.error(`${functionName} :  ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
