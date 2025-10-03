import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { ChatThread } from '../chat/chat-thread.entity';

export enum UserRole {
    ADMIN = 'admin',
    RESTAURANT_OWNER = 'restaurant_owner',
    STAFF = 'staff',
}

export enum UserStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column()
    phoneNumber: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.RESTAURANT_OWNER,
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING,
    })
    status: UserStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    //
    // --- تم التعديل هنا ---
    // A user can exist without a restaurant initially.
    @OneToOne(() => Restaurant, (restaurant) => restaurant.owner, { nullable: true })
    @JoinColumn()
    restaurant: Restaurant;
    //
    //

    @OneToMany(() => ChatThread, (thread) => thread.user)
    chatThreads: ChatThread[];
}

