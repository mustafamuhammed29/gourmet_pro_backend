import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common'; // <-- ١. استيراد الأداة اللازمة

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // --- ✨ ٢. تفعيل التحقق من صحة المدخلات عالمياً ---
  // أي طلب قادم سيتم التحقق منه تلقائياً بناءً على القواعد في ملفات DTO
  app.useGlobalPipes(new ValidationPipe());

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();
