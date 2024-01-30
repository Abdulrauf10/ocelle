import 'reflect-metadata';
import dotenv from 'dotenv';
import { Breed, Career, CareerLine, CareerSubmission } from '@/entities';
import { AddBreed1705277954625 } from '@/migrations/1705277954625-addBreed';
import { AddCareer1706548168642 } from '@/migrations/1706548168642-addCareer';
import { AddCareerLine1706549547562 } from '@/migrations/1706549547562-addCareerLine';
import { AddCareerSubmission1706550641571 } from '@/migrations/1706550641571-addCareerSubmission';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  entities: [Breed, Career, CareerLine, CareerSubmission],
  migrations: [
    AddBreed1705277954625,
    AddCareer1706548168642,
    AddCareerLine1706549547562,
    AddCareerSubmission1706550641571,
  ],
});

export default MySQL;
