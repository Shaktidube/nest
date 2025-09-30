import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { NftsModule } from './nfts/nfts.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constant';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FileCleanupInterceptor } from './interceptors/file-cleanup.interceptor';

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
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL as string),
    UsersModule,
    AdminModule,
    NftsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: FileCleanupInterceptor },
  ],
})
export class AppModule {}
