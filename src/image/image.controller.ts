import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { number } from 'src/@common/constants';
import * as fs from 'fs';
import { PutObjectAclCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getUniqueFileName } from 'src/@common/utils';

// uploads 폴더가 있는지 확인하고 없으면 생성한다.
// try catch 사용한 이유
// 파일 시스템 작업에서 발생할 수 있는 다양한 예외 상황을 포괄적으로 처리합니다.
// 코드가 더 간결하고 명확합니다.
// 경쟁 조건과 같은 동시성 문제를 보다 효과적으로 처리할 수 있습니다

// 데코레이터와 Multer 를 이용해서 이미지 업로드 하는 기능
@Controller('images')
@UseGuards(AuthGuard())
export class ImageController {
  @UseInterceptors(
    // 디스크 스토리지에 업로드했던 이미지 컨트롤러 부분을 S3에 업로드하게 수정
    FilesInterceptor('images', number.MAX_IMAGE_COUNT, {
      limits: { fileSize: number.MAX_IMAGE_SIZE }, //20MB
    }),
  )
  @Post('/')
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    // 고유한 id 만들기 위해
    const uuid = Date.now();

    const uploadPromises = files.map((file) => {
      const fileName = getUniqueFileName(file, uuid);
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `original/${fileName}`,
        Body: file.buffer,
      };
      const command = new PutObjectCommand(uploadParams);

      return s3Client.send(command);
    });

    await Promise.all(uploadPromises);

    const uris = files.map((file) => {
      const fileName = getUniqueFileName(file, uuid);

      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/original/${fileName}`;
    });

    return uris;
  }
}
