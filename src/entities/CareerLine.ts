import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { Career } from '.';

import { CareerLineType } from '@/enums';

@Entity({ name: 'career_line' })
export default class CareerLine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: CareerLineType })
  lineType!: CareerLineType;

  @Column()
  name!: string;

  @ManyToOne(() => Career, (career) => career.lines)
  career!: Relation<Career>;
}
