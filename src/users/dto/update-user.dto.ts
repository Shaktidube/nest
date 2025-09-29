import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

export class changeProfilePhotoDto {
  @IsNotEmpty()
  @IsString()
  sProfileImage: string;
}
