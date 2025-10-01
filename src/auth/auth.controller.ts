import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/users/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto) {
    return await this.authService.signUp(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.sEmail, loginDto.sPassword);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Request() req) {
    const id = req.user?.id;
    return this.usersService.logout(id);
  }
}
