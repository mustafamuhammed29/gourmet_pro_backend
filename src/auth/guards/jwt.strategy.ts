import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

// This file contains the actual logic for validating the "digital ID card" (JWT)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    // After validating the token, this function extracts its content
    async validate(payload: any) {
        // We can now return the user data to be available anywhere in the app
        // Added Number() to ensure type safety
        return {
            userId: Number(payload.sub),
            email: payload.email,
            role: payload.role,
        };
    }
}

