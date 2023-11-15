import { UUID } from "crypto";
import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Video } from "./video.model";
import { Post } from "./post.model";

@Table({ freezeTableName: true })
export class Like extends Model {
	// Columns
	// @ForeignKey(() => User)
	@Column({
		primaryKey: true,
	})
	user_email: string;

	// @ForeignKey(() => Video)
	@Column({
		primaryKey: true,
	})
	contents_id: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}
