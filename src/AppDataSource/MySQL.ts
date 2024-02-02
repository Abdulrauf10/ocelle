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
  Order,
  SaleorUser,
} from '@/entities';
import { AddBreed1705277954625 } from '@/migrations/1705277954625-addBreed';
import { AddCareer1706548168642 } from '@/migrations/1706548168642-addCareer';
import { AddCareerLine1706549547562 } from '@/migrations/1706549547562-addCareerLine';
import { AddCareerSubmission1706550641571 } from '@/migrations/1706550641571-addCareerSubmission';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AddSaleorUser1706840627042 } from '@/migrations/1706840627042-addSaleorUser';
import { AddDog1706840744384 } from '@/migrations/1706840744384-addDog';
import { AddDogPlan1706847695735 } from '@/migrations/1706847695735-addDogPlan';
import { AddOrder1706848585764 } from '@/migrations/1706848585764-addOrder';

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
    Order,
    SaleorUser,
  ],
  migrations: [
    AddBreed1705277954625,
    AddCareer1706548168642,
    AddCareerLine1706549547562,
    AddCareerSubmission1706550641571,
    AddDog1706840744384,
    AddDogPlan1706847695735,
    AddOrder1706848585764,
    AddSaleorUser1706840627042,
  ],
});

export default MySQL;
