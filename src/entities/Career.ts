import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Classification, WorkPattern, WorkType } from '@/enums';
import { CareerLine, CareerSubmission } from '.';

@Entity()
export default class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  workType: WorkType;

  @Column({ type: 'int' })
  classification: Classification;

  @Column({ type: 'int' })
  workPattern: WorkPattern;

  @Column()
  applyDate: Date;

  @Column()
  endDate: Date;

  @Column()
  isDisabled: boolean;

  @OneToMany(() => CareerLine, (line) => line.career)
  lines: CareerLine[];

  @OneToMany(() => CareerSubmission, (line) => line.career)
  submissions: CareerSubmission[];
}
