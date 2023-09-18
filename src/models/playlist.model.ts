import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Playlist extends Model {
  
    @Column({primaryKey : true})
    id : UUID

    @Column
    user_id : UUID
    
    @Column
    list_name : string
}