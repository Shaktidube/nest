import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  sEmail: string;

  @IsNotEmpty({ message: 'Password is required' })
  sPassword: string;
}
