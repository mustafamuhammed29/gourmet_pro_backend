import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ١. تفعيل سياسة CORS للسماح بالاتصالات من أي مصدر خارجي
  app.enableCors();

  // ٢. تفعيل محول WebSocket للسماح باتصالات الدردشة
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();

