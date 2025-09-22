import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Document } from '../documents/document.entity';
import { Product } from '../products/product.entity'; // ١. استيراد كيان المنتج

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    cuisineType: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ default: 'pending' })
    status: string;

    @OneToOne(() => User, user => user.restaurant)
    owner: User;

    @OneToMany(() => Document, document => document.restaurant)
    documents: Document[];

    // ٢. إضافة علاقة "واحد إلى كثير" مع جدول المنتجات
    @OneToMany(() => Product, product => product.restaurant)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

