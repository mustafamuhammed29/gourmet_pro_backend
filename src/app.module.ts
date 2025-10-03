import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DocumentsModule } from './documents/documents.module';
import { ProductsModule } from './products/products.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module'; // ✨ ١. استيراد وحدة الذكاء الاصطناعي

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gourmet_pro_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    DocumentsModule,
    ProductsModule,
    ChatModule,
    AiModule, // ✨ ٢. تسجيل الوحدة في التطبيق
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
