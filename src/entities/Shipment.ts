import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Dog, RecurringBox, User } from '.';

@Entity({ name: 'shipment' })
export default class Shipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  editableDeadline!: Date; // after the deadline, not more changes will be apply to the shipment

  @Column()
  deliveryDate!: Date;

  @Column({ nullable: true })
  trackingCode?: string;

  @OneToOne(() => RecurringBox, (record) => record.shipment)
  box?: Relation<RecurringBox>; // null before the box has not yet been ordered

  @ManyToOne(() => User, (user) => user.shipements)
  user!: Relation<User>;

  @ManyToOne(() => Dog, (dog) => dog.shipements)
  dog!: Relation<Dog>;
}
