import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dog } from '.';
import { MealPlan, Recipe } from '@/enums';

@Entity({ name: 'dog_plan' })
export default class DogPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  mealPlan!: MealPlan;

  @Column()
  recipe1!: Recipe;

  @Column({ nullable: true })
  recipe2?: Recipe;

  @Column()
  isEnabledTransitionPeriod!: boolean;

  @Column()
  isEnabled!: boolean;

  @Column()
  lastDeliveryDate!: Date;

  @OneToOne(() => Dog, (dog) => dog.plan)
  @JoinColumn()
  dog!: Dog;
}
