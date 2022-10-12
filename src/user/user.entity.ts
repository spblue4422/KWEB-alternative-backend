import { ApiProperty } from '@nestjs/swagger';
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: 'id' })
	id: number;

	@Column({ unique: true })
	@ApiProperty({ description: '로그인 계정' })
	userId: string;

	@Column()
	@ApiProperty({ description: '비밀번호' })
	password: string;

	@Column()
	@ApiProperty({ description: '이름' })
	name: string;

	@Column({ unique: true })
	@ApiProperty({ description: '학번/교번' })
	uniqueNum: string;

	@Column()
	@ApiProperty({ description: '상태' })
	status: string;

	@CreateDateColumn()
	@ApiProperty({ description: '등록 일자' })
	createdDate: Date;
}
