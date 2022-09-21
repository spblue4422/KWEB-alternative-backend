import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		private readonly jwtService: JwtService,
	) {}

	async validateUser(uid: string, password: string): Promise<User> {
		const data: User = await this.userRepository
			.findOne({
				where: {
					userId: uid,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		if (data && data.password == password) {
			return data;
		}

		return null;
	}

	async login(user) {
		const payload = { userId: user.userId, sub: user.id };
		return { access_token: this.jwtService.sign(payload) };
	}
}
