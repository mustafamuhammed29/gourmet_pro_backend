import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('documents') // <-- تم تحديد اسم الجدول بالجمع
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ['license', 'commercial_registry'],
        comment: 'Type of the document',
    })
    type: 'license' | 'commercial_registry';

    @Column()
    filePath: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    })
    status: 'pending' | 'approved' | 'rejected';

    // --- Relationships ---

    // كل مستند ينتمي إلى مطعم واحد
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.documents)
    restaurant: Restaurant;
}

