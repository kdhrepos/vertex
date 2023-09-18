import { Sequelize } from 'sequelize-typescript';
import { Post } from 'src/models/post.model';
import { Video } from 'src/models/video.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: '165.229.86.164',
        port: 8194,
        username: 'root',
        password: 'qwer1234',
        database: 'vertex',
      });
      sequelize.addModels([Video,Post]);
      await sequelize.sync();
      // await sequelize.sync({alter : true});
      // await sequelize.sync({force : true});


      return sequelize;
    },
  },
  // put redis database here
];