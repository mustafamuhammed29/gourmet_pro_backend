import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'licenseFile', maxCount: 1 },
            { name: 'registryFile', maxCount: 1 },
        ]),
    )
    async register(
        @Body() registerDto: RegisterDto,
        @UploadedFiles()
        files: {
            licenseFile?: Express.Multer.File[];
            registryFile?: Express.Multer.File[];
        },
    ) {
        //
        const licensePath = files.licenseFile?.[0]?.path ?? '';
        const commercialRegistryPath = files.registryFile?.[0]?.path ?? '';
        // -- تم التعديل هنا --
        //
        return this.authService.register(
            registerDto,
            licensePath,
            commercialRegistryPath,
        );
    }
}

