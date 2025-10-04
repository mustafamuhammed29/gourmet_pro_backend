import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    UploadedFiles,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { SimpleRegisterDto } from './dto/simple-register.dto';
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
        // Validate that both required files are uploaded
        if (!files || !files.licenseFile?.[0] || !files.registryFile?.[0]) {
            throw new BadRequestException('Both license file and registry file are required');
        }

        const licensePath = files.licenseFile[0].path;
        const commercialRegistryPath = files.registryFile[0].path;
        
        return this.authService.register(
            registerDto,
            licensePath,
            commercialRegistryPath,
        );
    }

    @Post('register-simple')
    async registerSimple(@Body() registerDto: SimpleRegisterDto) {
        return this.authService.register(
            registerDto,
            '', // Empty license path for testing
            '', // Empty registry path for testing
        );
    }
}

