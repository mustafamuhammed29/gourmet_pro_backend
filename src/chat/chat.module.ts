import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatThread } from './chat-thread.entity';
import { ChatMessage } from './chat-message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Module({
    // تسجيل جميع الكيانات التي تحتاجها هذه الوحدة للوصول لقاعدة البيانات
    imports: [TypeOrmModule.forFeature([ChatThread, ChatMessage, User, Restaurant])],
    // تسجيل البوابة والخدمة ليتم التعرف عليهما
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }

