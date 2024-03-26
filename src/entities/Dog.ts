import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { DogBreed, DogOrder, DogPlan, DogRecurringRecord, User } from '.';
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

  @Column()
  dateOfBirthMethod!: 'Manually' | 'Calendar';

  @Column()
  dateOfBirth!: Date;

  @Column({ type: 'double', precision: 5, scale: 2, comment: 'KG' })
  weight!: number;

  @Column()
  bodyCondition!: 'TooSkinny' | 'JustRight' | 'Rounded' | 'Chunky';

  @Column()
  activityLevel!: 'Mellow' | 'Active' | 'VeryActive';

  @Column({ type: 'int' })
  foodAllergies!: FoodAllergies;

  @Column()
  currentEating!: 'Dry' | 'Wet' | 'Raw' | 'Dehydrated' | 'Fresh' | 'Homemade' | 'Other';

  @Column()
  amountOfTreats!: 'None' | 'Some' | 'Lots';

  @Column()
  pickiness!: 'Picky' | 'GoodEater' | 'EatAnything';

  @OneToOne(() => DogPlan, (plan) => plan.dog)
  plan!: Relation<DogPlan>;

  @OneToMany(() => DogRecurringRecord, (box) => box.dog)
  recurringRecords!: Relation<DogRecurringRecord>[];

  @ManyToOne(() => User, (user) => user.dogs)
  user!: Relation<User>;

  @OneToMany(() => DogBreed, (breed) => breed.dog)
  breeds!: Relation<DogBreed>[];

  @OneToMany(() => DogOrder, (order) => order.dog)
  orders!: Relation<DogOrder>[];
}
