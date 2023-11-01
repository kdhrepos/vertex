import { UUID } from "crypto";
import { Table, Column, Model, IsEmail } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class User extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	provider_id: string;

	@Column({ allowNull: true })
	password: string;

	@IsEmail
	@Column({ unique: true })
	email: string;

	@Column
	name: string;

	@Column
	channel_name: string;

	@Column({ allowNull: true })
	profile_image_path: string;

	@Column({ allowNull: true })
	description: string;

	// Relationship
}
