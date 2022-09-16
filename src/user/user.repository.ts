import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}
}
