import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { NftsModule } from './nfts/nfts.module';

@Module({
  imports: [UsersModule, AdminModule, NftsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
