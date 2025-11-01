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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get('my-orders')
  findMyOrders(@Req() req) {
    return this.ordersService.findAllByRestaurant(req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    return this.ordersService.updateStatus(parseInt(id, 10), status, req.user.userId);
  }
}
