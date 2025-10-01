import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  sEmail: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(3, 50)
  sPassword: string;
}
