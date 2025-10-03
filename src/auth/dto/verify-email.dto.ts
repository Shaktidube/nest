import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  sWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  sEmail: string;
}
