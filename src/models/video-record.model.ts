import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class VideoRecord extends Model {
  
    @Column({primaryKey : true})
    user_id : UUID

    @Column
    video_id : UUID

}