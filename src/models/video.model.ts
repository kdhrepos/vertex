import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Video extends Model {
  
    @Column({primaryKey : true})
    id : UUID

    @Column
    user_id : UUID

    @Column
    thumbnail_image_path : string

    @Column
    video_path : string

    @Column
    title : string

    @Column({allowNull : true})
    description : string 

    @Column({defaultValue : 0})
    like_count : number

    @Column({defaultValue : 0})
    view_count : number

    @Column({defaultValue : false})
    is_deleted : boolean

}