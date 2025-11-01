import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatThread } from './chat-thread.entity';
import { ChatMessage } from './chat-message.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatThread)
        private threadsRepository: Repository<ChatThread>,
        @InjectRepository(ChatMessage)
        private messagesRepository: Repository<ChatMessage>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Finds an existing chat thread for a user or creates a new one if it doesn't exist.
     * @param userId The ID of the user.
     * @returns The found or newly created ChatThread.
     */
    async findOrCreateThreadForUser(userId: number): Promise<any> {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        let thread = await this.threadsRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!thread) {
            thread = this.threadsRepository.create({ user });
            await this.threadsRepository.save(thread);
        }

        // ✨ جلب الرسائل المرتبطة بالمحادثة
        const messages = await this.getMessagesForThread(thread.id);

        // ✨ إرجاع كائن يجمع بين المحادثة والرسائل ومعرف المستخدم
        return {
            thread: thread,
            messages: messages,
            userId: userId,
        };
    }

    /**
     * Creates and saves a new chat message.
     * @param content The text content of the message.
     * @param senderId The ID of the user sending the message.
     * @param threadId The ID of the chat thread this message belongs to.
     * @returns The newly created and saved ChatMessage.
     */
    async createMessage(
        content: string,
        senderId: number,
        threadId: number,
    ): Promise<ChatMessage> {
        const sender = await this.usersRepository.findOneBy({ id: senderId });
        if (!sender) throw new NotFoundException('Sender not found');

        const thread = await this.threadsRepository.findOneBy({ id: threadId });
        if (!thread) throw new NotFoundException('Thread not found');

        const message = this.messagesRepository.create({
            content,
            sender,
            thread,
        });

        return this.messagesRepository.save(message);
    }

    /**
     * Retrieves all messages for a specific chat thread.
     * @param threadId The ID of the chat thread.
     * @returns A promise that resolves to an array of ChatMessages.
     */
    async getMessagesForThread(threadId: number): Promise<ChatMessage[]> {
        return this.messagesRepository.find({
            where: { thread: { id: threadId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' }, // Fetch messages in chronological order
        });
    }
}

