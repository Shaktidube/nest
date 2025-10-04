// nfts-events.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ethers, Log } from 'ethers';
import { Server, Socket } from 'socket.io';
import { Nft } from '../models/nft.schema';
import { ContractService } from './contractInstance';
import { ConfigService } from '@nestjs/config';

// Define the NftMetadata type if not imported from elsewhere
type NftMetadata = {
  name: string;
  description: string;
  image: string;
  Royalty: number;
  TokenAddress: string;
};

@Injectable()
export class NftsEventsService {
  private readonly logger = new Logger(NftsEventsService.name);
  private readonly httpProvider: ethers.JsonRpcProvider;
  constructor(
    @InjectModel(Nft.name) private readonly nftModel: Model<Nft>,
    private contractService: ContractService,
    private configService: ConfigService,
  ) {
    this.httpProvider = new ethers.JsonRpcProvider(
      this.configService.get<string>('BLOCKCHAIN.JSON_RPC_PROVIDER'),
    );
  }

  async handleTransferEvent(
    from: string,
    to: string,
    tokenId: bigint,
    event: { log: Log },
    io: Server,
  ): Promise<void> {
    try {
      console.log(
        `Transfer: from: ${from}, to: ${to}, tokenId: ${tokenId}, contract: ${event.log.address}`,
      );

      // 1. Normal transfer
      if (from !== ethers.ZeroAddress && to !== ethers.ZeroAddress) {
        const txResponse: ethers.TransactionResponse | null =
          await this.httpProvider.getTransaction(event.log.transactionHash);

        if (!txResponse) {
          this.logger.error(
            `Transaction not found: ${event.log.transactionHash}`,
          );
          return;
        }

        const market = txResponse.to;
        this.logger.debug(`Transaction to: ${market}`);

        const marketContractInstance = this.contractService.getMarketContract();

        // const marketContractAddress = marketContractInstance.address;

        // if (!marketContractAddress.address) {
        //   this.logger.error('Market contract address is undefined');
        //   return;
        // }

        // if (market === marketContractAddress) {
        //   this.logger.log('NFT Listed in Market');
        //   return;
        // }

        const oUpdateNft = await this.nftModel.findOneAndUpdate(
          { nTokenId: tokenId.toString(), sTokenAddress: event.log.address },
          { sCurrentOwner: to, isApprovedForSale: false },
        );

        // const marketContractInstance = this.contractService.getMarketContract();
        const isListed = await marketContractInstance.listings(
          from,
          oUpdateNft?.sTokenAddress,
          tokenId,
        );
        this.logger.debug(`isListed: ${isListed}`);

        if (oUpdateNft) {
          this.logger.log('NFT owner updated successfully after transfer');
          io.emit('TransferEventDetected', {
            from,
            to,
            tokenId: tokenId.toString(),
            sTokenAddress: oUpdateNft.sTokenAddress,
          });
          return;
        }
      }

      // 2. Burn
      if (to === ethers.ZeroAddress) {
        this.logger.log('Burn event detected');
        await this.nftModel.deleteOne({
          nTokenId: tokenId.toString(),
          sTokenAddress: event.log.address,
        });
        this.logger.log('NFT deleted successfully after burn');
        io.emit('BurnEventDetected', {
          tokenId: tokenId.toString(),
          sTokenAddress: event.log.address,
        });
        return;
      }

      // 3. Mint or new NFT
      const contractInstance = this.contractService.getMintContract();
      const sTokenUri: string = await contractInstance.tokenURI(tokenId);
      this.logger.debug(`Token URI: ${sTokenUri}`);

      const response = await fetch(sTokenUri);
      if (!response.ok) {
        this.logger.error(`Failed to fetch metadata: ${response.statusText}`);
        return;
      }

      const metadata: NftMetadata = await response.json();
      this.logger.debug(`Metadata: ${JSON.stringify(metadata)}`);

      const {
        name: sNftName,
        description: sDescription,
        image: sImageUrl,
        Royalty: nRoyalty,
        TokenAddress: sTokenAddress,
      } = metadata;

      const sCurrentOwner = await contractInstance.ownerOf(tokenId);

      const baseData = {
        sTokenAddress,
        nTokenId: tokenId.toString(),
        sNftName,
        nNftPrice: 0,
        nRoyalty,
        sDescription,
        sImageUrl,
        sTokenUri,
        sCurrentOwner,
        isApprovedForSale: false,
        sFirstMInterAddress:
          from === ethers.ZeroAddress ? sCurrentOwner : undefined,
      };

      const isNftExist = await this.nftModel.findOne({
        nTokenId: tokenId.toString(),
        sTokenAddress,
      });

      if (isNftExist) {
        await this.nftModel.updateOne(
          { nTokenId: tokenId.toString(), sTokenAddress },
          {
            ...baseData,
            sFirstMInterAddress:
              isNftExist.sFirstMInterAddress || baseData.sFirstMInterAddress,
          },
        );
        this.logger.log('NFT updated.');
      } else {
        await this.nftModel.insertMany([baseData]);
        this.logger.log('NFT inserted.');
      }

      io.emit('NftTransferFromContract', {
        from,
        to,
        tokenId: tokenId.toString(),
        sTokenAddress,
      });
    } catch (error) {
      console.log(`Error in Transfer event: ${error}`);
    }
  }
}
