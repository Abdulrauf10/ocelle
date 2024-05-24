import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  Breed,
  Career,
  CareerLine,
  Dog,
  DogBreed,
  DogPlan,
  Order,
  RecurringBox,
  Shipment,
  User,
} from '@/entities';
import { Initial1716538994073 } from '@/migrations/1716538994073-initial';

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
    Dog,
    DogBreed,
    DogPlan,
    Order,
    RecurringBox,
    Shipment,
    User,
  ],
  migrations: [Initial1716538994073],
});

export default MySQL;
