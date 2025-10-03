import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DB_URL');
        console.log('MongoDB connection string:', uri);

        if (!uri) {
          throw new Error('MongoDB connection string is not defined');
        }

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          serverSelectionTimeoutMS: 5000,
          bufferCommands: false,
          maxPoolSize: 10,
          minPoolSize: 1,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
