import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Hashtag extends Model {
    
  @Column({primaryKey : true})
  id : UUID

  @Column
  name : string
}