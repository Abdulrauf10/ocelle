import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from 'typeorm';

import { RecurringBox, User } from '.';

@Entity({ name: 'order' })
export default class Order {
  @PrimaryColumn()
  id!: string; // saleor order id

  @Column()
  createdAt!: Date;

  @OneToMany(() => RecurringBox, (record) => record.order)
  boxs!: Relation<RecurringBox>[];

  @ManyToOne(() => User, (user) => user.orders)
  user!: Relation<User>;
}
