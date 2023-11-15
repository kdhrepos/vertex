import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
} from "sequelize-typescript";
import { Video } from "./video.model";
import { User } from "./user.model";

@Table({ freezeTableName: true })
export class VideoRecord extends Model {
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
	video_id: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}
