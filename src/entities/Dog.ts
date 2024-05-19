import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { DogBreed, DogPlan, RecurringBox, User } from '.';
import { ActivityLevel, AmountOfTreats, BodyCondition, DateOfBirthMethod, DogFood, FoodAllergies, Gender, Pickiness } from '@/enums';

@Entity({ name: 'dog' })
export default class Dog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: Gender })
  sex!: Gender;

  @Column()
  isNeutered!: boolean;

  @Column({ type: 'enum', enum: DateOfBirthMethod })
  dateOfBirthMethod!: DateOfBirthMethod;

  @Column()
  dateOfBirth!: Date;

  @Column({ type: 'double', precision: 5, scale: 2, comment: 'KG' })
  weight!: number;

  @Column({ type: 'enum', enum: BodyCondition })
  bodyCondition!: BodyCondition;

  @Column({ type: 'enum', enum: ActivityLevel })
  activityLevel!: ActivityLevel;

  @Column({ type: 'int' })
  foodAllergies!: FoodAllergies;

  @Column({ type: 'set', enum: DogFood })
  currentEating!: DogFood[];

  @Column({ type: 'enum', enum: AmountOfTreats })
  amountOfTreats!: AmountOfTreats;

  @Column({ type: 'enum', enum: Pickiness })
  pickiness!: Pickiness;

  @OneToOne(() => DogPlan, (plan) => plan.dog)
  plan!: Relation<DogPlan>;

  @OneToMany(() => RecurringBox, (box) => box.dog)
  boxs!: Relation<RecurringBox>[];

  @OneToMany(() => DogBreed, (breed) => breed.dog)
  breeds!: Relation<DogBreed>[];

  @ManyToOne(() => User, (user) => user.dogs)
  user!: Relation<User>;
}
