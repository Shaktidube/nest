import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { mediaAbi } from 'src/abis/mediaAbi';
import { mintAbi } from 'src/abis/mintAbi';

@Injectable()
export class ContractService {
  private readonly httpProvider: ethers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>(
      'BLOCKCHAIN.JSON_RPC_PROVIDER',
    );
    if (!rpcUrl) {
      throw new Error('JSON_RPC_PROVIDER is not defined');
    }
    this.httpProvider = new ethers.JsonRpcProvider(rpcUrl);
  }

  getMediaContract(): ethers.Contract {
    const mediaContractAddress = this.configService.get<string>(
      'BLOCKCHAIN.CONTRACTS.MEDIA',
    );
    if (!mediaContractAddress) {
      throw new Error('MEDIA_CONTRACT_ADDRESS is not defined');
    }
    return new ethers.Contract(
      mediaContractAddress,
      mediaAbi,
      this.httpProvider,
    );
  }

  getMarketContract(): ethers.Contract {
    const marketContractAddress = this.configService.get<string>(
      'BLOCKCHAIN.CONTRACTS.MARKET',
    );
    if (!marketContractAddress) {
      throw new Error('MARKET_CONTRACT_ADDRESS is not defined');
    }
    return new ethers.Contract(
      marketContractAddress,
      mediaAbi,
      this.httpProvider,
    );
  }

  getMintContract(): ethers.Contract {
    const mintContractAddress = this.configService.get<string>(
      'BLOCKCHAIN.CONTRACTS.MINT',
    );
    if (!mintContractAddress) {
      throw new Error('MINT_CONTRACT_ADDRESS is not defined');
    }
    return new ethers.Contract(mintContractAddress, mintAbi, this.httpProvider);
  }
}
