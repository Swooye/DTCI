import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('uploads')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public/uploads'),
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req: any, file: any, callback: any) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|avi)$/i)) {
          return callback(new BadRequestException('Only image and video (mp4/avi) files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // 返回可访问的 URL
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  @Post('base64')
  uploadBase64(@Body() body: { image: string, extension?: string }) {
    if (!body.image) {
      throw new BadRequestException('Image data is required');
    }
    let base64Data = body.image;
    // 如果包含 data:image/png;base64, 前缀，去掉它
    if (base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,/)) {
      base64Data = base64Data.replace(/^data:image\/[A-Za-z-+\/]+;base64,/, '');
    }

    const ext = body.extension || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = join(process.cwd(), 'public/uploads', filename);

    try {
      require('fs').writeFileSync(filePath, base64Data, 'base64');
      return {
        url: `/uploads/${filename}`,
        filename: filename,
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Failed to save base64 image');
    }
  }
}

