import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
// ✨ تم التعديل هنا بإضافة 'type'
import type { AuthenticatedSocket } from './authenticated-socket.adapter';

// ١. تحديد مسار واسم الحدث الرئيسي
const CHAT_EVENT = 'chat';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat', // ٢. استخدام مسار مخصص للدردشة فقط
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  /**
   * Handles new client connections.
   * When a user connects, they are automatically joined to a private room
   * named after their user ID.
   */
  async handleConnection(client: AuthenticatedSocket) {
    const userRoom = `user-${client.user.userId}`;
    client.join(userRoom);
    console.log(`Client connected: ${client.id} and joined room: ${userRoom}`);
  }

  /**
   * Handles client disconnections.
   */
  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Listens for incoming chat messages from a connected client.
   */
  @SubscribeMessage(CHAT_EVENT)
  async handleMessage(
    @MessageBody() data: { content: string; threadId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      // ٣. استخلاص هوية المستخدم من الاتصال الموثق
      const senderId = client.user.userId;
      const userRoom = `user-${senderId}`;

      // ٤. حفظ الرسالة في قاعدة البيانات أولاً
      const savedMessage = await this.chatService.createMessage(
        data.content,
        senderId,
        data.threadId,
      );

      // ٥. إرسال الرسالة إلى الغرفة الخاصة بالمستخدم فقط
      this.server.to(userRoom).emit(CHAT_EVENT, savedMessage);
    } catch (error) {
      console.error('Failed to handle message:', error);
      // Optional: Emit an error event back to the sender
      client.emit('error', { message: 'Could not send message.' });
    }
  }
}

