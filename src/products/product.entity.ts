import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

// هذا الكلاس يمثل جدول "products" في قاعدة البيانات
@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // علاقة "كثير إلى واحد" مع المطعم
    // هذا يعني أن المطعم الواحد يمكن أن يكون لديه عدة منتجات
    @ManyToOne(() => Restaurant, restaurant => restaurant.products)
    restaurant: Restaurant;

    @Column()
    name: string;

    @Column('text')
    description: string;

    // سيتم تخزين السعر كأرقام عشرية
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    category: string; // e.g., 'Appetizers', 'Main Course'

    @Column({ nullable: true }) // رابط الصورة يمكن أن يكون فارغاً
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
