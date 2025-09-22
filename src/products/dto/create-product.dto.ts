// هذا الملف يحدد "شكل" البيانات التي نتوقعها
// عند طلب إضافة طبق جديد إلى قائمة الطعام.
export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string; // رابط الصورة اختياري
}
