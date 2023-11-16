import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class Hashtag extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	name: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}
