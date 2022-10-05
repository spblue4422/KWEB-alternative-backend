import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

const fromAuthCookie = function () {
	return function (request) {
		if (request && request.cookies) {
			const token = request.cookies['Authorization'];
			return token;
		} else {
			return null;
		}
	};
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			jwtFromRequest: fromAuthCookie(),
			ignoreExpiration: false,
			secretOrKey: '4422spblue',
		});
	}

	async validate(payload: any) {
		return { id: payload.id, userId: payload.userId, status: payload.sts };
	}
}
