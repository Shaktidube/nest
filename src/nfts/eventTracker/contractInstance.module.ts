import { Module } from '@nestjs/common';
import { ContractService } from './contractInstance';

@Module({
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractInstanceModule {}
