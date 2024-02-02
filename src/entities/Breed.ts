import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DogBreed } from '.';

@Entity({ name: 'breed' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  zhName?: string;

  @Column()
  enName: string;

  @Column()
  size: 'Small' | 'Medium' | 'Large';

  @OneToMany(() => DogBreed, (dog) => dog.breed)
  dogs: DogBreed[];
}
