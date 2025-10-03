// This file extends the default type definitions for the Express library
// to make TypeScript aware of the additions we make, like the "user" property.

// By removing the top-level 'import', this file is treated as a global augmentation
// ensuring that the Express.Request interface is modified correctly project-wide.

declare global {
    namespace Express {
        export interface Request {
            user?: {
                userId: number;
                email: string;
                // We use 'string' here instead of the 'UserRole' enum to avoid the import,
                // which was causing the global augmentation to fail.
                role: string;
            };
        }
    }
}
