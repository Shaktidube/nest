import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PinataSDK } from 'pinata';
import * as fs from 'fs';
import { Nft } from './models/nft.schema';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

@Injectable()
export class NftsService {
  private pinata: PinataSDK;
  constructor(
    @InjectModel(Nft.name) private NftModal: Model<Nft>,
    private configService: ConfigService,
  ) {
    this.pinata = new PinataSDK({
      pinataJwt: this.configService.get<string>('PINATA.PINATA_JWT'),
      pinataGateway: this.configService.get<string>('PINATA.GATEWAY_URL'),
    });
  }

  async uploadFile(
    file: { originalname: string; path: string; mimetype: string },
    sNftName: string,
    sDescription: string,
    nRoyalty: string,
    sTokenAddress: string,
  ) {
    console.log(
      'file , sNftName , sDescription , nRoyalty , sTokenAddress :',
      sNftName,
      sDescription,
      nRoyalty,
      sTokenAddress,
    );

    const responseData = {
      file: file.originalname,
      url: `${file.path}`,
    };

    const blob = new Blob([fs.readFileSync(file.path)]);
    const newFile = new File([blob], file.originalname, {
      type: file.mimetype,
    });
    const upload = await this.pinata.upload.public.file(newFile);
    console.log('File uploaded to Pinata:', upload);
    responseData.url = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;

    const sImageUrlExists = await this.NftModal.findOne({
      sImageUrl: responseData.url,
    });
    if (sImageUrlExists) {
      return { message: 'NFT with this image URL already exists', nft: null };
    }

    const metadata = {
      name: sNftName,
      description: sDescription,
      image: responseData.url,
      Royalty: nRoyalty,
      TokenAddress: sTokenAddress,
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    const metadataFile = new File([metadataBlob], `${sNftName}.json`, {
      type: 'application/json',
    });
    const metadataUpload = await this.pinata.upload.public.file(metadataFile);
    console.log('Metadata uploaded to Pinata:', metadataUpload);
    return {
      message: 'File uploaded successfully',
      url: {
        sTokenAddress: metadata.TokenAddress,
        sNftName: metadata.name,
        sDescription: metadata.description,
        sImageUrl: responseData.url,
        sMetadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataUpload.cid}`,
      },
    };
  }
  // create(createNftDto: CreateNftDto) {
  //   return 'This action adds a new nft';
  // }

  // getAllNFts() {
  //   return { message: 'List of all NFTs', nfts: [] };
  // }

  // getNftById(id: number) {
  //   return { message: `Details of NFT with id ${id}`, nft: null };
  // }

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
