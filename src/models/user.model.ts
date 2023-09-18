import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {

    @Column({primaryKey : true})
    id : UUID

    @Column
    password : string

    @Column
    email : string

    @Column
    name : string

    @Column({allowNull : true})
    profile_image_path : string

    @Column
    description : string
}