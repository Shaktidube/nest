import { IsNotEmpty, IsString } from 'class-validator';

export class SetUsernameDto {
  @IsString()
  @IsNotEmpty()
  sWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  sUsername: string;
}
