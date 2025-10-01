import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateNameDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  sName: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  confirmPassword: string;
}
