// هذا الملف يحدد "شكل" البيانات التي نتوقعها
// عند طلب تعديل طبق موجود. علامة الاستفهام (?) تعني أن الحقل اختياري.
export class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
}
