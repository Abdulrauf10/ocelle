import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { RecurringBox } from '.';

@Entity({ name: 'shipment' })
export default class Shipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  lockBoxDate!: Date;

  @Column()
  deliveryDate!: Date;

  @OneToMany(() => RecurringBox, (record) => record.shipment)
  boxs!: Relation<RecurringBox>[];
}
