import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm'; --- IGNORE ---  used for postgres
import { User } from './entities/user.entity';
// import { Repository } from 'typeorm'; --- IGNORE --- used for postgres
import { UpdateNameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';
import * as fs from 'fs';
import { PinataSDK } from 'pinata';
@Injectable()
export class UsersService {
  private pinata: PinataSDK;
  constructor(@InjectModel(User.name) private UserModal: Model<User>) {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.GATEWAY_URL,
    });
  }

  create(createUserDto: CreateUserDto) {
    const user = new this.UserModal(createUserDto);
    return user.save();
  }

  async findAllUser(userRole: string) {
    return await this.UserModal.find();
  }

  async viewUser(id: string) {
    const user = await this.UserModal.findById({ _id: id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserName(id: string, updateUserDto: UpdateNameDto) {
    console.log('id:', id);
    console.log('updateUserDto:', updateUserDto);
    return this.UserModal.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async changeProfileImage(file: any, id: string) {
    console.log('id:', id);
    console.log('file:', file);
    console.log('file path:', file.path);
    console.log(" file's original name:", file.originalname);
    console.log(" file's mimetype:", file.mimetype);
    const oUser = await this.UserModal.findById({ _id: id });
    if (!oUser) {
      throw new Error('User not found');
    }

    const blob = new Blob([fs.readFileSync(file.path)]);
    const newFile = new File([blob], file.originalname, {
      type: file.mimetype,
    });
    const upload = await this.pinata.upload.public.file(newFile);
    console.log('File uploaded to Pinata:', upload);

    oUser.sProfileImage = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
    await oUser.save();
    return this.UserModal.findByIdAndUpdate(id, {
      sProfileImage: oUser.sProfileImage,
    });
  }

  async updatePassword(id: string, changeUserPassword: UpdatePasswordDto) {
    console.log('id:', id);
    console.log('changeUserPassword:', changeUserPassword);

    const hashedPassword = await bcrypt.hash(
      changeUserPassword.newPassword,
      10,
    );
    console.log('hashed Password : ', hashedPassword);

    const comparePassword = await bcrypt.compare(
      changeUserPassword.confirmPassword,
      hashedPassword,
    );
    console.log('comparePassword:', comparePassword);

    if (!comparePassword) {
      return { message: 'newPassword and Confirm Password does not match' };
    }

    const user = await this.UserModal.findByIdAndUpdate(id, {
      sPassword: hashedPassword,
    });

    return { message: 'Password changed successfully', user };
  }

  editUsername(id: string, newUsername: string) {
    return this.UserModal.findByIdAndUpdate(id, {
      username: newUsername,
    });
  }

  removeUser(id: string) {
    return { message: 'User logged out successfully' };
  }
}
