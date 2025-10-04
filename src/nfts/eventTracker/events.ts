import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common'; // Import from common
import { NftsEventsService } from './eventsMethods';
import { ContractService } from './contractInstance';

@WebSocketGateway(4001, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class AppGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(AppGateway.name);
  // private eventListeners: any[] = []; // To track event listeners for cleanup

  constructor(
    private readonly nftsEventsService: NftsEventsService,
    private contractService: ContractService,
  ) {}

  onModuleInit() {
    this.setupContractListeners();
    console.log('AppGateway module initialized and contract listeners set up');
  }

  onModuleDestroy() {
    console.log('cleaning up .........');
    this.cleanupContractListeners();
  }

  private setupContractListeners() {
    try {
      const contract = this.contractService.getMintContract();
      console.log('Mint contract:', contract.target);
      console.log('Setting up contract event listeners');

      // Listen for Transfer events
      contract.on('Transfer', (from, to, tokenId, event) => {
        console.log(`Transfer event: ${tokenId} from ${from} to ${to}`);

        void this.nftsEventsService
          .handleTransferEvent(from, to, tokenId, event, this.server)
          .catch((err) => {
            console.error('Error handling Transfer event:', err);
          });
      });

      // this.eventListeners.push(transferListener);
      console.log('Contract event setup completed');
    } catch (error) {
      console.error('Failed to setup contract listeners:', error);
    }
  }

  private cleanupContractListeners() {
    try {
      // for (const listener of th) {
      //   // Remove event listeners
      //   listener.removeAllListeners();
      // }
      // this.eventListeners = [];
      console.log('cleaned up');
    } catch (error) {
      console.error('Error cleaning up contract listeners:', error);
    }
  }
}
