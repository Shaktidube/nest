import { Controller, Post, Body, Request, Put, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { SignUpDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// import { AuthGuard } from 'src/users/auth.guard';
import { UsersService } from 'src/users/users.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetUsernameDto } from './dto/set-username.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // @Post('signup')
  // async signUp(@Body() signupDto: SignUpDto) {
  //   return await this.authService.signUp(signupDto);
  // }

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   return await this.authService.login(loginDto.sEmail, loginDto.sPassword);
  // }

  // @UseGuards(AuthGuard)
  // @Post('logout')
  // logout(@Request() req) {
  //   const id = req.user?.id;
  //   return this.usersService.logout(id);
  // }

  @Post('connect-wallet')
  async connectWallet(@Body() connectWalletDto: ConnectWalletDto) {
    return await this.authService.ConnectWallet(
      connectWalletDto.sWalletAddress,
    );
  }

  @Put('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(
      verifyEmailDto.sWalletAddress,
      verifyEmailDto.sEmail,
    );
  }

  @Put('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(
      verifyOtpDto.sWalletAddress,
      verifyOtpDto.sEmail,
      verifyOtpDto.nOtp,
    );
  }

  @Patch('set-username')
  async setUsername(@Body() setUsername: SetUsernameDto) {
    return await this.authService.setUsername(
      setUsername.sWalletAddress,
      setUsername.sUsername,
    );
  }

  @Patch('verify-email')
  async resendOtp(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(
      verifyEmailDto.sWalletAddress,
      verifyEmailDto.sEmail,
    );
  }
}
