import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dog, Order } from '.';
import { MealPlan, Recipe } from '@/enums';

@Entity({ name: 'dog_order' })
export default class DogOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mealPlan: MealPlan;

  @Column()
  recipe1: Recipe;

  @Column({ nullable: true })
  recipe2?: Recipe;

  @Column()
  isTransitionPeriod: boolean;

  @ManyToOne(() => Dog, (dog) => dog.orders)
  dog: Dog;

  @ManyToOne(() => Order, (order) => order.dogs)
  order: Order;
}
