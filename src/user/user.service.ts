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

	async getUserByEmail(email: string) {
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

	async getUserByName(name: string) {
		const result = await this.userModel.findOne({
			where: {
				name: name,
			},
			raw: true,
		});

		if (!result) {
			return null;
		}

		return result;
	}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const { email, name, password, description, gender, birthday } =
				createUserDto;

			const createdUser = await this.userModel.create({
				email: email,
				password: bcrypt.hashSync(password, 12),
				name: name,
				gender: gender,
				birthday: birthday,
				description: description == null ? null : description,
			});
			delete createdUser.dataValues.password;

			return createdUser;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteUser(deleteUserDto: DeleteUserDto) {
		try {
			const { email, password } = deleteUserDto;

			const existedUser = await this.userModel.findOne({
				where: { email: email },
				raw: true,
			});

			if (!existedUser) {
				throw new HttpException(`Wrong Email`, HttpStatus.BAD_REQUEST);
			}

			if (!bcrypt.compareSync(password, existedUser.password)) {
				throw new HttpException(`Wrong Password`, HttpStatus.BAD_REQUEST);
			}

			// 일반 로그인은 여기서 삭제
			await this.userModel.destroy({
				where: {
					email: existedUser.email,
				},
			});

			return true;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateUser(updateUserDto: UpdateUserDto,profileImagePath:string,channelImagePath:string) {
		try {
			const {email, name, description}=updateUserDto

			const user = await this.userModel.findByPk(email);

			if(name !== null)
				user.name = name;

			if(description !== null)
				user.description=description;

			user.save();
			
			return {
				statusCode :200,
				message : "User successfully updated!"
			}
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
