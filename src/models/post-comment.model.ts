import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class PostComment extends Model {
  
    @Column({primaryKey: true})
    id : UUID

    @Column
    post_id : UUID

    @Column
    content : string
}