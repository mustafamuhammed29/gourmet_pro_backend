import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? file.path : undefined;
    return this.productsService.create(
      createProductDto,
      req.user.userId,
      imageUrl,
    );
  }

  // ✨ يجب وضع /my-products قبل /:id
  @Get('my-products')
  getMyProducts(@Req() req) {
    return this.productsService.findAll(req.user.userId);
  }

  @Get()
  findAll(@Req() req) {
    return this.productsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.productsService.findOne(parseInt(id, 10), req.user.userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? file.path : undefined;
    return this.productsService.update(
      parseInt(id, 10),
      updateProductDto,
      req.user.userId,
      imageUrl,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.productsService.remove(parseInt(id, 10), req.user.userId);
  }
}
