import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DogBreed, DogOrder, DogPlan, SaleorUser } from '.';
import { FoodAllergies } from '@/enums';

@Entity({ name: 'dog' })
export default class Dog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sex: 'M' | 'F';

  @Column()
  isNeutered: boolean;

  @Column({ type: 'double', precision: 5, scale: 2, comment: 'KG' })
  weight: number;

  @Column()
  bodyCondition: 'TooSkinny' | 'JustRight' | 'Rounded' | 'Chunky';

  @Column()
  activityLevel: 'Mellow' | 'Active' | 'VeryActive';

  @Column({ type: 'int' })
  foodAllergies: FoodAllergies;

  @Column()
  amountOfTreats: 'None' | 'Some' | 'Lots';

  @Column()
  pickiness: 'Picky' | 'GoodEater' | 'EatAnything';

  @OneToOne(() => DogPlan, (plan) => plan.dog)
  plan: DogPlan;

  @ManyToOne(() => SaleorUser, (user) => user.dogs)
  user: SaleorUser;

  @OneToMany(() => DogBreed, (breed) => breed.dog)
  breeds: DogBreed[];

  @OneToMany(() => DogOrder, (order) => order.dog)
  orders: DogOrder[];
}
