import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  signJWtForUser(oUser: any) {
    // const payload = { id: oUser._id, email: oUser.sEmail };
    return this.jwtService.sign(
      { id: oUser._id, email: oUser.sEmail, role: oUser.sRole },
      { secret: process.env.JWT_SECRET },
    );
  }

  async signUp(signUpDto: SignUpDto) {
    const { sName, sEmail, sPassword } = signUpDto;

    const hashedPassword = await bcrypt.hash(sPassword, 10);

    const oUser = await this.userModel.findOne({ sEmail });
    if (oUser) {
      return { message: 'Email already in use' };
    }

    const newUser = new this.userModel({
      sName,
      sEmail,
      sPassword: hashedPassword,
    });
    await newUser.save();
    
    const sToken = this.signJWtForUser(newUser);
    console.log('token:', sToken);
    return { message: 'User registered successfully', sToken };
  }

  async login(sEmail: string, sPassword: string) {
    const user = await this.userModel.findOne({ sEmail });
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(sPassword, user.sPassword);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return { message: 'Invalid credentials' };
    }

    const sToken = this.signJWtForUser(user);
    console.log('token:', sToken);
    user.isLoggedIn = true;
    await user.save();

    return { message: 'Login successful', sToken };
  }
}

// TODO: implement upload file functionality for profile image
