import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  sName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  sEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(3, 50)
  sPassword: string;
}
