import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Dog } from '.';
import { MealPlan, OrderSize, Recipe } from '@/enums';

@Entity({ name: 'dog_recurring_record' })
export default class DogRecurringRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  mealPlan!: MealPlan;

  @Column({ type: 'int' })
  orderSize!: OrderSize;

  @Column({ type: 'int' })
  recipe1!: Recipe;

  @Column({ type: 'int', nullable: true })
  recipe2?: Recipe;

  @Column()
  isTransitionPeriod!: boolean;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  deliveryDate!: Date;

  @ManyToOne(() => Dog, (dog: Dog) => dog.recurringRecords)
  @JoinColumn()
  dog!: Relation<Dog>;
}
