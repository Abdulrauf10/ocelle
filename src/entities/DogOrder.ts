import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Dog, Order } from '.';
import { MealPlan, Recipe } from '@/enums';

@Entity({ name: 'dog_order' })
export default class DogOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  mealPlan!: MealPlan;

  @Column({ type: 'int' })
  recipe1!: Recipe;

  @Column({ type: 'int', nullable: true })
  recipe2?: Recipe;

  @Column()
  isTransitionPeriod!: boolean;

  @ManyToOne(() => Dog, (dog) => dog.orders)
  dog!: Relation<Dog>;

  @ManyToOne(() => Order, (order) => order.dogs)
  order!: Relation<Order>;
}
