import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ImageProcessingService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  private readonly thumbnailsDir = join(this.uploadsDir, 'thumbnails');

  constructor() {
    // Ensure directories exist
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!existsSync(this.thumbnailsDir)) {
      mkdirSync(this.thumbnailsDir, { recursive: true });
    }
  }

  /**
   * Process and compress an uploaded image
   * @param inputPath Path to the original image
   * @param filename Desired filename for the processed image
   * @returns Object containing paths to the processed image and thumbnail
   */
  async processImage(inputPath: string, filename: string): Promise<{
    imagePath: string;
    thumbnailPath: string;
    imageUrl: string;
    thumbnailUrl: string;
  }> {
    const processedFilename = `processed_${filename}`;
    const thumbnailFilename = `thumb_${filename}`;
    
    const imagePath = join(this.uploadsDir, processedFilename);
    const thumbnailPath = join(this.thumbnailsDir, thumbnailFilename);

    try {
      // Process main image: resize to max 1200px width, compress
      await sharp(inputPath)
        .resize(1200, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toFile(imagePath);

      // Create thumbnail: 300x300px
      await sharp(inputPath)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: 80
        })
        .toFile(thumbnailPath);

      return {
        imagePath,
        thumbnailPath,
        imageUrl: `/uploads/${processedFilename}`,
        thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`
      };
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Get image dimensions
   * @param imagePath Path to the image file
   * @returns Image metadata
   */
  async getImageInfo(imagePath: string): Promise<sharp.Metadata> {
    try {
      return await sharp(imagePath).metadata();
    } catch (error) {
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }

  /**
   * Validate image file
   * @param imagePath Path to the image file
   * @returns True if valid image
   */
  async validateImage(imagePath: string): Promise<boolean> {
    try {
      const metadata = await this.getImageInfo(imagePath);
      
      // Check if it's a valid image format
      const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
      if (!validFormats.includes(metadata.format)) {
        return false;
      }

      // Check image dimensions (minimum 100x100, maximum 5000x5000)
      if (metadata.width < 100 || metadata.height < 100 ||
          metadata.width > 5000 || metadata.height > 5000) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
