import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'userId',
			passwordField: 'password',
		});
	}

	async validate(userId: string, password: string): Promise<User> {
		const data = await this.authService.validateUser(userId, password);

		if (!data) {
			throw new UnauthorizedException();
		}

		return data;
	}
}
