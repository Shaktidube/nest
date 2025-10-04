import { Module } from '@nestjs/common';
import { ContractService } from './contractInstance';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractInstanceModule {}
