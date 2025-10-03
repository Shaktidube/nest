import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { AuthGuard } from 'src/users/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileCleanupInterceptor } from 'src/interceptors/file-cleanup.interceptor';
import { diskStorage } from 'multer';
import { MintNftDto } from './dto/mint-nft.dto';
import {
  FILE_UPLOAD_PATH,
  fileNameEditor,
  imageFileFilter,
  MAX_FILE_SIZE,
} from 'src/utils/file.validation';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post('upload-nft-file')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('sFile', {
      storage: diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameEditor,
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
    FileCleanupInterceptor,
  )
  async uploadNftFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() mintNftDto: MintNftDto,
  ) {
    console.log('Uploaded file:', file);
    console.log('Mint NFT DTO:', mintNftDto);

    return this.nftsService.uploadFile(
      file,
      mintNftDto.sNftName,
      mintNftDto.sDescription,
      mintNftDto.nRoyalty,
      mintNftDto.sTokenAddress,
    );
  }
  // @Post()
  // create(@Body() createNftDto: CreateNftDto) {
  //   return this.nftsService.create(createNftDto);
  // }

  // @Get()
  // getAllNFts() {
  //   return this.nftsService.getAllNFts();
  // }

  // @Get(':id')
  // getNftById(@Param('id') id: string) {
  //   return this.nftsService.getNftById(+id);
  // }
}
