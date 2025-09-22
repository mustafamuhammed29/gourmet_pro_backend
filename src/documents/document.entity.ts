import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

// هذا الكلاس يمثل جدول "documents" في قاعدة البيانات
@Entity('documents')
export class Document {
    // المفتاح الأساسي، من نوع UUID فريد
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // علاقة "كثير إلى واحد" مع المطعم
    // هذا يعني أن المطعم الواحد يمكن أن يكون لديه عدة مستندات
    @ManyToOne(() => Restaurant, restaurant => restaurant.documents)
    restaurant: Restaurant;

    // نوع المستند المرفوع (مثال: 'license', 'commercial_registry')
    @Column()
    documentType: string;

    // رابط الملف المخزن على خدمة التخزين السحابي (مثل S3)
    @Column()
    fileUrl: string;

    // حالة المستند (قيد المراجعة، مقبول، مرفوض)
    @Column({ default: 'pending' })
    status: string;

    // تاريخ الإنشاء، يتم إضافته تلقائياً
    @CreateDateColumn()
    createdAt: Date;
}

