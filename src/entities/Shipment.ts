import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { RecurringBox, User } from '.';

@Entity({ name: 'shipment' })
export default class Shipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'lock_box_date' })
  editableDeadline!: Date; // after the deadline, not more changes will be apply to the shipment

  @Column()
  deliveryDate!: Date;

  @OneToMany(() => RecurringBox, (record) => record.shipment)
  boxs!: Relation<RecurringBox>[];

  @ManyToOne(() => User, (user) => user.shipements)
  user!: Relation<User>;
}
