import { Injectable } from '@nestjs/common';
import { GeneratePostDto } from './dto/generate-post.dto';

@Injectable()
export class AiService {
    private async simulateAiResponse(delay = 1000): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    async generateSocialPost(dto: GeneratePostDto): Promise<string> {
        await this.simulateAiResponse(1500);
        return `🔥 لا تفوتوا تجربة طبقنا الجديد: ${dto.dishName}! 🔥\n\n${dto.dishDescription}\n\n#مطعم_الذواقة #${dto.dishName.replace(/ /g, '_')} #طعام_شهي`;
    }

    async generateReviewResponse(review: string): Promise<string> {
        await this.simulateAiResponse();
        // A simple logic to check for positive/negative words
        if (review.includes('ممتاز') || review.includes('رائع')) {
            return 'شكراً جزيلاً لك على كلماتك الرائعة! يسعدنا جداً أنك استمتعت بالتجربة ونتطلع لزيارتك مرة أخرى قريباً.';
        }
        return 'نشكرك على مشاركة رأيك. نأسف أن تجربتك لم تكن على المستوى المطلوب، ونود معرفة المزيد لتحسين خدماتنا.';
    }

    async enhanceDescription(description: string): Promise<string> {
        await this.simulateAiResponse();
        return `${description} - مُحضّر بعناية من أجود المكونات الطازجة لتقديم تجربة لا تُنسى.`;
    }

    async translateText(text: string): Promise<string> {
        await this.simulateAiResponse(500);
        return `${text} (Translated)`;
    }
}
