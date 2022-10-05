import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.register({
			secret: '4422spblue',
			signOptions: { expiresIn: 1800 },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
