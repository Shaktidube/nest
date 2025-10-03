import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  sWalletAddress: string;

  @IsEmail()
  @IsNotEmpty()
  sEmail: string;

  // @IsNumber()
  @IsNotEmpty()
  nOtp: number;
}
