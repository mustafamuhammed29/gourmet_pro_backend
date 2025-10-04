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
  cors: { 
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  namespace: '/chat', // إضافة / في البداية
  transports: ['websocket', 'polling']
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
    try {
      if (!client.user || !client.user.userId) {
        console.log('Unauthorized connection attempt');
        client.disconnect();
        return;
      }
      
      const userRoom = `user-${client.user.userId}`;
      await client.join(userRoom);
      console.log(`Client connected: ${client.id} and joined room: ${userRoom}`);
      
      // إرسال رسالة ترحيب
      client.emit('connected', { 
        message: 'Connected to chat successfully',
        userId: client.user.userId 
      });
    } catch (error) {
      console.error('Error handling connection:', error);
      client.disconnect();
    }
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

