import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];
}
