import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post()
  create(@Body() createNftDto: CreateNftDto) {
    return this.nftsService.create(createNftDto);
  }

  @Get()
  getAllNFts() {
    return this.nftsService.getAllNFts();
  }

  @Get(':id')
  getNftById(@Param('id') id: string) {
    return this.nftsService.getNftById(+id);
  }
}
