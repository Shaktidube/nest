import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm'; --- IGNORE ---  used for postgres
import { User } from './model/user.schema';
// import { Repository } from 'typeorm'; --- IGNORE --- used for postgres
import { UpdateNameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';
import * as fs from 'fs';
import { PinataSDK } from 'pinata';
import { Socket } from 'socket.io';
import { Nft } from 'src/nfts/models/nft.schema';
import config from 'src/config/config';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  private pinata: PinataSDK;
  constructor(
    @InjectModel(User.name) private UserModal: Model<User>,
    @InjectModel(Nft.name) private NftModal: Model<Nft>,
    private configService: ConfigService,
  ) {
    this.pinata = new PinataSDK({
      pinataJwt: this.configService.get<string>('PINATA.PINATA_JWT'),
      pinataGateway: this.configService.get<string>('PINATA.GATEWAY_URL'),
    });
  }

  create(createUserDto: CreateUserDto) {
    const user = new this.UserModal(createUserDto);
    return user.save();
  }

  async getProfile(sToken: string) {
    const user = await this.UserModal.findOne({ sToken });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User profile retrieved',
      data: {
        sWalletAddress: user.sWalletAddress,
        sEmail: user.sEmail,
        sToken: user.sToken,
        sUsername: user.sUsername || '',
        isVerified: user.isEmailVerified,
        sUserProfileImage: user.sUserProfileImage,
      },
    };
  }

  async getYourNfts(
    sToken: string,
    page: number,
    limits: number,
    skip: number,
  ) {
    const oUser = await this.UserModal.findOne({ sToken });
    if (!oUser) {
      throw new NotFoundException('User not found');
    }

    const nfts = await this.NftModal.find({
      sCurrentOwner: oUser.sWalletAddress,
    })
      .skip(skip)
      .limit(limits)
      .sort({ createdAt: -1 });

    if (nfts.length === 0) {
      return {
        message: 'No NFTs found',
        nfts: nfts,
        page: page,
        totalPages: Math.ceil(
          (await this.NftModal.countDocuments({
            sCurrentOwner: oUser.sWalletAddress,
          })) / limits,
        ),
        totalNfts: await this.NftModal.countDocuments({
          sCurrentOwner: oUser.sWalletAddress,
        }),
      };
    }
  }

  // async findAllUser(userRole: string) {
  //   return await this.UserModal.find();
  // }

  // async viewUser(id: string) {
  //   const user = await this.UserModal.findOne({ _id: id, isLoggedIn: true });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return user;
  // }

  // async updateUserName(id: string, updateUserDto: UpdateNameDto) {
  //   console.log('id:', id);
  //   console.log('updateUserDto:', updateUserDto);
  //   // return this.UserModal.findAndUpdate(id, updateUserDto, { new: true });

  //   const oUser = await this.UserModal.findOne({ _id: id, isLoggedIn: true });
  //   if (!oUser) {
  //     throw new Error('User not found');
  //   }
  //   return this.UserModal.findByIdAndUpdate(id, {
  //     sName: updateUserDto.sName,
  //   });
  // }

  // async changeProfileImage(file: any, id: string) {
  //   console.log('id:', id);
  //   console.log('file:', file);
  //   console.log('file path:', file.path);
  //   console.log(" file's original name:", file.originalname);
  //   console.log(" file's mimetype:", file.mimetype);
  //   const oUser = await this.UserModal.findOne({ _id: id, isLoggedIn: true });
  //   if (!oUser) {
  //     throw new Error('User not found');
  //   }

  // const blob = new Blob([fs.readFileSync(file.path)]);
  // const newFile = new File([blob], file.originalname, {
  //   type: file.mimetype,
  // });
  // const upload = await this.pinata.upload.public.file(newFile);
  // console.log('File uploaded to Pinata:', upload);

  //   oUser.sProfileImage = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
  //   await oUser.save();
  //   return this.UserModal.findByIdAndUpdate(id, {
  //     sProfileImage: oUser.sProfileImage,
  //   });
  // }

  // async updatePassword(id: string, changeUserPassword: UpdatePasswordDto) {
  //   console.log('id:', id);
  //   console.log('changeUserPassword:', changeUserPassword);

  //   const hashedPassword = await bcrypt.hash(
  //     changeUserPassword.newPassword,
  //     10,
  //   );
  //   console.log('hashed Password : ', hashedPassword);

  //   const comparePassword = await bcrypt.compare(
  //     changeUserPassword.confirmPassword,
  //     hashedPassword,
  //   );
  //   console.log('comparePassword:', comparePassword);

  //   if (!comparePassword) {
  //     return { message: 'newPassword and Confirm Password does not match' };
  //   }

  //   const oUser = await this.UserModal.findByIdAndUpdate(id, {
  //     sPassword: hashedPassword,
  //   });

  //   return { message: 'Password changed successfully' };
  // }

  // editUsername(id: string, newUsername: string) {
  //   return this.UserModal.findByIdAndUpdate(id, {
  //     username: newUsername,
  //   });
  // }

  // async logout(id: string) {
  //   const oUser = await this.UserModal.findOne({ _id: id, isLoggedIn: true });
  //   if (!oUser) {
  //     throw new Error('User not found');
  //   }
  //   oUser.isLoggedIn = false;
  //   oUser.sToken = '';
  //   await oUser.save();
  //   return { message: 'User logged out successfully' };
  // }
}
