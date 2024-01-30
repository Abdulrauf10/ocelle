import { BreedSize } from '@/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'breed' })
export default class Breed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  zhName?: string;

  @Column()
  enName: string;

  @Column({ type: 'varchar' })
  size: BreedSize;
}
