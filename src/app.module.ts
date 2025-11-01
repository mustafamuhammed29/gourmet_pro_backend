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
import { AiModule } from './ai/ai.module';
import { CommonModule } from './common/common.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { ChefRequestsModule } from './chef-requests/chef-requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'gourmet_pro_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    DocumentsModule,
    ProductsModule,
    ChatModule,
    AiModule,
    CommonModule,
    NotificationsModule,
    ServicesModule,
    OrdersModule,
    ChefRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
