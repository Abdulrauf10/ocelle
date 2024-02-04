import { Entity, ManyToOne, PrimaryColumn, type Relation } from 'typeorm';
import { Breed, Dog } from '.';

@Entity({ name: 'dog_breed' })
export default class DogBreed {
  @PrimaryColumn()
  breedId!: number;

  @PrimaryColumn()
  dogId!: number;

  @ManyToOne(() => Breed, (breed) => breed.dogs)
  breed!: Relation<Breed>;

  @ManyToOne(() => Dog, (dog) => dog.breeds)
  dog!: Relation<Dog>;
}
