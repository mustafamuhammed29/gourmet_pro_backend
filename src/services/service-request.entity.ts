import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: string; // pending, in-progress, completed, rejected

  @ManyToOne(() => User, { eager: true })
  requester: User;

  @CreateDateColumn()
  createdAt: Date;
}
