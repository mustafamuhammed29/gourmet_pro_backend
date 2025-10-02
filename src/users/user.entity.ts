import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() // <-- تم إضافة هذا الحقل
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    passwordHash?: string;

    @Column({ default: 'owner' })
    role: string;

    // --- Relationships ---

    @OneToOne(() => Restaurant, (restaurant) => restaurant.owner)
    @JoinColumn()
    restaurant: Restaurant;


}

