import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dishName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'pending' })
  status: string; // pending, in-progress, completed, cancelled

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Restaurant, { eager: true })
  restaurant: Restaurant;

  @ManyToOne(() => Product, { nullable: true })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
