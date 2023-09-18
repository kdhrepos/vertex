import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class VideoComment extends Model {
  
    @Column({primaryKey : true})
    id : UUID
    
    @Column
    video_id : UUID

    @Column
    user_id : UUID

    @Column({allowNull : true})
    parent_id : UUID

    @Column
    content : string
}