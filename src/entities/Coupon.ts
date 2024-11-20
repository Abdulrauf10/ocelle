import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { User } from '.';

@Entity({ name: 'coupon' })
export default class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  saleorCouponId!: string;

  @ManyToOne(() => User, (user) => user.coupons)
  user!: Relation<User>;
}
