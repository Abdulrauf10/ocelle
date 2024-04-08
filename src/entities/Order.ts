import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from 'typeorm';
import { RecurringBox } from '.';

@Entity({ name: 'order' })
export default class Order {
  @PrimaryColumn()
  id!: string; // saleor order id

  @Column()
  createdAt!: Date;

  @OneToMany(() => RecurringBox, (record) => record.order)
  boxs!: Relation<RecurringBox>;
}
