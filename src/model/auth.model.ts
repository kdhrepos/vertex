import {
	Table,
	Column,
	Model,
	IsEmail,
	ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";
@Table({ freezeTableName: true })
export class Auth extends Model {
    @ForeignKey(() => User)
	@IsEmail
	@Column({ primaryKey: true })
	email: string;

	@Column({ allowNull: true })
	token: string;

    @Column
    ttl: number;
}