import { forwardRef, Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from './models/nft.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }]),
  ],
  controllers: [NftsController],
  providers: [NftsService],
  exports: [MongooseModule, NftsService],
})
export class NftsModule {}
