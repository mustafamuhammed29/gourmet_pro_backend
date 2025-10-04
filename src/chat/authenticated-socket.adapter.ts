import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';

export type AuthenticatedSocket = Socket & {
    user: {
        userId: number;
        email: string;
        role: string;
    };
};

export class AuthenticatedSocketAdapter extends IoAdapter {
    private readonly jwtService: JwtService;

    constructor(private app: INestApplicationContext) {
        super(app);
        this.jwtService = this.app.get(JwtService);
    }

    createIOServer(port: number, options?: any): any {
        const server: Server = super.createIOServer(port, options);

        // Middleware للتحقق من JWT قبل السماح بالاتصال
        server.use(async (socket: AuthenticatedSocket, next) => {
            const token =
                socket.handshake.auth.token ||
                socket.handshake.headers['authorization']?.split(' ')[1];

            if (!token) {
                return next(new Error('Authentication error: No token provided.'));
            }

            try {
                const payload = this.jwtService.verify(token, {
                    secret: jwtConstants.secret,
                });

                socket.user = {
                    userId: Number(payload.sub),
                    email: payload.email,
                    role: payload.role,
                };

                next();
            } catch (error) {
                next(new Error('Authentication error: Invalid token.'));
            }
        });

        return server;
    }
}
