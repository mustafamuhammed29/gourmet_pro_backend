import { Injectable } from '@nestjs/common';
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

    async createMessage(
        content: string,
        senderId: string,
        threadId: string,
    ): Promise<ChatMessage> {
        const sender = await this.usersRepository.findOneBy({
            id: parseInt(senderId, 10),
        });
        if (!sender) throw new Error('Sender not found');

        const thread = await this.threadsRepository.findOneBy({
            id: parseInt(threadId, 10),
        });
        if (!thread) throw new Error('Thread not found');

        const message = this.messagesRepository.create({
            content,
            sender,
            thread,
        });

        return this.messagesRepository.save(message);
    }

    async getMessagesForThread(threadId: number): Promise<ChatMessage[]> {
        return this.messagesRepository.find({
            where: { thread: { id: threadId } },
            relations: ['sender'],
        });
    }
}
