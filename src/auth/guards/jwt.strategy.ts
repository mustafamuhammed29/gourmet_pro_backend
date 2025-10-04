import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret, // Use the unified secret key
        });
    }

    // After validating the token, this function extracts its content.
    async validate(payload: any) {
        // This payload is what will be attached to `req.user`.
        return {
            userId: Number(payload.sub), // Ensure userId is always a number
            email: payload.email,
            role: payload.role,
        };
    }
}

