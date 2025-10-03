import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async assignDocumentsToRestaurant(
    userId: number,
    licensePath: string,
    commercialRegistryPath: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['restaurant'],
    });

    if (!user || !user.restaurant) {
      throw new NotFoundException(
        `User with ID ${userId} or their restaurant not found.`,
      );
    }

    const licenseDoc = this.documentsRepository.create({
      type: 'license',
      path: licensePath,
      restaurant: user.restaurant,
    });

    const registryDoc = this.documentsRepository.create({
      type: 'commercial_registry',
      path: commercialRegistryPath,
      restaurant: user.restaurant,
    });

    await this.documentsRepository.save([licenseDoc, registryDoc]);

    return { message: 'Documents assigned successfully' };
  }
}

