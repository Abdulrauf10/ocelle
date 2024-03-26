import 'reflect-metadata';
import dotenv from 'dotenv';
import {
  Breed,
  Career,
  CareerLine,
  CareerSubmission,
  Dog,
  DogBreed,
  DogOrder,
  DogPlan,
  DogRecurringRecord,
  Order,
  User,
} from '@/entities';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Initial1711481961068 } from '@/migrations/1711481961068-initial';

dotenv.config();

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
  entities: [
    Breed,
    Career,
    CareerLine,
    CareerSubmission,
    Dog,
    DogBreed,
    DogOrder,
    DogPlan,
    DogRecurringRecord,
    Order,
    User,
  ],
  migrations: [Initial1711481961068],
});

export default MySQL;
