import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    category: string;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
    @JoinColumn({ name: 'restaurantId' })
    restaurant: Restaurant;
}

