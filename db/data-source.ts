import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'], // Automatically find entities
  synchronize: false, // We will use migrations
  migrations: ['dist/db/migrations/*.js'], // Path for migration files
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
