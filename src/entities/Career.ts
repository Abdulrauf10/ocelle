import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { CareerLine } from '.';

import { Classification, WorkPattern, WorkType } from '@/enums';

@Entity({ name: 'career' })
export default class Career {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: WorkType })
  workType!: WorkType;

  @Column({ type: 'enum', enum: Classification })
  classification!: Classification;

  @Column({ type: 'enum', enum: WorkPattern })
  workPattern!: WorkPattern;

  @Column()
  applyDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  isDisabled!: boolean;

  @OneToMany(() => CareerLine, (line) => line.career)
  lines!: Relation<CareerLine>[];
}
