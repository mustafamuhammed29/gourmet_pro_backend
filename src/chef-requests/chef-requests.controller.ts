import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChefRequestsService } from './chef-requests.service';
import { CreateChefRequestDto } from './dto/create-chef-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chef-requests')
export class ChefRequestsController {
  constructor(private readonly chefRequestsService: ChefRequestsService) {}

  @Post()
  create(@Body() createChefRequestDto: CreateChefRequestDto, @Req() req) {
    return this.chefRequestsService.create(createChefRequestDto, req.user.userId);
  }

  @Get('my-requests')
  findMyRequests(@Req() req) {
    return this.chefRequestsService.findAllByRestaurant(req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    return this.chefRequestsService.updateStatus(
      parseInt(id, 10),
      status,
      req.user.userId,
    );
  }
}
