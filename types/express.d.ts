// This file extends the default Express Request type definition
// to make TypeScript aware of the additions we make, such as the 'user' property.

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                // By using 'string' here, we avoid the need for an import,
                // which was causing the file to be treated as a module.
                role: string;
            };
        }
    }
}

