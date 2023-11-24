import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import * as bcrypt from "bcrypt";

import { User } from "src/model/user.model";
import { DeleteUserDto } from "src/user/dto/delete-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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

	async createUser(createUserDto: CreateUserDto, profileImagePath: string) {
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
			console.log(deleteUserDto);
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

	async updateGoogleUser(email:string, updateUserDto: UpdateUserDto) {
		const functionName = UserService.prototype.updateGoogleUser.name;
		try {
			const { description } = updateUserDto;
			this.userModel.update(
				{
					description: description,
				},
				{
					where:{
						email: email
					}
				}
			);
			return await this.userModel.findOne({
				where: {
					email: email,
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} :  ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateLocalUser(email: string, updateUserDto: UpdateUserDto){
		const functionName = UserService.prototype.updateLocalUser.name;
		try {
			const { password, description } = updateUserDto;
			this.userModel.update(
				{
					password: password,
					description: description,
				},
				{
					where:{
						email: email
					}
				}
			);
			return await this.userModel.findOne({
				where: {
					email: email,
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} :  ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
