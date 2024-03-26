import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Dog } from '.';
import { MealPlan, Recipe } from '@/enums';

@Entity({ name: 'dog_plan' })
export default class DogPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  mealPlan!: MealPlan;

  @Column({ type: 'int' })
  recipe1!: Recipe;

  @Column({ type: 'int', nullable: true })
  recipe2?: Recipe;

  @Column()
  isEnabledTransitionPeriod!: boolean;

  @Column()
  isEnabled!: boolean;

  @Column()
  startDate!: Date;

  @Column()
  lastDeliveryDate!: Date;

  @OneToOne(() => Dog, (dog: Dog) => dog.plan)
  @JoinColumn()
  dog!: Relation<Dog>;
}
