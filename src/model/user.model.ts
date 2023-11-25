import {
	Table,
	Column,
	Model,
	IsEmail,
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
	@IsEmail
	@Column({ primaryKey: true })
	email: string;

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

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsToMany(() => User, () => Subscription, "user_email")
	userSub: Subscription;

	@BelongsToMany(() => User, () => Subscription, "channel_email")
	channelSub: Subscription;

	@BelongsToMany(() => Video, () => Like, "user_email")
	videoLike: Like;

	@BelongsToMany(() => Post, () => Like, "user_email")
	postLike: Like;

	/* Has */
	@HasMany(() => Video)
	video: Video;

	@HasMany(() => Post)
	post: Post;
}
