import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from 'typeorm';
import { Dog, Shipment } from '.';
import { OrderSize } from '@/enums';

@Entity({ name: 'user' })
export default class User {
  @PrimaryColumn()
  id!: string; // saleor user id

  @Column()
  phone!: string; // saleor don't have phone field, fix in database model

  @Column({ type: 'int' })
  orderSize!: OrderSize;

  @Column()
  isDeliveryUsAsBillingAddress!: boolean;

  @Column({ nullable: true })
  stripe?: string; // linked stripe customer id

  @Column({ nullable: true })
  stripePaymentMethod?: string; // linked stripe payment method id

  @OneToMany(() => Dog, (dog) => dog.user)
  dogs!: Relation<Dog>[];

  @OneToMany(() => Shipment, (shipment) => shipment.user)
  shipements!: Relation<Shipment>[];
}
