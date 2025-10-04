import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

export class AuthenticatedSocketAdapter extends IoAdapter {
    constructor(private readonly app: INestApplicationContext) {
        super(app);
    }

    createIOServer(port: number, options?: any): any {
        const server: Server = super.createIOServer(port, { ...options, cors: true });

        // --- ✨ التعديل الرئيسي هنا ---
        // تم نقل منطق الوصول للخدمات إلى داخل الـ Middleware
        // لضمان أن تكون جميع وحدات NestJS قد تم تحميلها بالكامل
        const jwtService = this.app.get(JwtService);
        const usersService = this.app.get(UsersService);

        server.of('chat').use(async (socket: Socket & { user?: User }, next) => {
            const authHeader = socket.handshake.headers.authorization;
            const tokenFromAuth = socket.handshake.auth.token;
            let token = '';

            if (authHeader) {
                token = authHeader.replace(/^Bearer\s+/, '').replace(/"/g, '');
            } else if (tokenFromAuth) {
                token = tokenFromAuth;
            }

            if (!token) {
                return next(new Error('Authentication error: No token provided.'));
            }

            try {
                const payload = jwtService.verify(token);
                const user = await usersService.findOne(payload.sub);
                if (!user) {
                    return next(new Error('Authentication error: User not found.'));
                }
                socket.user = user;
                next();
            } catch (error) {
                next(new Error('Authentication error: Invalid token.'));
            }
        });

        return server;
    }
}

