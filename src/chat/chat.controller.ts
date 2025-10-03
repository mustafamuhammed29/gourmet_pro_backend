import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatThread } from './chat-thread.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @UseGuards(JwtAuthGuard)
    @Get('my-thread')
    async getMyThread(@Req() req): Promise<ChatThread> {
        const userId = req.user.userId;
        return this.chatService.findOrCreateThreadForUser(userId);
    }
}
