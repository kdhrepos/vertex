import {
	Table,
	Column,
	Model,
	BelongsToMany,
	ForeignKey,
	HasMany,
} from "sequelize-typescript";
import { Video } from "./video.model";
import { Post } from "./post.model";
import { Like } from "./like.model";
import { Subscription } from "./subscription.model";

@Table({ freezeTableName: true })
export class User extends Model {
	@ForeignKey(() => User)
	@Column({ primaryKey: true })
	email: string;

	@Column({ allowNull: true })
	provider_id: string;

	@Column({ allowNull: true })
	password: string;

	@Column({ allowNull: false })
	name: string;

	@Column({ allowNull: true })
	profile_image_path: string;

	@Column({ allowNull: true })
	channel_image_path: string;

	@Column({ allowNull: true })
	description: string;

	@Column({ allowNull: true })
	gender: string;

	@Column({ allowNull: true })
	birthday: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsToMany(() => User, () => Subscription, "user_email")
	userSub: Subscription;

	@BelongsToMany(() => User, () => Subscription, "channel_email")
	channelSub: Subscription;

	/* Has */
	@HasMany(() => Video)
	video: Video;

	@HasMany(() => Post)
	post: Post;
}
