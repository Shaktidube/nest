import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as fs from 'fs/promises';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Multer adds `file` or `files` to request
    const files: Express.Multer.File[] = [];
    if (request.file) {
      files.push(request.file);
    }
    if (request.files) {
      if (Array.isArray(request.files)) {
        files.push(...request.files);
      } else {
        // when using fields, request.files is an object { fieldName: File[] }
        Object.values(request.files).forEach((f: any) => files.push(...f));
      }
    }

    return next.handle().pipe(
      finalize(async () => {
        // Always run after route handler finishes
        for (const f of files) {
          if (f?.path) {
            try {
              await fs.unlink(f.path);
              console.log(`Deleted temp file: ${f.path}`);
            } catch (err) {
              console.error(`Failed to delete file ${f.path}:`, err.message);
            }
          }
        }
      }),
    );
  }
}
