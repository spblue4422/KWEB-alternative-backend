import {
	Get,
	Injectable,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	// 전체 유저 조회
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

	// 유저들 조회
	async findAllUsersByIds(list: number[]): Promise<User[]> {
		return await this.userRepository
			.find({
				select: {
					id: true,
					userId: true,
					name: true,
					uniqueNum: true,
					createdDate: true,
				},
				where: {
					id: In(list),
				},
				order: {
					name: 'ASC',
				},
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});
	}

	// 유저 조회
	async findUserByUserId(uid: string) {
		return this.userRepository
			.findOne({
				select: {
					id: true,
					name: true,
					userId: true,
					uniqueNum: true,
					createdDate: true,
					status: true,
				},
				where: {
					userId: uid,
				},
			})
			.catch((err) => {
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

	// 유저 추가
	// 근데 이렇게 isuniqueinfo 만들어서 쓰는거보다 그냥 find해서 찾는게 코드가 더 줄지 않을까?
	async insertUser(createUserDto: CreateUserDto) {
		const { userId, password, name, uniqueNum, status } = createUserDto;
		
		if (await this.isUniqueInfo('userId', userId)) {
			return {
				code: 'FAIL_ID_DUPLICATION',
				msg: '중복 ID입니다.',
				data: null,
			};
		}

		if (await this.isUniqueInfo('uniqueNum', uniqueNum)) {
			return {
				code: 'FAIL_UNIQUENUM_DUPLICATION',
				msg: '중복 학번입니다.',
				data: null,
			};
		}

		if (status !== 'student' && status !== 'professor') {
			return {
				code: 'FAIL_STATUS_WRONG',
				msg: '잘못된 상태 정보 입니다.',
				data: null,
			};
		}

		const salt = await genSalt(10);
		const hs = await hash(password, salt);

		const result = await this.userRepository
			.insert({
				userId: userId,
				password: hs,
				name: name,
				uniqueNum: uniqueNum,
				status: status,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '유저 추가에 성공했습니다.',
			data: result,
		};
	}

	// 유저 정보 업데이트
	// 유저 여부 검증은 controller에서 하고 내려올것
	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		const { name, password, status } = updateUserDto;

		if (status !== 'student' && status !== 'professor') {
			return {
				code: 'FAIL_STATUS_WRONG',
				msg: '잘못된 상태 정보 입니다.',
				data: null,
			};
		}

		const salt = await genSalt(10);
		const hs = await hash(password, salt);

		const result = await this.userRepository
			.update(id, {
				password: hs,
				name: name,
				status: status,
			})
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '유저 정보 변경에 성공했습니다.',
			data: result,
		};
	}

	// 삭제와 동시에 로그아웃 되어야함.
	// 마찬가지로 controller에서 검증하고 내려옴
	// 일단 해보고 안되면 그다음에 트랜잭션 걸자.
	async deleteUser(userData: User) {
		const result = await this.userRepository
			.remove(userData)
			.catch((err) => {
				throw new InternalServerErrorException();
			});

		return {
			code: 'SUCCESS',
			msg: '유저 정보 삭제에 성공했습니다.',
			data: result,
		};
	}
}
