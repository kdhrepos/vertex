import { UUID } from "crypto";
import { Table, Column, Model, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ freezeTableName: true })
export class Subscription extends Model {
	// Columns
	@Column({
		primaryKey: true,
	})
	user_email: string;

	@Column
	channel_email: string;

	// Relationship
	// @BelongsTo(() => User, "user_email")
	// user: User;

	// @BelongsTo(() => User, "user_email")
	// user: User;
}
