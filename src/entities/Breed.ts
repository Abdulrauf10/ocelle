import { BreedSize } from '@/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Breed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chiName?: string;

  @Column()
  enName: string;

  @Column({ type: 'varchar' })
  size: BreedSize;
}
