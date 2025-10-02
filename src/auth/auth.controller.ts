import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'licenseFile', maxCount: 1 },
            { name: 'registryFile', maxCount: 1 },
        ]),
    )
    async register(
        @UploadedFiles()
        files: { licenseFile?: Express.Multer.File[]; registryFile?: Express.Multer.File[] },
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto, files);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
