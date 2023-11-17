import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
	BelongsToMany,
} from "sequelize-typescript";
import { Video } from "./video.model";
import { User } from "./user.model";

@Table({ freezeTableName: true })
export class Record extends Model {
	// Columns
	@ForeignKey(() => User)
	@Column({
		primaryKey: true,
		onDelete: "CASCADE",
	})
	user_email: string;

	@ForeignKey(() => Video)
	@Column({
		primaryKey: true,
		onDelete: "CASCADE",
	})
	video_id: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	// @BelongsTo(() => Video)
	// video: Video;
	/* Has */
}
