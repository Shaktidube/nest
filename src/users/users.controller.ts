import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateNameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_UPLOAD_PATH, MAX_FILE_SIZE } from 'src/constant';
import { diskStorage } from 'multer';
import { fileNameEditor, imageFileFilter } from 'src/file.utils';
import { FileCleanupInterceptor } from 'src/interceptors/file-cleanup.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Get('get-all-users')
  async getAllUser(@Request() req) {
    const userRole = req.user.role;
    console.log('admin role :', userRole);
    if (userRole !== 'admin') {
      return { message: 'Access denied. Admins only.' };
    }
    return await this.usersService.findAllUser(userRole);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const id = req.user.id;
    console.log('userId:', id);
    return await this.usersService.viewUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update-username')
  async update(@Request() req, @Body() updateUserDto: UpdateNameDto) {
    const id = req.user.id;
    return await this.usersService.updateUserName(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: UpdatePasswordDto,
  ) {
    const id = req.user.id;
    return await this.usersService.updatePassword(id, changePasswordDto);
  }

  @Patch('change-profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameEditor,
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
    FileCleanupInterceptor,
  )
  async changeProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    console.log('Uploaded file:', file);
    const id = req.user.id;
    console.log('userId:', id);
    if (!file) {
      return { message: 'File upload failed' };
    }
    const photoPath = req.file ? req.file.path : null;
    console.log('req file path:', photoPath);
    return this.usersService.changeProfileImage(file, id);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  logout(@Request() req) {
    const id = req.user?.id;
    return this.usersService.removeUser(id);
  }
}
