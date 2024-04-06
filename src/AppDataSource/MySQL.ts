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
import { AddBreedUid1711599966809 } from '@/migrations/1711599966809-add-breed-uid';
import { RemoveBreedZhName1711601291423 } from '@/migrations/1711601291423-remove-breed-zh-name';
import { AddIsDeliveryUsAsBillingAddress1712442568405 } from '@/migrations/1712442568405-addIsDeliveryUsAsBillingAddress';

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
  migrations: [
    Initial1711481961068,
    AddBreedUid1711599966809,
    RemoveBreedZhName1711601291423,
    AddIsDeliveryUsAsBillingAddress1712442568405,
  ],
});

export default MySQL;
