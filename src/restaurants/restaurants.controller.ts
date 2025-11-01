import {
    Controller,
    Get,
    UseGuards,
    Req,
    Body,
    Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

// ✨ حماية جميع المسارات في هذا الـ Controller
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    // ✨ مسار لجلب بيانات المطعم الخاص بالمستخدم المسجل دخوله
    @Get('my-restaurant')
    getMyRestaurant(@Req() req) {
        // req.user.userId يتم إضافته بواسطة JwtAuthGuard
        return this.restaurantsService.findOneByOwnerId(req.user.userId);
    }

    // ✨ مسار لتحديث بيانات المطعم الخاص بالمستخدم المسجل دخوله
    @Patch('my-restaurant')
    updateMyRestaurant(@Req() req, @Body() body: UpdateRestaurantDto) {
        return this.restaurantsService.update(req.user.userId, body);
    }

    // ✨ مسار جديد لجلب جميع المطاعم المسجلة
    @Get()
    getAllRestaurants() {
        return this.restaurantsService.findAll();
    }
}
