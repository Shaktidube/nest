import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { NftsModule } from './nfts/nfts.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FileCleanupInterceptor } from './interceptors/file-cleanup.interceptor';
// import { ChatGateway } from './chat/chat.gateway';
import config from './config/config';
import { DatabaseModule } from './DbConfig/db.module';
import { AppGateway } from './nfts/eventTracker/events';
import { NftsEventsService } from './nfts/eventTracker/eventsMethods';
import { ContractInstanceModule } from './nfts/eventTracker/contractInstance.module';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './utils/file.validation';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MulterModule.register({
      dest: function (req, file, cb: (error: any, filename: string) => void) {
        cb(null, 'uploads/');
      },
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    DatabaseModule,
    ContractInstanceModule,
    ChatModule,
    UsersModule,
    AdminModule,
    NftsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    NftsEventsService,
    { provide: APP_INTERCEPTOR, useClass: FileCleanupInterceptor },
  ],
})
export class AppModule {}
