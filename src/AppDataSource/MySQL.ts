import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  Breed,
  Career,
  CareerLine,
  CareerSubmission,
  Dog,
  DogBreed,
  DogPlan,
  Order,
  RecurringBox,
  Shipment,
  User,
} from '@/entities';
import { Initial1712556909513 } from '@/migrations/1712556909513-initial';
import { StripeIntegration1713263142208 } from '@/migrations/1713263142208-stripe-integration';
import { AddLockBoxDate1713677342953 } from '@/migrations/1713677342953-add-lock-box-date';
import { RemoveLockDateDefaultValue1713677413178 } from '@/migrations/1713677413178-remove-lock-date-default-value';
import { AddShipmentUserId1714285714324 } from '@/migrations/1714285714324-add-shipment-user-id';
import { DropLastDeliveryDate1714285758775 } from '@/migrations/1714285758775-drop-last-delivery-date';
import { AddOrderUserId1714286728753 } from '@/migrations/1714286728753-add-order-user-id';

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
    DogPlan,
    Order,
    RecurringBox,
    Shipment,
    User,
  ],
  migrations: [
    Initial1712556909513,
    StripeIntegration1713263142208,
    AddLockBoxDate1713677342953,
    RemoveLockDateDefaultValue1713677413178,
    AddShipmentUserId1714285714324,
    DropLastDeliveryDate1714285758775,
    AddOrderUserId1714286728753,
  ],
});

export default MySQL;
