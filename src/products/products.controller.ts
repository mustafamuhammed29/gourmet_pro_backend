import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, Get, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

// تطبيق الحماية على كل المسارات في هذه الوحدة
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // POST /products (لإنشاء منتج)
    @Post()
    create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
        if (!req.user) throw new UnauthorizedException();
        return this.productsService.create(createProductDto, req.user.userId);
    }

    // GET /products (لعرض جميع المنتجات)
    @Get()
    findAll(@Req() req: Request) {
        if (!req.user) throw new UnauthorizedException();
        return this.productsService.findAllForRestaurant(req.user.userId);
    }

    // PATCH /products/:id (لتعديل منتج)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string, // للتأكد من أن المعرف هو UUID صالح
        @Body() updateProductDto: UpdateProductDto,
        @Req() req: Request
    ) {
        if (!req.user) throw new UnauthorizedException();
        return this.productsService.update(id, updateProductDto, req.user.userId);
    }

    // DELETE /products/:id (لحذف منتج)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
        if (!req.user) throw new UnauthorizedException();
        return this.productsService.remove(id, req.user.userId);
    }
}

