import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Subscription extends Model {
  // Columns
	@Column({ primaryKey: true })
	user_id: UUID;

	@Column
	channel_id: UUID;

  // Relationship
}
