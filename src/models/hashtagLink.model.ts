import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class HashtagLink extends Model {
  
    @Column({primaryKey : true})
    contents_id : UUID

    @Column({primaryKey : true})
    hashtag_id : UUID

    @Column
    is_video : boolean
}