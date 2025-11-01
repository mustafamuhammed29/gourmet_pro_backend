import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { Restaurant } from '../restaurants/restaurant.entity'; // <-- ١. استيراد كيان المطعم

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Restaurant) // <-- ٢. حقن مستودع المطاعم
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  // --- ✨ ٣. تم تعديل الدالة لتصبح أكثر تخصصاً ---
  async assignDocumentsToRestaurant(
    restaurantId: number,
    licensePath: string,
    commercialRegistryPath: string,
  ) {
    const restaurant = await this.restaurantsRepository.findOneBy({
      id: restaurantId,
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found.`);
    }

    const licenseDoc = this.documentsRepository.create({
      type: 'license',
      path: licensePath,
      restaurant: restaurant,
    });

    const registryDoc = this.documentsRepository.create({
      type: 'commercial_registry',
      path: commercialRegistryPath,
      restaurant: restaurant,
    });

    await this.documentsRepository.save([licenseDoc, registryDoc]);

    return { message: 'Documents assigned successfully' };
  }

  // --- ✨ دالة جديدة لجلب حالة المستندات للمطعم ---
  async getDocumentsByRestaurantOwner(userId: number): Promise<Document[]> {
    return this.documentsRepository.find({
      where: {
        restaurant: {
          owner: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        status: true,
        path: true,
      },
    });
  }
}
