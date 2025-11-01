import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class ChefRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dishName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: string; // pending, under-review, recipe-suggested, completed

  @Column({ type: 'text', nullable: true })
  suggestedRecipe: string;

  @ManyToOne(() => Restaurant, { eager: true })
  restaurant: Restaurant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
