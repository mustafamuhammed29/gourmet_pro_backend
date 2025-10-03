import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions, Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

// Define an interface for our authenticated socket
export interface AuthenticatedSocket extends Socket {
    user: {
        userId: number;
        email: string;
        role: string;
    };
}

export class AuthenticatedSocketAdapter extends IoAdapter {
    private readonly jwtService: JwtService;

    constructor(private app: INestApplication) {
        super(app);
        // Get the JwtService instance from the app container
        this.jwtService = this.app.get(JwtService);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server: Server = super.createIOServer(port, options);

        // Add a middleware to authenticate connections
        server.use(async (socket: AuthenticatedSocket, next) => {
            // Extract token from the handshake headers
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: 'YOUR_SECRET_KEY', // Ensure this matches your auth.module secret
                });
                // Attach user payload to the socket object for future use
                socket.user = { userId: payload.sub, email: payload.email, role: payload.role };
                next();
            } catch (error) {
                next(new Error('Authentication error: Invalid token'));
            }
        });

        return server;
    }
}
