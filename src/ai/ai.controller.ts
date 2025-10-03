import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GeneratePostDto } from './dto/generate-post.dto';
import { IsNotEmpty, IsString } from 'class-validator';

// DTOs for other endpoints
class GenerateResponseDto {
    @IsString()
    @IsNotEmpty()
    review: string;
}

class EnhanceDescriptionDto {
    @IsString()
    @IsNotEmpty()
    description: string;
}

class TranslateDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-social-post')
    async generateSocialPost(@Body() generatePostDto: GeneratePostDto) {
        const content = await this.aiService.generateSocialPost(generatePostDto);
        return { content };
    }

    @Post('generate-review-response')
    async generateReviewResponse(@Body() dto: GenerateResponseDto) {
        const content = await this.aiService.generateReviewResponse(dto.review);
        return { content };
    }

    @Post('enhance-description')
    async enhanceDescription(@Body() dto: EnhanceDescriptionDto) {
        const content = await this.aiService.enhanceDescription(dto.description);
        return { content };
    }

    @Post('translate')
    async translate(@Body() dto: TranslateDto) {
        const content = await this.aiService.translateText(dto.text);
        return { content };
    }
}
