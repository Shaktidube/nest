import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

export class UpdateNameDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  sName: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

// export class filepath {
//   @IsNotEmpty()
//   @IsString()
//   sProfileImage: string;
// }

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;

    const validFileType = this.validateFileType(value);
    if (!validFileType) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }

    const validFileSize = this.validateFileSize(value);
    if (!validFileSize) {
      throw new Error('File size exceeds the limit of 1KB.');
    }

    return value;
  }

  private validateFileType(value: any): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    return allowedMimeTypes.includes(value.mimetype);
  }

  private validateFileSize(value: any): boolean {
    const oneKb = 1000; // 1KB in bytes
    return value.size < oneKb;
  }
}
