import {
	Get,
	Injectable,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findAllUsers() {
		return this.userRepository
			.find({
				select: {
					id: true,
					userId: true,
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	async findUserById(uid: string) {
		return this.userRepository
			.findOne({
				select: {
					id: true,
					userId: true,
					name: true,
					uniqueNum: true,
					status: true,
				},
				where: {
					userId: uid,
				},
			})
			.catch((err) => {
                console.log(12);
				throw new InternalServerErrorException();
			});
	}

	// 나중에 데코레이터로 만드는게 더 좋을것 같음.
	async isUniqueInfo(col: string, value: string) {
		if (col === 'userId') {
			return this.userRepository
				.findOne({
					where: {
						userId: value,
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		} else if (col === 'uniqueNum') {
			return this.userRepository
				.findOne({
					where: {
						uniqueNum: value,
					},
				})
				.catch((err) => {
					throw new InternalServerErrorException();
				});
		} else {
			throw new Error();
		}
	}

	async insertUser(createUserDto: CreateUserDto) {
		const { userId, password, name, uniqueNum, status } = createUserDto;
		const r1 = await this.isUniqueInfo('userId', userId);
		if (r1) {
			console.log(r1);
			return { code: 'FAIL', message: '중복 ID입니다.', dt: r1 };
		}

		const r2 = await this.isUniqueInfo('uniqueNum', uniqueNum);
		if (r2) {
			return { code: 'FAIL', message: '중복 학번입니다.', dt: r2 };
		}

		if (status !== 'student' && status !== 'professor') {
			return { code: 'FAIL', message: '잘못된 상태 정보 입니다.' };
		}

		await this.userRepository
			.insert({
				userId: userId,
				password: password,
				name: name,
				uniqueNum: uniqueNum,
				status: status,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', message: '유저 정보 추가에 성공했습니다.' };
	}

	//어드민 계정이 있을 수 있기 때문에, 실제 있는 계정인지 확인은 있어야 하지 않을까.
	async updateUser(uid: string, updateUserDto: UpdateUserDto) {
		const { name, password, status } = updateUserDto;
		const data = await this.findUserById(uid);

		if (!data) {
			return { code: 'FAIL', message: '존재하지 않는 ID입니다.' };
		}

		if (status !== 'student' && status !== 'professor') {
			return { code: 'FAIL', message: '잘못된 상태 정보 입니다.' };
		}

		await this.userRepository
			.update(data.id, {
				password: password,
				name: name,
				status: status,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return { code: 'SUCCESS', message: '유저 정보 변경에 성공했습니다.' };
	}

	// 삭제와 동시에 로그아웃 되어야함.
	async deleteUser(uid: string) {
		const data = await this.findUserById(uid);

		if (!data) {
			return { code: 'FAIL', message: '존재하지 않는 ID입니다.' };
		}

		await this.userRepository.delete(data.id).catch((err) => {
			throw new InternalServerErrorException();
		});

		return { code: 'SUCCESS', message: '유저 정보 삭제에 성공했습니다.' };
	}
}
