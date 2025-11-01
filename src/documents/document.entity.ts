import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // 'license' or 'commercial_registry'

    @Column()
    path: string;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'approved', 'rejected'

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.documents)
    restaurant: Restaurant;
}
