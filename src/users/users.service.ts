import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm'; --- IGNORE ---  used for postgres
import { User } from './entities/user.entity';
// import { Repository } from 'typeorm'; --- IGNORE --- used for postgres
import { changeProfilePhotoDto, UpdateNameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModal: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = new this.UserModal(createUserDto);
    return user.save();
  }

  async findAllUser(userEmail: string) {
    
    return await this.UserModal.find();
  }

  async viewUser(id: string) {
    const user = await this.UserModal.findById({_id: id});
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserName(id: string, updateUserDto: UpdateNameDto) {
    console.log("id:", id);
    console.log("updateUserDto:", updateUserDto);
    return this.UserModal.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async changeProfileImage(id: string, updateUserProfileImage: changeProfilePhotoDto) {
    console.log("id:", id);
    console.log("updateUserProfileImage:", updateUserProfileImage);
    return this.UserModal.findByIdAndUpdate(id, {
      sProfileImage: updateUserProfileImage.sProfileImage,
    });
  }

  async updatePassword(id: string, changeUserPassword: UpdatePasswordDto) {
    console.log("id:", id);
    console.log("changeUserPassword:", changeUserPassword);

    const hashedPassword = await bcrypt.hash(changeUserPassword.newPassword, 10);
    console.log("hashed Password : " , hashedPassword);

    const comparePassword = await bcrypt.compare(changeUserPassword.confirmPassword, hashedPassword);
    console.log("comparePassword:", comparePassword);
    
    if(!comparePassword){
      return {message : "newPassword and Confirm Password does not match"};
    }

    const user = await this.UserModal.findByIdAndUpdate(id, {
      sPassword: hashedPassword,
    });

    return {message : "Password changed successfully" , user};
    
  }

  editUsername(id: string, newUsername: string) {
    return this.UserModal.findByIdAndUpdate(id, {
      username: newUsername,
    });
  }

  removeUser(id: string) {
    return { message : "User logged out successfully"};
  }
}
