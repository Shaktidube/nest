import { IsNotEmpty, IsString } from 'class-validator';

export class MintNftDto {
  @IsString()
  @IsNotEmpty()
  sNftName: string;

  @IsString()
  @IsNotEmpty()
  sDescription: string;

  @IsString()
  @IsNotEmpty()
  nRoyalty: string;

  @IsString()
  @IsNotEmpty()
  sTokenAddress: string;
}
