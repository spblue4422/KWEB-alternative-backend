import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

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

		if (data && (await compare(password, data.password))) {
			return data;
		}

		return null;
	}

	async userLogin(user) {
		const payload = {
			id: user.id,
			userId: user.userId,
			name: user.name,
			uN: user.uniqueNum,
			sts: user.status,
		};
		return {
			userId: user.userId,
			token: this.jwtService.sign(payload),
		};
	}
}
