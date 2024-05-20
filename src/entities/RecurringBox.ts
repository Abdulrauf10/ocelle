import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Dog, Order, Shipment } from '.';
import { MealPlan, Frequency, Recipe } from '@/enums';

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

  @ManyToOne(() => Shipment, (shipment) => shipment.boxs)
  shipment!: Relation<Shipment>;

  @ManyToOne(() => Dog, (dog: Dog) => dog.boxs)
  dog!: Relation<Dog>;

  @OneToOne(() => RecurringBox, (box) => box.nextBox)
  @JoinColumn()
  prevBox?: RecurringBox;

  @OneToOne(() => RecurringBox, (box) => box.prevBox)
  nextBox?: RecurringBox;
}
