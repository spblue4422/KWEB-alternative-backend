import {
	Get,
	Injectable,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	findAllUsers() {
		return this.userRepository.find().catch((err) => {
			throw new InternalServerErrorException();
		});
	}

	findUserById(id: number) {
		return this.userRepository
			.findOne({
				where: {
					id: id,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	async insertUser() {
		await this.userRepository.insert({});
	}

	async updateUser() {}

	async deleteUser() {}
}
