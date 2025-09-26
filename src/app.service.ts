import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServer(): string {
    return `server is running on port ${process.env.PORT || 3000}`;
  }
}
