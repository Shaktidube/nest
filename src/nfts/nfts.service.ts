import { Injectable } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';

@Injectable()
export class NftsService {
  create(createNftDto: CreateNftDto) {
    return 'This action adds a new nft';
  }

  getAllNFts() {
    return { message: 'List of all NFTs', nfts: [] };
  }

  getNftById(id: number) {
    return { message: `Details of NFT with id ${id}`, nft: null };
  }

  // findAll() {
  //   return `This action returns all nfts`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} nft`;
  // }

  // update(id: number, updateNftDto: UpdateNftDto) {
  //   return `This action updates a #${id} nft`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} nft`;
  // }
}
