import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatThread } from './chat-thread.entity';

// هذا الكلاس يمثل جدول "chat_messages" الذي يخزن كل رسالة
@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // كل رسالة تنتمي إلى محادثة واحدة
    @ManyToOne(() => ChatThread, thread => thread.messages)
    thread: ChatThread;

    // كل رسالة يتم إرسالها من قبل مستخدم واحد
    @ManyToOne(() => User)
    sender: User;

    // محتوى الرسالة النصي
    @Column('text')
    content: string;

    // يمكن إضافة حقل للمرفقات لاحقاً
    // @Column({ nullable: true })
    // attachmentUrl: string;

    // حالة قراءة الرسالة
    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
