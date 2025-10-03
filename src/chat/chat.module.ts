import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatThread } from './chat-thread.entity';
import { ChatMessage } from './chat-message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module'; // <-- ١. استيراد وحدة المصادقة
import { ChatController } from './chat.controller'; // <-- ٢. استيراد الـ Controller

@Module({
    // تسجيل جميع الكيانات التي تحتاجها هذه الوحدة
    imports: [
        TypeOrmModule.forFeature([ChatThread, ChatMessage, User]),
        AuthModule, // <-- ٣. إضافة الوحدة هنا للسماح بالوصول إلى JwtService
    ],
    // تسجيل المكونات التي تنتمي لهذه الوحدة
    controllers: [ChatController], // <-- ٤. إضافة الـ Controller
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }

