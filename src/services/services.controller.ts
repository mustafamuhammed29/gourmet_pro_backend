import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('request')
  create(@Body() createServiceRequestDto: CreateServiceRequestDto, @Req() req) {
    return this.servicesService.create(createServiceRequestDto, req.user.userId);
  }

  @Get('my-requests')
  findMyRequests(@Req() req) {
    return this.servicesService.findAllByUser(req.user.userId);
  }

  @Get('all')
  findAll() {
    return this.servicesService.findAll();
  }
}
