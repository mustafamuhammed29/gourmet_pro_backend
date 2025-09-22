import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { User } from '../users/user.entity';
import { ChatMessage } from './chat-message.entity';

// هذا الكلاس يمثل جدول "chat_threads" الذي ينظم المحادثات
@Entity('chat_threads')
export class ChatThread {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // كل محادثة ترتبط بمطعم واحد
    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    // كل محادثة ترتبط بأدمن واحد (من جدول المستخدمين)
    @ManyToOne(() => User)
    admin: User;

    // كل محادثة تحتوي على قائمة من الرسائل
    @OneToMany(() => ChatMessage, message => message.thread)
    messages: ChatMessage[];

    @CreateDateColumn()
    createdAt: Date;
}
