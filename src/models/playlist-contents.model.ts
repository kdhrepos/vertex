import { UUID } from 'crypto';
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class PlaylistContents extends Model {
    
  @Column({primaryKey: true})
  video_id : UUID

  @Column
  playlist_id : UUID
}