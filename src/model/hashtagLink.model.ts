import {
	Table,
	Column,
	Model,
	BelongsTo,
	BelongsToMany,
} from "sequelize-typescript";
import { Video } from "./video.model";
import { Post } from "./post.model";
import { Hashtag } from "./hashtag.model";

@Table({ freezeTableName: true })
export class HashtagLink extends Model {
	// Columns;
	@Column({
		primaryKey: true,
	})
	contents_id: string;

	@Column({
		primaryKey: true,
	})
	hashtag_id: number;

	@Column
	is_video: boolean;

	// Relationship
	// @BelongsTo(() => Hashtag, "hashtag_id")
	// hashtag: Hashtag[];

	// @BelongsTo(() => Post || Video)
	// contents: Model;
}
