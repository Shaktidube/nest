import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Headers,
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
import { User } from 'src/customDecorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('get-profile')
  @UseGuards(AuthGuard)
  async getProfile(@Headers('Authorization') authHeader: string) {
    const sToken = authHeader?.split(' ')[1];
    console.log('sToken:', sToken);
    return await this.usersService.getProfile(sToken);
  }

  // @Get('get-your-nfts')
  // @UseGuards(AuthGuard)
  // async getYourNfts(
  //   @Headers('Authorization') authHeader: string,
  //   @Request() req,
  // ) {
  //   const sToken = authHeader?.split(' ')[1];
  //   console.log('sToken:', sToken);
  //   const page = parseInt(req.query.page) || 1;
  //   const limits = parseInt(req.query.limits) || 10;
  //   const skip = (page - 1) * limits;
  //   return await this.usersService.getYourNfts(sToken, page, limits, skip);
  // }

  // @UseGuards(AuthGuard)
  // @Get('get-all-users')
  // async getAllUser(@User('role') userRole: string) {
  //   // const userRole = req.user.role;
  //   console.log('admin role :', userRole);
  //   if (userRole !== 'admin') {
  //     return { message: 'Access denied. Admins only.' };
  //   }
  //   return await this.usersService.findAllUser(userRole);
  // }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // async getProfile(@User('id') id: string) {
  //   // const id = req.user.id;
  //   console.log('userId:', id);
  //   return await this.usersService.viewUser(id);
  // }

  // @UseGuards(AuthGuard)
  // @Patch('update-username')
  // async update(@User('id') id: string, @Body() updateUserDto: UpdateNameDto) {
  //   return await this.usersService.updateUserName(id, updateUserDto);
  // }

  // @UseGuards(AuthGuard)
  // @Patch('change-password')
  // async changePassword(
  //   @User('id') id: string,
  //   @Body() changePasswordDto: UpdatePasswordDto,
  // ) {
  //   // const id = req.user.id;
  //   return await this.usersService.updatePassword(id, changePasswordDto);
  // }

  // @Patch('change-profile-image')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: FILE_UPLOAD_PATH,
  //       filename: fileNameEditor,
  //     }),
  //     limits: { fileSize: MAX_FILE_SIZE },
  //     fileFilter: imageFileFilter,
  //   }),
  //   FileCleanupInterceptor,
  // )
  // async changeProfileImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req,
  // ) {
  //   console.log('Uploaded file:', file);
  //   const id = req.user.id;
  //   console.log('userId:', id);
  //   if (!file) {
  //     return { message: 'File upload failed' };
  //   }
  //   const photoPath = req.file ? req.file.path : null;
  //   console.log('req file path:', photoPath);
  //   return this.usersService.changeProfileImage(file, id);
  // }

  // @UseGuards(AuthGuard)
  // @Post('logout')
  // logout(@User('id') id: string) {
  //   // const id = req.user?.id;
  //   return this.usersService.logout(id);
  // }
}
