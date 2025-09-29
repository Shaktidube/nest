import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm'; --- IGNORE ---  used for postgres
import { User } from './entities/user.entity';
// import { Repository } from 'typeorm'; --- IGNORE --- used for postgres
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModal: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = new this.UserModal(createUserDto);
    return user.save();
  }

  findAllUser() {
    return this.UserModal.find();
  }

  async viewUser(id: number) {
    const user = await this.UserModal.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.UserModal.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  editUsername(id: number, newUsername: string) {
    return this.UserModal.findByIdAndUpdate(id, {
      username: newUsername,
    });
  }

  removeUser(id: number) {
    return this.UserModal.findByIdAndDelete(id);
  }
}
