import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Dog, Order, Shipment } from '.';

import { Frequency, MealPlan, Recipe } from '@/enums';

@Entity({ name: 'recurring_box' })
export default class RecurringBox {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: MealPlan })
  mealPlan!: MealPlan;

  @Column({ type: 'enum', enum: Frequency })
  frequency!: Frequency;

  @Column({ type: 'enum', enum: Recipe })
  recipe1!: Recipe;

  @Column({ type: 'enum', enum: Recipe, nullable: true })
  recipe2?: Recipe;

  @Column()
  isTransitionPeriod!: boolean;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @ManyToOne(() => Order, (order) => order.boxs)
  order!: Relation<Order>;

  @OneToOne(() => Shipment, (shipment) => shipment.box)
  @JoinColumn()
  shipment!: Relation<Shipment>;

  @ManyToOne(() => Dog, (dog: Dog) => dog.boxs)
  dog!: Relation<Dog>;

  @OneToOne(() => RecurringBox, (box) => box.nextBox)
  @JoinColumn()
  prevBox?: Relation<RecurringBox>;

  @OneToOne(() => RecurringBox, (box) => box.prevBox)
  nextBox?: Relation<RecurringBox>;
}
