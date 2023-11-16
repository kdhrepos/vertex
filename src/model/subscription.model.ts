import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({ freezeTableName: true })
export class Subscription extends Model {
	// Columns
	@ForeignKey(() => User)
	@Column({ primaryKey: true })
	user_email: string;

	@ForeignKey(() => User)
	@Column({ primaryKey: true })
	channel_email: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User[];

	/* Has */
}
