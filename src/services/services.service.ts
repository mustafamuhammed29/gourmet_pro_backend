import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createServiceRequestDto: CreateServiceRequestDto,
    userId: number,
  ): Promise<ServiceRequest> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    const newRequest = this.serviceRequestRepository.create({
      ...createServiceRequestDto,
      requester: user,
    });

    return this.serviceRequestRepository.save(newRequest);
  }

  async findAllByUser(userId: number): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { requester: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
