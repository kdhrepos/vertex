import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Subscription extends Model {

  @Column({primaryKey : true})
  user_id : UUID

  @Column
  channel_id : UUID
}