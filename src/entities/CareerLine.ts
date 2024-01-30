import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CareerLineType } from '@/enums';
import { Career } from '.';

@Entity()
export default class CareerLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  lineType: CareerLineType;

  @Column()
  name: string;

  @ManyToOne(() => Career, (career) => career.lines)
  career: Career;
}
