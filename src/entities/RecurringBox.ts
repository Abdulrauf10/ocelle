import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Dog, Order, Shipment } from '.';
import { MealPlan, OrderSize, Recipe } from '@/enums';

@Entity({ name: 'recurring_box' })
export default class RecurringBox {
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

  @ManyToOne(() => Order, (order) => order.boxs)
  order?: Relation<Order>;

  @ManyToOne(() => Shipment, (shipment) => shipment.boxs)
  shipment!: Relation<Shipment>;

  @ManyToOne(() => Dog, (dog: Dog) => dog.boxs)
  dog!: Relation<Dog>;
}
