import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Career } from '.';

@Entity()
export default class CareerSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'mediumblob' })
  resume: Buffer;

  @Column({ type: 'mediumblob', nullable: true })
  coverLetter?: Buffer;

  @ManyToOne(() => Career, (career) => career.submissions)
  career: Career;
}
