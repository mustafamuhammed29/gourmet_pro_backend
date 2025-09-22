import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { content: string; threadId: string }): Promise<void> {
    // في تطبيق حقيقي، سنستخرج هوية المستخدم من توكن المصادقة المرفق مع الاتصال
    // هذا مجرد مثال، يجب استخدام ID مستخدم حقيقي موجود في قاعدة بياناتك عند الاختبار
    const mockUserId = 'your_user_id_from_db'; // استبدل هذا بمعرف مستخدم حقيقي

    try {
      // ١. حفظ الرسالة في قاعدة البيانات أولاً
      const savedMessage = await this.chatService.createMessage(data.content, mockUserId, data.threadId);

      // ٢. إرسال الرسالة المحفوظة (مع كل تفاصيلها) إلى جميع العملاء
      this.server.emit('receiveMessage', savedMessage);
    } catch (error) {
      // في حال حدوث خطأ أثناء الحفظ، يمكننا إعلام المرسل
      console.error('Failed to save message:', error);
      // this.server.to(client.id).emit('messageError', { message: 'Could not save message.' });
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}

