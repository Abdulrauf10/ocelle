import { Breed } from '@/entities';
import { AddBreed1705277954625 } from '@/migrations/1705277954625-addBreed';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const MySQL = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'ocelle',
  connectorPackage: 'mysql2',
  timezone: 'Z',
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [Breed],
  migrations: [AddBreed1705277954625],
});

export default MySQL;
