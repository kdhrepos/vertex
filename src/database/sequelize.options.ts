import { SequelizeModuleOptions } from "@nestjs/sequelize";

export const sequelizeOptions: SequelizeModuleOptions = {
	dialect: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "qwe123",
	database: "vertex",
	autoLoadModels: true,
	timezone: "Asia/Seoul",
	synchronize: true,
	// sync: { alter: true },
	// sync: { force: true },
};
