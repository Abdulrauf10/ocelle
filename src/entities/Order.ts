import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dog, DogOrder } from '.';
import { OrderSize } from '@/enums';

@Entity({ name: 'order' })
export default class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orderSize: OrderSize;

  @Column()
  deliveryDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  saleorId: string;

  @OneToMany(() => DogOrder, (dog) => dog.order)
  dogs: DogOrder[];
}
