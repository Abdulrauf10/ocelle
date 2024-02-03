import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dog } from '.';
import { OrderSize } from '@/enums';

@Entity({ name: 'saleor_user' })
export default class SaleorUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  orderSize!: OrderSize;

  @Column()
  saleorId!: string;

  @OneToMany(() => Dog, (dog) => dog.user)
  dogs!: Dog[];
}
