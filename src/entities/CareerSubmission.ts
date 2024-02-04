import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Career } from '.';

@Entity({ name: 'career_submission' })
export default class CareerSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: 'mediumblob' })
  resume!: Buffer;

  @Column({ type: 'mediumblob', nullable: true })
  coverLetter?: Buffer;

  @ManyToOne(() => Career, (career) => career.submissions)
  career!: Relation<Career>;
}
