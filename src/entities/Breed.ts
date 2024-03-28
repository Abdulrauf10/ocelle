import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { DogBreed } from '.';

@Entity({ name: 'breed' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  size!: 'Small' | 'Medium' | 'Large';

  @Column({ unique: true })
  uid!: string;

  @OneToMany(() => DogBreed, (dog: DogBreed) => dog.breed)
  dogs!: Relation<DogBreed>[];
}
