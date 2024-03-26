import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from 'typeorm';
import { DogOrder } from '.';
import { OrderSize } from '@/enums';

@Entity({ name: 'order' })
export default class Order {
  @PrimaryColumn()
  id!: string; // saleor order id

  @Column({ type: 'int' })
  orderSize!: OrderSize;

  @Column()
  deliveryDate!: Date;

  @Column()
  createdAt!: Date;

  @OneToMany(() => DogOrder, (dog) => dog.order)
  dogs!: Relation<DogOrder>[];
}
