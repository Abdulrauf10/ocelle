import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { DogBreed } from '.';
import { Size } from '@/enums';

@Entity({ name: 'breed' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: Size })
  size!: Size;

  @Column({ unique: true })
  uid!: string;

  @OneToMany(() => DogBreed, (dog: DogBreed) => dog.breed)
  dogs!: Relation<DogBreed>[];
}
