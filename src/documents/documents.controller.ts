import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post('upload-registration')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'licenseFile', maxCount: 1 },
      { name: 'registryFile', maxCount: 1 },
    ]),
  )
  async uploadRegistrationFiles(
    @Req() req,
    @UploadedFiles()
    files: {
      licenseFile?: Express.Multer.File[];
      registryFile?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.userId;
    const licenseFile = files.licenseFile?.[0];
    const registryFile = files.registryFile?.[0];

    if (!licenseFile || !registryFile) {
      throw new BadRequestException('Both license and registry files are required.');
    }

    return this.documentsService.assignDocumentsToRestaurant(
      userId,
      licenseFile.path,
      registryFile.path,
    );
  }
}
