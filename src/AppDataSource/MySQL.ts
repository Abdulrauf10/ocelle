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
import { UpdateUserPhone1716725173601 } from '@/migrations/1716725173601-update-user-phone';
import { AddReferralCode1730720257700 } from '@/migrations/1730720257700-add-referral-code';

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
  migrations: [Initial1716538994073, UpdateUserPhone1716725173601, AddReferralCode1730720257700],
});

export default MySQL;
