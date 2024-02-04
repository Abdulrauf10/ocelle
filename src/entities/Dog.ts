import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { DogBreed, DogOrder, DogPlan, SaleorUser } from '.';
import { FoodAllergies } from '@/enums';

@Entity({ name: 'dog' })
export default class Dog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  sex!: 'M' | 'F';

  @Column()
  isNeutered!: boolean;

  @Column({ type: 'double', precision: 5, scale: 2, comment: 'KG' })
  weight!: number;

  @Column()
  bodyCondition!: 'TooSkinny' | 'JustRight' | 'Rounded' | 'Chunky';

  @Column()
  activityLevel!: 'Mellow' | 'Active' | 'VeryActive';

  @Column({ type: 'int' })
  foodAllergies!: FoodAllergies;

  @Column()
  amountOfTreats!: 'None' | 'Some' | 'Lots';

  @Column()
  pickiness!: 'Picky' | 'GoodEater' | 'EatAnything';

  @OneToOne(() => DogPlan, (plan) => plan.dog)
  plan!: Relation<DogPlan>;

  @ManyToOne(() => SaleorUser, (user) => user.dogs)
  user!: Relation<SaleorUser>;

  @OneToMany(() => DogBreed, (breed) => breed.dog)
  breeds!: Relation<DogBreed>[];

  @OneToMany(() => DogOrder, (order) => order.dog)
  orders!: Relation<DogOrder>[];
}
