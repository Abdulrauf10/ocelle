import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Dog } from '.';

import { Frequency, MealPlan, Recipe } from '@/enums';

@Entity({ name: 'dog_plan' })
export default class DogPlan {
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
  isEnabledTransitionPeriod!: boolean;

  @Column()
  isEnabled!: boolean;

  @Column()
  startDate!: Date;

  @OneToOne(() => Dog, (dog: Dog) => dog.plan)
  @JoinColumn()
  dog!: Relation<Dog>;
}
