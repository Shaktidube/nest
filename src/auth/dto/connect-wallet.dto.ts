import { IsString } from 'class-validator';

export class ConnectWalletDto {
  @IsString()
  sWalletAddress: string;
}
