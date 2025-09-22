import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { User } from '../users/user.entity';
import { ChatThread } from './chat-thread.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatMessage)
        private messagesRepository: Repository<ChatMessage>,
        @InjectRepository(ChatThread)
        private threadsRepository: Repository<ChatThread>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * دالة لحفظ رسالة جديدة في قاعدة البيانات
     * @param content نص الرسالة
     * @param senderId معرف المستخدم الذي أرسل الرسالة
     * @param threadId معرف المحادثة التي تنتمي إليها الرسالة
     * @returns الرسالة المحفوظة
     */
    async createMessage(content: string, senderId: string, threadId: string): Promise<ChatMessage> {
        // ١. البحث عن المرسل والمحادثة الصحيحة في قاعدة البيانات
        const sender = await this.usersRepository.findOneBy({ id: senderId });
        if (!sender) {
            throw new NotFoundException(`لم يتم العثور على المستخدم بالمعرف ${senderId}`);
        }

        const thread = await this.threadsRepository.findOneBy({ id: threadId });
        if (!thread) {
            throw new NotFoundException(`لم يتم العثور على محادثة بالمعرف ${threadId}`);
        }

        // ٢. إنشاء كائن الرسالة الجديد وربطه بالمرسل والمحادثة
        const newMessage = this.messagesRepository.create({
            content,
            sender,
            thread,
        });

        // ٣. حفظ الرسالة الجديدة في قاعدة البيانات
        return this.messagesRepository.save(newMessage);
    }
}

