import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/model/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  signJWtForUser(payload: any) {
    // const payload = { id: oUser._id, email: oUser.sEmail };
    return this.jwtService.sign(
      {
        payload,
      },
      { secret: this.configService.get<string>('JWT.SECRET') },
    );
  }

  async ConnectWallet(sWalletAddress: string) {
    console.log('sWalletAddress:', sWalletAddress);

    const sToken = this.signJWtForUser({ sWalletAddress });
    console.log('token:', sToken);

    const oExistingUser = await this.userModel.findOne({ sWalletAddress });
    if (oExistingUser) {
      oExistingUser.sToken = sToken;
      await oExistingUser.save();
      return {
        message: 'Wallet connected successfully',
        data: {
          sWalletAddress: oExistingUser.sWalletAddress,
          sToken: oExistingUser.sToken,
          isVerified: oExistingUser.isEmailVerified,
          sEmail: oExistingUser.sEmail,
          sUsername: oExistingUser.sUsername,
          sUserProfileImage: oExistingUser.sUserProfileImage,
        },
      };
    }

    const newUser = new this.userModel({
      sWalletAddress,
      sToken,
      sUserProfileImage: this.configService.get<string>(
        'USER.USER_PROFILE_IMAGE_URL_DEFAULT',
      ),
    });
    await newUser.save();

    return {
      message: 'Wallet connected successfully',
      data: {
        sWalletAddress: newUser.sWalletAddress,
        sToken: newUser.sToken,
        isVerified: newUser.isEmailVerified,
        sEmail: newUser.sEmail,
        sUsername: newUser.sUsername || '',
        sUserProfileImage: newUser.sUserProfileImage,
      },
    };
  }

  async verifyEmail(sWalletAddress: string, sEmail: string) {
    console.log('sWalletAddress:', sWalletAddress);
    console.log('sEmail:', sEmail);

    const oExistingUser = await this.userModel.findOne({ sWalletAddress });

    if (!oExistingUser) {
      return { message: 'User not found' };
    }

    if (oExistingUser.isEmailVerified) {
      return { message: 'Email already exists' };
    }

    const oEmailUser = await this.userModel.findOne({ sEmail });

    if (oEmailUser) {
      return { message: 'Email already exists' };
    }

    const nOtp = Math.floor(100000 + Math.random() * 900000);
    oExistingUser.nOtp = nOtp;
    oExistingUser.nOtpExpiryTime = Date.now() + 2 * 60 * 1000;

    const nOtpExpiresIn = new Date(
      oExistingUser.nOtpExpiryTime,
    ).toLocaleString();

    await oExistingUser.save();

    // const nOtpExpiresIn = oExistingUser.nOtpExpiryTime.toLocaleString();

    await this.mailService.send(
      'verifyEmail.ejs',
      { otp: nOtp, nOtpExpiresIn },
      {
        from: this.configService.get<string>('EMAIL.FROM'),
        to: sEmail,
        subject: 'Verify Email',
      },
    );

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(sWalletAddress: string, sEmail: string, nOtp: number) {
    console.log('nOtp', nOtp, typeof nOtp);
    const user = await this.userModel.findOne({ sWalletAddress });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentTime = Date.now();
    console.log('user otp ,', user?.nOtp);

    if (user.nOtp !== nOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (currentTime > user.nOtpExpiryTime) {
      throw new BadRequestException('OTP expired');
    }

    user.sEmail = sEmail;
    user.isEmailVerified = true;
    user.sUsername = '';
    user.nOtp = 0;
    user.nOtpExpiryTime = 0;

    await user.save();

    return {
      message: 'Email verified successfully',
      data: {
        sWalletAddress: user.sWalletAddress,
        sToken: user.sToken,
        isVerified: user.isEmailVerified,
        sEmail: user.sEmail,
        sUsername: user.sUsername || '',
        sUserProfileImage: user.sUserProfileImage,
      },
    };
  }

  async setUsername(sWalletAddress: string, sUsername: string) {
    const oExistingUser = await this.userModel.findOne({ sWalletAddress });

    if (!oExistingUser) {
      throw new NotFoundException('User not found');
    }

    const isUsernameExists = await this.userModel.findOne({ sUsername });

    if (
      isUsernameExists &&
      sWalletAddress !== isUsernameExists.sWalletAddress
    ) {
      throw new BadRequestException('Username already exists');
    }

    oExistingUser.sUsername = sUsername;
    await oExistingUser.save();

    return {
      message: 'Username set successfully',
      data: {
        sWalletAddress: oExistingUser.sWalletAddress,
        sToken: oExistingUser.sToken,
        isVerified: oExistingUser.isEmailVerified,
        sEmail: oExistingUser.sEmail,
        sUsername: oExistingUser.sUsername || '',
        sUserProfileImage: oExistingUser.sUserProfileImage,
      },
    };
  }

  // async signUp(signUpDto: SignUpDto) {
  //   const { sName, sEmail, sPassword } = signUpDto;

  //   const hashedPassword = await bcrypt.hash(sPassword, 10);

  //   const oUser = await this.userModel.findOne({ sEmail });
  //   if (oUser) {
  //     return { message: 'Email already in use' };
  //   }

  //   const newUser = new this.userModel({
  //     sName,
  //     sEmail,
  //     sPassword: hashedPassword,
  //   });
  //   await newUser.save();

  //   // const adminUser = new this.userModel({
  //   //   sName: 'admin',
  //   //   sEmail: 'admin@gmail.com',
  //   //   sPassword: await bcrypt.hash('admin123', 10),
  //   //   sRole: 'admin',
  //   // });
  //   // await adminUser.save();

  //   // const sToken = this.signJWtForUser(newUser);
  //   // console.log('token:', sToken);
  //   return { message: 'User registered successfully', user: newUser };
  // }

  // async login(sEmail: string, sPassword: string) {
  //   const user = await this.userModel.findOne({ sEmail });
  //   if (!user) {
  //     return { message: 'Invalid credentials' };
  //   }

  //   const isPasswordValid = await bcrypt.compare(sPassword, user.sPassword);
  //   console.log(isPasswordValid);
  //   if (!isPasswordValid) {
  //     return { message: 'Invalid credentials' };
  //   }

  //   const sToken = this.signJWtForUser(user);
  //   console.log('token:', sToken);
  //   user.isLoggedIn = true;
  //   await user.save();

  //   return { message: 'Login successfully', sToken };
  // }

  // async logout(id: string) {
  //   const oUser = await this.userModel.findById({ _id: id });
  //   if (!oUser) {
  //     throw new Error('User not found');
  //   }
  //   oUser.isLoggedIn = false;
  //   oUser.sToken = '';
  //   await oUser.save();
  //   return { message: 'User logged out successfully' };
  // }
}
