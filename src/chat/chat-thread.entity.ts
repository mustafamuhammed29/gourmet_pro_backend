import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity()
export class ChatThread {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    // [الإصلاح الرئيسي] إضافة العلاقة مع المستخدم
    // هذا السطر يخبر المحادثة أنها تنتمي إلى مستخدم واحد
    @ManyToOne(() => User, (user) => user.chatThreads)
    user: User;

    @OneToMany(() => ChatMessage, (message) => message.thread)
    messages: ChatMessage[];
}
