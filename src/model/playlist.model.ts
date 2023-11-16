import { Table, Column, Model, BelongsTo, HasMany } from "sequelize-typescript";
import { User } from "./user.model";
import { PlaylistContents } from "./playlist-contents.model";

@Table({ freezeTableName: true })
export class Playlist extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@Column({})
	user_email: string;

	@Column
	list_name: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}
