import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  sName: string;

  @IsEmail()
  sEmail: string;
  
  @IsString()
  @IsNotEmpty()
  sPassword: string;
}
