import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createUserInput: CreateUserInput) {
    const { email, password } = createUserInput;
    const check = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (check) throw new BadRequestException('Email Taken!');
    const user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User Not Found!');

    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const { email, password } = updateUserInput;
    const payload = {
      email,
      password,
    };
    const check = await this.repo.findOne({
      where: {
        email,
      },
    });

    await this.repo.update(id, payload);
    return 'User Profile Updated';
  }

  async remove(id: number) {
    const user = await this.repo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.repo.remove(user);
    return 'User Profile Deleted';
  }
}
