import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { DogBreed } from '.';

@Entity({ name: 'breed' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  zhName?: string;

  @Column()
  enName!: string;

  @Column()
  size!: 'Small' | 'Medium' | 'Large';

  @OneToMany(() => DogBreed, (dog: DogBreed) => dog.breed)
  dogs!: Relation<DogBreed>[];
}
