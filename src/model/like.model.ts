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
	@ForeignKey(() => User)
	@Column({
		primaryKey: true,
	})
	user_email: string;

	@ForeignKey(() => Video)
	@Column({
		primaryKey: true,
	})
	contents_id: string;

	// Relationships
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => Video || Post, "contents_id")
	contents: Video;
	// contents: Video || Post;
}
