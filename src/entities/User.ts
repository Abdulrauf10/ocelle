import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from 'typeorm';

import { Dog, Order, Shipment } from '.';

@Entity({ name: 'user' })
export default class User {
  @PrimaryColumn()
  id!: string; // saleor user id

  @Column({ type: 'simple-json' })
  phone!: { code: string; value: string }; // saleor don't have phone field, fix in database model

  @Column({ type: 'simple-json', nullable: true })
  whatsapp?: { code: string; value: string };

  @Column()
  isDeliveryUsAsBillingAddress!: boolean;

  @Column({ unique: true })
  referralCode!: string;

  @Column({ nullable: true })
  stripe?: string; // linked stripe customer id

  @Column({ nullable: true })
  stripePaymentMethod?: string; // linked stripe payment method id

  @OneToMany(() => Dog, (dog) => dog.user)
  dogs!: Relation<Dog>[];

  @OneToMany(() => Shipment, (shipment) => shipment.user)
  shipements!: Relation<Shipment>[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Relation<Order>[];
}
