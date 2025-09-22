// هذا الملف يقوم بتوسيع تعريفات الأنواع الافتراضية لمكتبة Express
// ليجعل TypeScript يتعرف على الإضافات التي نقوم بها، مثل خاصية "user"

declare namespace Express {
    export interface Request {
        user?: {
            userId: string;
            email: string;
        }
    }
}
