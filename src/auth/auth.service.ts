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

    const token = this.jwtService.sign({
      id: newUser._id,
      email: newUser.sEmail,
    });
    return { message: 'User registered successfully', token };
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

    const token = this.jwtService.sign({
      id: user._id,
      email: user.sEmail,
    });
    user.isLoggedIn = true;
    await user.save();

    return { message: 'Login successful', token };
  }
}

// TODO: implement upload file functionality for profile image
