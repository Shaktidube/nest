import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateNameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { AuthGuard } from './auth.guard';

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
    const userEmail = req.user.email;
    console.log('admin email :' , userEmail);
    return await this.usersService.findAllUser(userEmail);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const id = req.user.id;
    console.log("userId:", id);
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
  async changePassword(@Request() req , @Body() changePasswordDto : UpdatePasswordDto) {
    const id = req.user.id;
    return await this.usersService.updatePassword(id, changePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  logout(@Request() req) {
    const id = req.user.id;
    return this.usersService.removeUser(id);
  }
}
