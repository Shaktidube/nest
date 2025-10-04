import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Get,
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
  @Get('nft-detail')
  async getNftById(@Request() req) {
    const id = req.query.id;
    console.log('id :', id);
    if (!id) {
      return { message: 'NFT ID is required', nft: null };
    }
    return this.nftsService.getNftById(id);
  }

  @Get('get-all-nfts')
  async getAllNfts(@Request() req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log('page, limit, skip :', page, limit, skip);
    return this.nftsService.getAllNFts(page, limit, skip);
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
