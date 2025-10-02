import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Document } from '../documents/document.entity';
import { Product } from '../products/product.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  cuisineType: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber: string;

  @Column({ default: 'pending' })
  status: string;

  @OneToOne(() => User, user => user.restaurant)
  owner: User;

  @OneToMany(() => Document, document => document.restaurant)
  documents: Document[];

  @OneToMany(() => Product, product => product.restaurant)
  products: Product[];

  // -----------------------------
  // ٣. إضافة أعمدة ملفات الرخصة والسجل التجاري
  @Column({ type: 'text', nullable: true })
  licenseFile: string;

  @Column({ type: 'text', nullable: true })
  registryFile: string;
  // -----------------------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
