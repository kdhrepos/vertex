import { UUID } from "crypto";
import { Table, Column, Model, IsEmail } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class User extends Model {
	@IsEmail
	@Column({ primaryKey: true })
	email: string;

	// Columns
	@Column({ allowNull: true })
	provider_id: string;

	@Column({ allowNull: true })
	password: string;

	@Column
	name: string;

	@Column({ allowNull: true })
	profile_image_path: string;

	@Column({ allowNull: true })
	description: string;

	// Relationship
}
