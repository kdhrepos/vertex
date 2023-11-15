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
	@ForeignKey(() => User)
	@Column({
		primaryKey: true,
		references: {
			model: User,
			key: "email",
		},
	})
	user_email: string;

	@ForeignKey(() => Video)
	@Column({
		primaryKey: true,
		references: {
			model: Video,
			key: "video_path",
		},
	})
	video_id: string;

	// Relationship
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => Video, "video_id")
	video: Video;
}
