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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto, @Req() req) {
        return this.productsService.create(createProductDto, req.user.userId);
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
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Req() req,
    ) {
        return this.productsService.update(
            parseInt(id, 10),
            updateProductDto,
            req.user.userId,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.productsService.remove(parseInt(id, 10), req.user.userId);
    }
}
