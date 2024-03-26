import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from 'typeorm';
import { Dog } from '.';
import { OrderSize } from '@/enums';

@Entity({ name: 'user' })
export default class User {
  @PrimaryColumn()
  id!: string; // saleor user id

  @Column({ type: 'int' })
  orderSize!: OrderSize;

  @OneToMany(() => Dog, (dog) => dog.user)
  dogs!: Relation<Dog>[];
}
